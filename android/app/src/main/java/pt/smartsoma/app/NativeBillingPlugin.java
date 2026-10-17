package pt.smartsoma.app;

import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.Collections;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Consumer;

@CapacitorPlugin(name = "NativeBilling")
public class NativeBillingPlugin extends Plugin {
    // Do not enable until server verification, persistence, acknowledgement,
    // lifecycle handling and account deletion have been completed and tested.
    private static final boolean PURCHASES_ENABLED = false;
    private final AtomicBoolean purchaseInProgress = new AtomicBoolean();

    private void withBilling(PluginCall call, Consumer<Session> action) {
        Session session = new Session(call);
        session.client.startConnection(new BillingClientStateListener() {
            @Override public void onBillingSetupFinished(BillingResult result) {
                if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    session.reject("Google Play indisponível");
                } else {
                    action.accept(session);
                }
            }
            @Override public void onBillingServiceDisconnected() {
                session.reject("Ligação à Google Play interrompida");
            }
        });
    }

    private class Session {
        final PluginCall call;
        final BillingClient client;
        final AtomicBoolean finished = new AtomicBoolean();
        final Runnable onFinished;

        Session(PluginCall call) {
            this(call, (result, purchases) -> {}, () -> {});
        }

        Session(PluginCall call, PurchasesUpdatedListener listener, Runnable onFinished) {
            this.call = call;
            this.onFinished = onFinished;
            client = BillingClient.newBuilder(getContext())
                .setListener(listener)
                .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
                .build();
        }

        void reject(String message) {
            if (!finished.compareAndSet(false, true)) return;
            client.endConnection();
            onFinished.run();
            call.reject(message);
        }

        void resolve(JSObject data) {
            if (!finished.compareAndSet(false, true)) return;
            client.endConnection();
            onFinished.run();
            call.resolve(data);
        }
    }

    @PluginMethod
    public void startSubscriptionPurchase(PluginCall call) {
        if (!PURCHASES_ENABLED) {
            call.reject("Compras Google Play ainda não disponíveis");
            return;
        }
        String productId = call.getString("productId", "");
        String basePlanId = call.getString("basePlanId", "");
        String offerId = call.getString("offerId");
        String accountId = call.getString("accountId", "");
        if (!productId.matches("[a-z0-9][a-z0-9._-]{0,99}") ||
            !basePlanId.matches("[a-z0-9][a-z0-9-]{0,62}") ||
            (offerId != null && !offerId.matches("[a-z0-9][a-z0-9-]{0,62}")) ||
            !accountId.matches("[a-f0-9]{64}")) {
            call.reject("Dados de compra inválidos");
            return;
        }
        if (!purchaseInProgress.compareAndSet(false, true)) {
            call.reject("Já existe uma compra em curso");
            return;
        }

        final Session[] current = new Session[1];
        current[0] = new Session(call, (result, purchases) -> {
            Session session = current[0];
            if (result.getResponseCode() == BillingClient.BillingResponseCode.USER_CANCELED) {
                JSObject response = new JSObject();
                response.put("status", "canceled");
                session.resolve(response);
                return;
            }
            if (result.getResponseCode() != BillingClient.BillingResponseCode.OK || purchases == null || purchases.size() != 1 ||
                !purchases.get(0).getProducts().contains(productId)) {
                session.reject("Não foi possível concluir a compra");
                return;
            }
            Purchase purchase = purchases.get(0);
            if (purchase.getPurchaseState() != Purchase.PurchaseState.PURCHASED &&
                purchase.getPurchaseState() != Purchase.PurchaseState.PENDING) {
                session.reject("Estado de compra desconhecido");
                return;
            }
            JSObject response = new JSObject();
            response.put("status", purchase.getPurchaseState() == Purchase.PurchaseState.PENDING ? "pending" : "purchased");
            response.put("purchaseToken", purchase.getPurchaseToken());
            session.resolve(response);
        }, () -> purchaseInProgress.set(false));
        Session session = current[0];
        session.client.startConnection(new BillingClientStateListener() {
            @Override public void onBillingSetupFinished(BillingResult result) {
                if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    session.reject("Google Play indisponível");
                    return;
                }
                QueryProductDetailsParams.Product product = QueryProductDetailsParams.Product.newBuilder()
                    .setProductId(productId).setProductType(BillingClient.ProductType.SUBS).build();
                QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                    .setProductList(Collections.singletonList(product)).build();
                session.client.queryProductDetailsAsync(params, (queryResult, details) -> {
                    if (queryResult.getResponseCode() != BillingClient.BillingResponseCode.OK ||
                        details.getProductDetailsList().size() != 1) {
                        session.reject("Subscrição indisponível");
                        return;
                    }
                    ProductDetails detail = details.getProductDetailsList().get(0);
                    ProductDetails.SubscriptionOfferDetails selected = null;
                    if (detail.getSubscriptionOfferDetails() != null) {
                        for (ProductDetails.SubscriptionOfferDetails offer : detail.getSubscriptionOfferDetails()) {
                            if (basePlanId.equals(offer.getBasePlanId()) &&
                                java.util.Objects.equals(offerId, offer.getOfferId())) {
                                if (selected != null) {
                                    session.reject("Oferta ambígua");
                                    return;
                                }
                                selected = offer;
                            }
                        }
                    }
                    if (selected == null || getActivity() == null) {
                        session.reject("Oferta indisponível");
                        return;
                    }
                    BillingFlowParams.ProductDetailsParams item = BillingFlowParams.ProductDetailsParams.newBuilder()
                        .setProductDetails(detail).setOfferToken(selected.getOfferToken()).build();
                    BillingFlowParams flow = BillingFlowParams.newBuilder()
                        .setProductDetailsParamsList(Collections.singletonList(item))
                        .setObfuscatedAccountId(accountId).build();
                    getActivity().runOnUiThread(() -> {
                        if (session.finished.get()) return;
                        if (getActivity() == null) {
                            session.reject("Aplicação indisponível");
                            return;
                        }
                        BillingResult launch = session.client.launchBillingFlow(getActivity(), flow);
                        if (launch.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                            session.reject("Não foi possível abrir a Google Play");
                        }
                    });
                });
            }
            @Override public void onBillingServiceDisconnected() {
                session.reject("Ligação à Google Play interrompida");
            }
        });
    }

    @PluginMethod
    public void getSubscriptionProduct(PluginCall call) {
        String id = call.getString("productId", "");
        if (!id.matches("[a-z0-9][a-z0-9._-]{0,99}")) {
            call.reject("Identificador de produto inválido");
            return;
        }
        withBilling(call, session -> {
            QueryProductDetailsParams.Product product = QueryProductDetailsParams.Product.newBuilder()
                .setProductId(id).setProductType(BillingClient.ProductType.SUBS).build();
            QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                .setProductList(Collections.singletonList(product)).build();
            session.client.queryProductDetailsAsync(params, (result, details) -> {
                if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    session.reject("Não foi possível consultar a subscrição");
                    return;
                }
                JSArray products = new JSArray();
                for (ProductDetails detail : details.getProductDetailsList()) {
                    JSObject entry = new JSObject();
                    entry.put("productId", detail.getProductId());
                    entry.put("name", detail.getName());
                    JSArray offers = new JSArray();
                    if (detail.getSubscriptionOfferDetails() != null) {
                        for (ProductDetails.SubscriptionOfferDetails offer : detail.getSubscriptionOfferDetails()) {
                            JSObject entryOffer = new JSObject();
                            entryOffer.put("basePlanId", offer.getBasePlanId());
                            entryOffer.put("offerId", offer.getOfferId());
                            JSArray phases = new JSArray();
                            for (ProductDetails.PricingPhase phase : offer.getPricingPhases().getPricingPhaseList()) {
                                JSObject price = new JSObject();
                                price.put("formattedPrice", phase.getFormattedPrice());
                                price.put("billingPeriod", phase.getBillingPeriod());
                                price.put("billingCycleCount", phase.getBillingCycleCount());
                                price.put("recurrenceMode", phase.getRecurrenceMode());
                                phases.put(price);
                            }
                            entryOffer.put("phases", phases);
                            offers.put(entryOffer);
                        }
                    }
                    entry.put("offers", offers);
                    products.put(entry);
                }
                JSObject data = new JSObject();
                data.put("products", products);
                session.resolve(data);
            });
        });
    }

    @PluginMethod
    public void getOwnedSubscriptions(PluginCall call) {
        withBilling(call, session -> {
            QueryPurchasesParams params = QueryPurchasesParams.newBuilder()
                .setProductType(BillingClient.ProductType.SUBS)
                .includeSuspendedSubscriptions(true).build();
            session.client.queryPurchasesAsync(params, (result, purchases) -> {
                if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    session.reject("Não foi possível consultar as compras");
                    return;
                }
                JSArray entries = new JSArray();
                for (Purchase purchase : purchases) {
                    JSObject entry = new JSObject();
                    JSArray products = new JSArray();
                    for (String id : purchase.getProducts()) products.put(id);
                    entry.put("productIds", products);
                    entry.put("purchaseToken", purchase.getPurchaseToken());
                    entry.put("purchaseState", purchase.getPurchaseState());
                    entry.put("acknowledged", purchase.isAcknowledged());
                    entry.put("suspended", purchase.isSuspended());
                    entries.put(entry);
                }
                JSObject data = new JSObject();
                data.put("purchases", entries);
                session.resolve(data);
            });
        });
    }
}
