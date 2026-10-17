package pt.smartsoma.app;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "NativeStartup")
public class NativeStartupPlugin extends Plugin {
    @PluginMethod
    public void ready(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            ((MainActivity) getActivity()).dismissStartupOverlay();
            call.resolve();
        });
    }
}
