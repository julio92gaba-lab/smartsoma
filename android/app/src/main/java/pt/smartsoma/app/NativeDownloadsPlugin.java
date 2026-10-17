package pt.smartsoma.app;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ContentValues;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.widget.Toast;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.IOException;
import java.io.OutputStream;

@CapacitorPlugin(name = "NativeDownloads")
public class NativeDownloadsPlugin extends Plugin {
    @PluginMethod
    public void savePdf(PluginCall call) {
        String filename = call.getString("filename", "");
        String encoded = call.getString("base64", "");
        if (!filename.matches("smartsoma-relatorio-[0-9]{2}-[0-9]{4}\\.pdf") || encoded.isEmpty()) {
            call.reject("PDF inválido");
            return;
        }
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
            Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            intent.setType("application/pdf");
            intent.putExtra(Intent.EXTRA_TITLE, filename);
            try {
                startActivityForResult(call, intent, "documentResult");
            } catch (ActivityNotFoundException error) {
                call.reject("Não foi possível abrir o seletor de ficheiros", error);
            }
            return;
        }

        ContentValues values = new ContentValues();
        values.put(MediaStore.Downloads.DISPLAY_NAME, filename);
        values.put(MediaStore.Downloads.MIME_TYPE, "application/pdf");
        values.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);
        values.put(MediaStore.Downloads.IS_PENDING, 1);
        Uri uri = null;
        try {
            uri = getContext().getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
            if (uri == null) throw new IOException("Não foi possível criar o ficheiro");
            writePdf(uri, encoded);
            ContentValues completed = new ContentValues();
            completed.put(MediaStore.Downloads.IS_PENDING, 0);
            if (getContext().getContentResolver().update(uri, completed, null, null) != 1) {
                throw new IOException("Não foi possível concluir o ficheiro");
            }
            Toast.makeText(getContext(), "PDF guardado em Downloads", Toast.LENGTH_LONG).show();
            call.resolve();
        } catch (Exception error) {
            if (uri != null) getContext().getContentResolver().delete(uri, null, null);
            call.reject("Não foi possível guardar o PDF", error);
        }
    }

    @ActivityCallback
    private void documentResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
            call.resolve();
            return;
        }
        try {
            writePdf(result.getData().getData(), call.getString("base64", ""));
            Toast.makeText(getContext(), "PDF guardado", Toast.LENGTH_LONG).show();
            call.resolve();
        } catch (Exception error) {
            call.reject("Não foi possível guardar o PDF", error);
        }
    }

    private void writePdf(Uri uri, String encoded) throws IOException {
        byte[] bytes = Base64.decode(encoded, Base64.DEFAULT);
        if (bytes.length < 5 || bytes[0] != '%' || bytes[1] != 'P' || bytes[2] != 'D' || bytes[3] != 'F' || bytes[4] != '-') {
            throw new IOException("Conteúdo PDF inválido");
        }
        try (OutputStream stream = getContext().getContentResolver().openOutputStream(uri, "w")) {
            if (stream == null) throw new IOException("Não foi possível abrir o ficheiro");
            stream.write(bytes);
        }
    }
}
