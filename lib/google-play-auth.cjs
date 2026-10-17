'use strict';

const { createPrivateKey } = require('node:crypto');
const { GoogleAuth } = require('google-auth-library');

const SCOPE = 'https://www.googleapis.com/auth/androidpublisher';

// Server configuration only; never accept credentials from a client. Restrict
// input to a service account and do not pass arbitrary URLs or credential JSON
// to the Google library. This helper is not connected to any API endpoint.
function createGooglePlayAccessTokenProvider(credentials, Auth = GoogleAuth) {
  try {
    if (credentials?.type !== 'service_account' || typeof credentials.client_email !== 'string' ||
        !/^[a-z0-9][a-z0-9-]*@[a-z0-9][a-z0-9.-]*\.iam\.gserviceaccount\.com$/.test(credentials.client_email) ||
        typeof credentials.private_key !== 'string' || credentials.private_key.length > 16384 ||
        !credentials.private_key.startsWith('-----BEGIN PRIVATE KEY-----')) throw new Error();
    const key = createPrivateKey(credentials.private_key);
    if (key.asymmetricKeyType !== 'rsa' || !Number.isInteger(key.asymmetricKeyDetails?.modulusLength) ||
        key.asymmetricKeyDetails.modulusLength < 2048) throw new Error();
    const auth = new Auth({ credentials: { type: 'service_account', client_email: credentials.client_email,
      private_key: credentials.private_key }, scopes: [SCOPE] });
    return async function getGoogleAccessToken() {
      try {
        const token = await auth.getAccessToken();
        if (typeof token !== 'string' || !/^[A-Za-z0-9._~+/-]+=*$/.test(token)) throw new Error();
        return token;
      } catch { throw new Error('Google Play authorization unavailable'); }
    };
  } catch { throw new Error('Invalid Google Play authorization configuration'); }
}

module.exports = { createGooglePlayAccessTokenProvider };
