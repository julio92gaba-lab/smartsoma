package pt.smartsoma.app;

import android.os.Bundle;
import android.os.Build;
import android.os.SystemClock;
import android.content.Intent;
import android.net.Uri;
import android.graphics.Color;
import android.content.res.ColorStateList;
import android.content.res.Configuration;
import android.view.Gravity;
import android.view.View;
import android.webkit.WebView;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.Toast;
import androidx.activity.OnBackPressedCallback;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private long lastExitPress;
    private FrameLayout startupOverlay;
    private boolean startupDismissRequested;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(NativeAuthPlugin.class);
        registerPlugin(NativeDownloadsPlugin.class);
        registerPlugin(NativeStartupPlugin.class);
        registerPlugin(NativeBillingPlugin.class);
        super.onCreate(savedInstanceState);
        getBridge().getWebView().setBackgroundColor(Color.parseColor("#0E5830"));
        protectNavigationBar();
        showStartupOverlay();
        handleAuthCallback(getIntent());
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                getBridge().getWebView().evaluateJavascript(
                    "Boolean(window.SmartSomaUI && window.SmartSomaUI.back && window.SmartSomaUI.back())",
                    result -> {
                        if ("true".equals(result)) {
                            lastExitPress = 0;
                        } else if (lastExitPress != 0 && SystemClock.elapsedRealtime() - lastExitPress < 2000) {
                            finish();
                        } else {
                            lastExitPress = SystemClock.elapsedRealtime();
                            Toast.makeText(MainActivity.this, "Para sair, pressione novamente", Toast.LENGTH_SHORT).show();
                        }
                    }
                );
            }
        });
    }

    private int dp(float value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private void protectNavigationBar() {
        View shade = new View(this);
        shade.setBackgroundColor(Color.argb(220, 6, 18, 10));
        FrameLayout.LayoutParams layout = new FrameLayout.LayoutParams(-1, 0, Gravity.BOTTOM);
        final int originalColor = getWindow().getNavigationBarColor();
        final boolean originalContrast = Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q
            && getWindow().isNavigationBarContrastEnforced();
        final boolean[] previousButtons = { false };

        ViewCompat.setOnApplyWindowInsetsListener(shade, (view, insets) -> {
            int bottom = insets.getInsets(WindowInsetsCompat.Type.navigationBars()).bottom;
            boolean buttons = !insets.isVisible(WindowInsetsCompat.Type.ime()) && bottom > 0 && (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q
                || insets.getInsets(WindowInsetsCompat.Type.tappableElement()).bottom > 0);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                getWindow().setNavigationBarContrastEnforced(buttons ? false : originalContrast);
            }
            if (Build.VERSION.SDK_INT >= 35) {
                getWindow().setNavigationBarColor(buttons ? Color.TRANSPARENT : originalColor);
                int height = buttons ? bottom : 0;
                if (layout.height != height) {
                    layout.height = height;
                    view.setLayoutParams(layout);
                }
            } else {
                getWindow().setNavigationBarColor(buttons ? Color.argb(220, 6, 18, 10) : originalColor);
            }
            if (buttons) {
                view.post(() -> WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView())
                    .setAppearanceLightNavigationBars(false));
            } else if (previousButtons[0]) {
                boolean lightIcons = (getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK)
                    == Configuration.UI_MODE_NIGHT_YES;
                view.post(() -> WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView())
                    .setAppearanceLightNavigationBars(!lightIcons));
            }
            previousButtons[0] = buttons;
            return insets;
        });
        addContentView(shade, layout);
        ViewCompat.requestApplyInsets(shade);
    }

    private void showStartupOverlay() {
        startupOverlay = new FrameLayout(this);
        startupOverlay.setBackgroundColor(Color.parseColor("#0E5830"));

        ImageView symbol = new ImageView(this);
        symbol.setImageResource(R.drawable.smartsoma_splash_icon);
        int symbolSize = Math.min(dp(288), Math.round(getResources().getDisplayMetrics().widthPixels * .8f));
        startupOverlay.addView(symbol, new FrameLayout.LayoutParams(symbolSize, symbolSize, Gravity.CENTER));

        ImageView wordmark = new ImageView(this);
        wordmark.setImageResource(R.drawable.smartsoma_startup_wordmark);
        FrameLayout.LayoutParams wordmarkLayout = new FrameLayout.LayoutParams(dp(160), dp(40), Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL);
        startupOverlay.addView(wordmark, wordmarkLayout);

        ProgressBar spinner = new ProgressBar(this);
        spinner.setIndeterminateTintList(ColorStateList.valueOf(Color.WHITE));
        FrameLayout.LayoutParams spinnerLayout = new FrameLayout.LayoutParams(dp(28), dp(28), Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL);
        startupOverlay.addView(spinner, spinnerLayout);
        ViewCompat.setOnApplyWindowInsetsListener(startupOverlay, (view, insets) -> {
            int bottom = insets.getInsets(WindowInsetsCompat.Type.systemBars()).bottom;
            wordmarkLayout.bottomMargin = dp(104) + bottom;
            spinnerLayout.bottomMargin = dp(48) + bottom;
            wordmark.setLayoutParams(wordmarkLayout);
            spinner.setLayoutParams(spinnerLayout);
            return insets;
        });
        addContentView(startupOverlay, new FrameLayout.LayoutParams(-1, -1));
        startupOverlay.postDelayed(this::removeStartupOverlay, 15000);
    }

    public void dismissStartupOverlay() {
        if (startupOverlay == null || startupDismissRequested) return;
        startupDismissRequested = true;
        getBridge().getWebView().postVisualStateCallback(0, new WebView.VisualStateCallback() {
            @Override
            public void onComplete(long requestId) {
                removeStartupOverlay();
            }
        });
    }

    private void removeStartupOverlay() {
        if (startupOverlay == null) return;
        FrameLayout overlay = startupOverlay;
        startupOverlay = null;
        overlay.animate().alpha(0f).setDuration(120).withEndAction(() -> {
            if (overlay.getParent() instanceof android.view.ViewGroup) {
                ((android.view.ViewGroup) overlay.getParent()).removeView(overlay);
            }
        }).start();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleAuthCallback(intent);
    }

    private void handleAuthCallback(Intent intent) {
        Uri uri = intent == null ? null : intent.getData();
        if (getBridge() == null || uri == null || !"pt.smartsoma.app".equals(uri.getScheme())
                || !"auth".equals(uri.getHost()) || !"/callback".equals(uri.getPath())) return;
        intent.setData(null); // O código é de utilização única e não deve ser repetido ao recriar a activity.
        String code = uri.getQueryParameter("code");
        String query = code != null && code.matches("[A-Za-z0-9_-]{1,512}")
                ? "native_oauth_code=" + Uri.encode(code) : "native_oauth_error=1";
        getBridge().getWebView().post(() -> getBridge().getWebView().loadUrl("https://localhost/login.html?" + query));
    }
}
