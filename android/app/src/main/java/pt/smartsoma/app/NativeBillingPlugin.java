package pt.smartsoma.app;

import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
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

// Read-only preparation: purchasing and acknowledgement stay disabled until
// server verification, account binding and lifecycle handling are complete.
@CapacitorPlugin(name = "NativeBilling")
public class NativeBillingPlugin extends Plugin {
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

        Session(PluginCall call) {
            this.call = call;
            client = BillingClient.newBuilder(getContext())
                .setListener((result, purchases) -> {})
                .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
                .build();
        }

        void reject(String message) {
            if (!finished.compareAndSet(false, true)) return;
            client.endConnection();
            call.reject(message);
        }

        void resolve(JSObject data) {
            if (!finished.compareAndSet(false, true)) return;
            client.endConnection();
            call.resolve(data);
        }
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
                .setProductType(BillingClient.ProductType.SUBS).build();
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
                    entries.put(entry);
                }
                JSObject data = new JSObject();
                data.put("purchases", entries);
                session.resolve(data);
            });
        });
    }
}
