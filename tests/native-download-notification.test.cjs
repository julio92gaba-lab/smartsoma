'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('Android pede a permissão de notificações em cada descarga e abre o PDF guardado', () => {
  const source = fs.readFileSync('android/app/src/main/java/pt/smartsoma/app/NativeDownloadsPlugin.java', 'utf8');
  const manifest = fs.readFileSync('android/app/src/main/AndroidManifest.xml', 'utf8');
  assert.match(manifest, /android\.permission\.POST_NOTIFICATIONS/);
  assert.match(source, /writePdf\(uri, encoded\)[\s\S]*IS_PENDING, 0[\s\S]*finishSavedPdf\(call, uri, true\)/);
  assert.match(source, /writePdf\(uri, call\.getString\("base64", ""\)\)[\s\S]*finishSavedPdf\(call, uri, false\)/);
  assert.doesNotMatch(source, /pdf_notifications|getBoolean\("asked", false\)/);
  assert.match(source, /requestPermissionForAlias\("notifications", call, "notificationPermissionResult"\)/);
  assert.match(source, /notificationPermissionResult\(PluginCall call\)[\s\S]*call\.resolve\(\)/);
  assert.match(source, /Intent\.ACTION_VIEW\)\.setDataAndType\(uri, "application\/pdf"\)/);
  assert.match(source, /FLAG_GRANT_READ_URI_PERMISSION/);
  assert.match(source, /PendingIntent\.FLAG_IMMUTABLE/);
  assert.match(source, /NotificationCompat\.PRIORITY_DEFAULT/);
  assert.match(source, /Guardado em Downloads\. Toca para abrir/);
  assert.match(source, /catch \(RuntimeException ignored\)/);
});
