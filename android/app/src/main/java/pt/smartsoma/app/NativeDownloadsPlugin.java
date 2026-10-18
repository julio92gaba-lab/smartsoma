package pt.smartsoma.app;

import android.app.Activity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.Manifest;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.ContentValues;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.widget.Toast;
import androidx.activity.result.ActivityResult;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import java.io.IOException;
import java.io.OutputStream;

@CapacitorPlugin(name = "NativeDownloads", permissions = {
    @Permission(alias = "notifications", strings = { Manifest.permission.POST_NOTIFICATIONS })
})
public class NativeDownloadsPlugin extends Plugin {
    private static final String CHANNEL = "pdf_downloads";
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
        } catch (Exception error) {
            if (uri != null) getContext().getContentResolver().delete(uri, null, null);
            call.reject("Não foi possível guardar o PDF", error);
            return;
        }
        finishSavedPdf(call, uri, true);
    }

    @ActivityCallback
    private void documentResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
            call.resolve();
            return;
        }
        Uri uri = result.getData().getData();
        try {
            writePdf(uri, call.getString("base64", ""));
        } catch (Exception error) {
            call.reject("Não foi possível guardar o PDF", error);
            return;
        }
        finishSavedPdf(call, uri, false);
    }

    private void finishSavedPdf(PluginCall call, Uri uri, boolean inDownloads) {
        try {
            Toast.makeText(getContext(), inDownloads ? "PDF guardado em Downloads" : "PDF guardado", Toast.LENGTH_LONG).show();
            // A notification is optional: saving must succeed even if permission is denied.
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
                getPermissionState("notifications") != PermissionState.GRANTED) {
                boolean asked = getContext().getSharedPreferences("pdf_notifications", Context.MODE_PRIVATE)
                    .getBoolean("asked", false);
                if (!asked && getActivity() != null) {
                    getContext().getSharedPreferences("pdf_notifications", Context.MODE_PRIVATE).edit().putBoolean("asked", true).apply();
                    call.getData().put("savedPdfUri", uri.toString());
                    call.getData().put("savedPdfInDownloads", inDownloads);
                    getActivity().runOnUiThread(() -> {
                        try {
                            requestPermissionForAlias("notifications", call, "notificationPermissionResult");
                        } catch (RuntimeException ignored) {
                            call.resolve();
                        }
                    });
                    return;
                }
            }
            showDownloadNotification(uri, inDownloads);
        } catch (RuntimeException ignored) {
            // The PDF remains saved even if notifications are unavailable.
        }
        call.resolve();
    }

    @PermissionCallback
    private void notificationPermissionResult(PluginCall call) {
        if (call == null) return;
        String value = call.getString("savedPdfUri", "");
        if (!value.isEmpty() && getPermissionState("notifications") == PermissionState.GRANTED) {
            showDownloadNotification(Uri.parse(value), call.getBoolean("savedPdfInDownloads", false));
        }
        call.resolve();
    }

    private void showDownloadNotification(Uri uri, boolean inDownloads) {
        try {
            NotificationManagerCompat manager = NotificationManagerCompat.from(getContext());
            if (!manager.areNotificationsEnabled()) return;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                NotificationManager system = (NotificationManager) getContext().getSystemService(Context.NOTIFICATION_SERVICE);
                system.createNotificationChannel(new NotificationChannel(CHANNEL, "Downloads de PDF", NotificationManager.IMPORTANCE_DEFAULT));
            }
            Intent open = new Intent(Intent.ACTION_VIEW).setDataAndType(uri, "application/pdf")
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            PendingIntent action = PendingIntent.getActivity(getContext(), uri.hashCode(), open,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            String message = inDownloads ? "Guardado em Downloads. Toca para abrir." : "Guardado no local escolhido. Toca para abrir.";
            android.app.Notification notification = new NotificationCompat.Builder(getContext(), CHANNEL)
                .setSmallIcon(android.R.drawable.stat_sys_download_done)
                .setContentTitle("PDF guardado")
                .setContentText(message)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(message))
                .setVisibility(NotificationCompat.VISIBILITY_PRIVATE)
                .setContentIntent(action)
                .setAutoCancel(true)
                .build();
            manager.notify(uri.hashCode(), notification);
        } catch (RuntimeException ignored) {
            // The file is already saved; an unavailable notification must not undo it.
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
