const fetch = require('node-fetch');

const CLIENT_ID = process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID;
const CLIENT_SECRET = process.env.TINK_LINK_PERMANENT_USERS_CLIENT_SECRET;
const MARKET = process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_MARKET;

const DELEGATED_TINK_LINK_CLIENT_ID = '700e4c01c91c491888a1aec1dcec61b0';
// const API_URL = 'https://api.tink.com';
const API_URL = 'https://main.staging.oxford.tink.se';

const log = function (...args) {
  args.forEach((arg) => {
    console.log(arg);
  });
  console.log('\n\n');
};

let access_token = '';

const fetchClientAccessToken = async (reset = false) => {
  const scopes = [
    // 'authorization:grant,user:read,user:create', // needed for creating permanent users
    // 'credentials:read', // needed for fetching user credentials
    // 'payment:read', // needed for fetching payment request transfers
    // 'link-session:read', // reading sessions
    // 'link-session:write'
    'authorization:read,authorization:grant,user:read,credentials:read,providers:read,link-session:read', // withPaymentCreationScopes
    'payment:read,payment:write', // withPaymentCreationScopes
    'transfer:read,transfer:execute', // withDirectPaymentScopes
    'user:create', // withUserCreationScopes
    'provider-consents:read', // withProviderConsents
    'link-session:write', // withSessionCreationScopes
    'credentials:write,credentials:refresh', // withCredentialsCreationScopes
  ].join(',');

  if (!reset && !!access_token) {
    log('Returning previously created token');

    return access_token;
  }

  const clientAccessTokenResponse = await fetch(`${API_URL}/api/v1/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials&scope=${scopes}`,
  });

  const token = await clientAccessTokenResponse.json();
  log('Create client access token', token);

  access_token = token.access_token;

  return access_token;
};

const createPermanentUser = async (clientAccessToken) => {
  const userResponse = await fetch(`${API_URL}/api/v1/user/create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${clientAccessToken}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: `{"locale":"en_US","market":"${MARKET}"}`,
  });

  const user = await userResponse.json();
  log('Permanent user created', user);

  return user;
};

const createSession = async (clientAccessToken) => {
  const userResponse = await fetch(`${API_URL}/link/v1/session`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${clientAccessToken}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: `{"source_account_number":"iban://SE2885222529285409533697", "personal_identifier":"193705159294"}`,
  });

  const session = await userResponse.json();
  log('Session created', session);

  return session;
};

const createPaymentRequest = async (clientAccessToken) => {
  const userResponse = await fetch(`${API_URL}/api/v1/payments/requests`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${clientAccessToken}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: `{"destinations": [{"accountNumber": "45783748","type": "se-pg"}],"amount": 10,"currency": "SEK","market": "SE","recipientName": "Test AB","sourceMessage": "Payment for Gym Equipment","remittanceInformation": {"type": "OCR","value": "1885657302"}}`,
  });

  const paymentRequest = await userResponse.json();
  log('Payment request created', paymentRequest);

  return paymentRequest;
};

const fetchAuthorizationCode = async (userId, clientAccessToken) => {
  const scopes = [
    'providers:read,user:read,authorization:read', // base tink link scopes
    'credentials:read,credentials:refresh,credentials:write', // needed to enable add/refresh/authenticate credentials
    'payment:read,transfer:read,transfer:execute', // needed for executing payment requests - creating a transfers
    'link-session:read', // reading sessions
    'account-verification-reports:write', // needed for Account Check fetching accounts call
    'provider-consents:read', // TODO:
  ].join(',');
  const idHint = 'John Doe';

  const authorizationDelegateResponse = await fetch(
    `${API_URL}/api/v1/oauth/authorization-grant/delegate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${clientAccessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body: `response_type=code&user_id=${userId}&id_hint=${idHint}&actor_client_id=${DELEGATED_TINK_LINK_CLIENT_ID}&scope=${scopes}`,
    }
  );

  const authorizationCode = await authorizationDelegateResponse.json();
  log('Authorization code fetched', authorizationCode);

  return authorizationCode;
};

const getUserGrantAuthorizationCode = async (userId, clientAccessToken) => {
  const grantAuthorizationResponse = await fetch(`${API_URL}/api/v1/oauth/authorization-grant`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${clientAccessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    body: `user_id=${userId}&scope=credentials:read`,
  });

  const grantAuthorization = await grantAuthorizationResponse.json();
  log('Grant authorization', grantAuthorization);

  return grantAuthorization;
};

const fetchUserAccessToken = async (code) => {
  const userAccessTokenResponse = await fetch(`${API_URL}/api/v1/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=authorization_code&scope=credentials:read,credentials:write&code=${code}`,
  });

  const userAccessToken = await userAccessTokenResponse.json();
  log('Create user access token', userAccessToken);

  return userAccessToken;
};

const getUserCredentials = async (userAccessToken) => {
  const userCredentialsResponse = await fetch(`${API_URL}/api/v1/credentials/list`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userAccessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const userCredentials = await userCredentialsResponse.json();
  log('User credentials', userCredentials);

  return userCredentials;
};

const getPaymentTransfers = async (clientAccessToken, requestId) => {
  const response = await fetch(`${API_URL}/api/v1/payments/requests/${requestId}/transfers`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${clientAccessToken}`,
      'Content-Type': 'application/json;',
    },
  });

  const transferResponse = await response.json();
  log('Fetch transfer status response', transferResponse);

  return transferResponse;
};

module.exports = {
  fetchClientAccessToken,
  createPermanentUser,
  createSession,
  createPaymentRequest,
  fetchAuthorizationCode,
  getUserGrantAuthorizationCode,
  fetchUserAccessToken,
  getUserCredentials,
  getPaymentTransfers,
};
