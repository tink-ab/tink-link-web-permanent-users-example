const TINK_LINK_URL = 'https://link.tink.com';
const TEST = true;

const PRODUCTS = 'ACCOUNT_CHECK,TRANSACTIONS,ASSETS,LIABILITIES';

export type User = {
  user_id: string;
};

export const createPermanentUser = async (): Promise<User> => {
  const response = await fetch('/permanent-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const permanentUserResponse = await response.json();

  return permanentUserResponse.data;
};

export const generateAuthorizationCode = async (userId: string): Promise<string> => {
  const response = await fetch('/authorization-code', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const authorizationCodeResponse = await response.json();

  return authorizationCodeResponse.data.code;
};

type CredentialsResponse = {
  credentials: Credentials[];
};

export type Credentials = {
  id: string;
  providerName: string;
  type: string;
  status: string;
  statusUpdated: number;
  statusPayload: string;
  updated: number;
  fields: any[];
  userId: string;
};

export const getUserCredentials = async (userId: string): Promise<CredentialsResponse> => {
  const response = await fetch(`/user/${userId}/credentials`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const credentialsResponse = await response.json();

  return credentialsResponse.data;
};

export type Transfer = {
  amount: number;
  created: number;
  currency: string;
  market: string;
  providerName: string;
  recipientName: string;
  sourceMessage: null;
  status: string;
  statusMessage: string;
  updated: number;
  destination: { accountNumber: string; type: string; reference: string };
};

export const getPaymentTransfers = async (paymentRequestId: string): Promise<Transfer[]> => {
  const response = await fetch(`/payments/${paymentRequestId}/transfers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const transfersResponse = await response.json();

  return transfersResponse.data;
};

export const getAddCredentialsLink = (authorizationCode: string, userId: string) => {
  const params = [
    `client_id=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID}`,
    'redirect_uri=http://localhost:3000/callback',
    'scope=user:read,credentials:read',
    `market=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_MARKET}`,
    'locale=en_US',
    `state=${userId}`,
    `authorization_code=${authorizationCode}`,
    `test=${TEST}`,
  ];

  return `${TINK_LINK_URL}/1.0/credentials/add?${params.join('&')}`;
};

export const getTransactionsUpdateConsentLink = (
  authorizationCode: string,
  userId: string,
  credentialsId: string
) => {
  const params = [
    `client_id=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID}`,
    'redirect_uri=http://localhost:3000/callback',
    'locale=en_US',
    `state=${userId}`,
    `credentials_id=${credentialsId}`,
    `authorization_code=${authorizationCode}`,
    `test=${TEST}`,
  ];

  return `${TINK_LINK_URL}/1.0/transactions/update-consent?${params.join('&')}`;
};

export const getTransactionsExtendConsentLink = (
  authorizationCode: string,
  userId: string,
  credentialsId: string
) => {
  const params = [
    `client_id=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID}`,
    'redirect_uri=http://localhost:3000/callback',
    'locale=en_US',
    `state=${userId}`,
    `credentials_id=${credentialsId}`,
    `authorization_code=${authorizationCode}`,
    `test=${TEST}`,
  ];

  return `${TINK_LINK_URL}/1.0/transactions/extend-consent?${params.join('&')}`;
};

export const getProductsUpdateConsentLink = (
  authorizationCode: string,
  userId: string,
  credentialsId: string
) => {
  const params = [
    `client_id=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID}`,
    `products=${PRODUCTS}`,
    'redirect_uri=http://localhost:3000/callback',
    'locale=en_US',
    `state=${userId}`,
    `credentials_id=${credentialsId}`,
    `authorization_code=${authorizationCode}`,
    `test=${TEST}`,
  ];

  return `${TINK_LINK_URL}/1.0/products/update-consent?${params.join('&')}`;
};

export const getAccountCheckUpdateConsentLink = (
  authorizationCode: string,
  userId: string,
  credentialsId: string
) => {
  const params = [
    `client_id=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID}`,
    'redirect_uri=http://localhost:3000/callback',
    'locale=en_US',
    `state=${userId}`,
    `credentials_id=${credentialsId}`,
    `authorization_code=${authorizationCode}`,
    `test=${TEST}`,
  ];

  return `${TINK_LINK_URL}/1.0/account-check/update-consent?${params.join('&')}`;
};

export const getTransactionsLink = (authorizationCode: string, userId: string) => {
  // Read more about Tink Link initialization parameters: https://docs.tink.com/api/#initialization-parameters
  const params = [
    `client_id=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID}`,
    'redirect_uri=http://localhost:3000/callback',
    `market=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_MARKET}`,
    'locale=en_US',
    `state=${userId}`,
    `authorization_code=${authorizationCode}`,
    `refreshable_items=CHECKING_ACCOUNTS,CHECKING_TRANSACTIONS`,
    `test=${TEST}`,
  ];

  return `${TINK_LINK_URL}/1.0/transactions/connect-accounts?${params.join('&')}`;
};

export const getProductsLink = (authorizationCode: string, userId: string) => {
  const params = [
    `client_id=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID}`,
    `products=${PRODUCTS}`,
    'redirect_uri=http://localhost:3000/callback',
    `market=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_MARKET}`,
    'locale=en_US',
    `state=${userId}`,
    `authorization_code=${authorizationCode}`,
    `test=${TEST}`,
  ];

  return `${TINK_LINK_URL}/1.0/products/connect-accounts?${params.join('&')}`;
};

export const getAccountCheckLink = (authorizationCode: string, userId: string) => {
  // Read more about Tink Link initialization parameters: https://docs.tink.com/api/#initialization-parameters
  const params = [
    `client_id=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID}`,
    'redirect_uri=http://localhost:3000/callback',
    `market=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_MARKET}`,
    'locale=en_US',
    `state=${userId}`,
    `authorization_code=${authorizationCode}`,
    `test=${TEST}`,
  ];

  return `${TINK_LINK_URL}/1.0/account-check/connect?${params.join('&')}`;
};

export const getPaymentLink = (
  authorizationCode: string,
  credentialsId: string,
  userId: string,
  paymentRequestId: string
) => {
  const params = [
    `client_id=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID}`,
    'redirect_uri=http://localhost:3000/callback',
    'scope=user:read,credentials:read',
    `market=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_MARKET}`,
    'locale=en_US',
    `state=${userId}`,
    `authorization_code=${authorizationCode}`,
    `payment_request_id=${paymentRequestId}`,
    `credentials_id=${credentialsId}`,
    `test=${TEST}`,
  ];

  const sessionId = '';
  if (sessionId) {
    params.push(`session_id=${sessionId}`);
  }

  return `${TINK_LINK_URL}/1.0/pay/credentials?${params.join('&')}`;
};

export const refreshCredentialsLink = (
  authorizationCode: string,
  userId: string,
  credentialsId: string
) => {
  const params = [
    `client_id=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID}`,
    'redirect_uri=http://localhost:3000/callback',
    'scope=user:read,credentials:read',
    `market=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_MARKET}`,
    'locale=en_US',
    `state=${userId}`,
    `authorization_code=${authorizationCode}`,
    `credentials_id=${credentialsId}`,
    'authenticate=false',
    `test=${TEST}`,
  ];

  return `${TINK_LINK_URL}/1.0/credentials/refresh?${params.join('&')}`;
};

export const authenticateCredentialsLink = (
  authorizationCode: string,
  userId: string,
  credentialsId: string
) => {
  // Read more about Tink Link initialization parameters: https://docs.tink.com/api/#initialization-parameters
  const params = [
    `client_id=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID}`,
    'redirect_uri=http://localhost:3000/callback',
    'scope=user:read,credentials:read',
    `market=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_MARKET}`,
    'locale=en_US',
    `state=${userId}`,
    `authorization_code=${authorizationCode}`,
    `credentials_id=${credentialsId}`,
    `test=${TEST}`,
  ];

  return `${TINK_LINK_URL}/1.0/credentials/authenticate?${params.join('&')}`;
};
