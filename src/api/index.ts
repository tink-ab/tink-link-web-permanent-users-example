const TINK_LINK_URL = 'https://link.tink.com';

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
  // Read more about Tink Link initialization parameters: https://docs.tink.com/api/#initialization-parameters
  const params = [
    `client_id=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID}`,
    'redirect_uri=http://localhost:3000/callback',
    'scope=user:read,credentials:read',
    `market=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_MARKET}`,
    'locale=en_US',
    `state=${userId}`,
    `authorization_code=${authorizationCode}`,
    'test=true', // Change this to `false` if you want to see real banks instead of test providers.
  ];

  return `${TINK_LINK_URL}/1.0/credentials/add?${params.join('&')}`;
};

export const getPaymentLink = (
  authorizationCode: string,
  credentialsId: string,
  userId: string,
  paymentRequestId: string
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
    `payment_request_id=${paymentRequestId}`,
    `credentials_id=${credentialsId}`,
    'test=true', // Change this to `false` if you want to see real banks instead of test providers.
  ];

  return `${TINK_LINK_URL}/1.0/pay/credentials?${params.join('&')}`;
};

export const refreshCredentialsLink = (
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
  ];

  return `${TINK_LINK_URL}/1.0/credentials/authenticate?${params.join('&')}`;
};
