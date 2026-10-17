package pt.smartsoma.app;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "NativeAuth")
public class NativeAuthPlugin extends Plugin {
    @PluginMethod
    public void openBrowser(PluginCall call) {
        String value = call.getString("url", "");
        Uri uri = Uri.parse(value);
        if (!"https".equals(uri.getScheme()) || !"ojhnierbhqrwxvabrzkt.supabase.co".equals(uri.getHost())
                || !"/auth/v1/authorize".equals(uri.getPath())) {
            call.reject("URL de autenticação inválida");
            return;
        }
        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        Bundle extras = new Bundle();
        extras.putBinder("android.support.customtabs.extra.SESSION", null);
        intent.putExtras(extras);
        try {
            getActivity().startActivity(intent);
            call.resolve();
        } catch (ActivityNotFoundException error) {
            call.reject("Nenhum navegador disponível", error);
        }
    }
}
