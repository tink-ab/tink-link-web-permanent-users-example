import { env } from '../env';

export type User = {
  user_id: string;
};

const baseParams = [
  `client_id=${env.clientId}`,
  'redirect_uri=http://localhost:3000/callback',
  'locale=en_US',
  `test=true`,
]

export const createPermanentUser = async (): Promise<User> => {
  const response = await fetch('/permanent-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ market: env.market })
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
    ...baseParams,
    'scope=user:read,credentials:read',
    `market=${env.market}`,
    `state=${userId}`,
    `authorization_code=${authorizationCode}`,
  ];

  return `${env.tinkLinkUrl}/1.0/credentials/add?${params.join('&')}`;
};

export const getUpdateConsentLink = (
  authorizationCode: string,
  userId: string,
  credentialsId: string
) => {
  const params = [
    ...baseParams,
    `state=${userId}`,
    `credentials_id=${credentialsId}`,
    `authorization_code=${authorizationCode}`,
  ];

  return `${env.tinkLinkUrl}/1.0/transactions/update-consent?${params.join('&')}`;
};

export const getTransactionsLink = (authorizationCode: string, userId: string) => {
  // Read more about Tink Link initialization parameters: https://docs.tink.com/api/#initialization-parameters
  const params = [
    ...baseParams,
    'scope=user:read,credentials:read',
    `market=${env.market}`,
    `state=${userId}`,
    `authorization_code=${authorizationCode}`,
    `refreshable_items=CHECKING_ACCOUNTS,CHECKING_TRANSACTIONS`,
  ];

  return `${env.tinkLinkUrl}/1.0/transactions/connect-accounts?${params.join('&')}`;
};

export const getPaymentLink = (
  authorizationCode: string,
  credentialsId: string,
  userId: string,
  paymentRequestId: string
) => {
  const params = [
    ...baseParams,
    'scope=user:read,credentials:read',
    `market=${env.market}`,
    `state=${userId}`,
    `authorization_code=${authorizationCode}`,
    `payment_request_id=${paymentRequestId}`,
    `credentials_id=${credentialsId}`,
  ];

  const sessionId = '';
  if (sessionId) {
    params.push(`session_id=${sessionId}`);
  }

  return `${env.tinkLinkUrl}/1.0/pay/credentials?${params.join('&')}`;
};

export const refreshCredentialsLink = (
  authorizationCode: string,
  userId: string,
  credentialsId: string
) => {
  const params = [
    ...baseParams,
    'scope=user:read,credentials:read',
    `market=${env.market}`,
    `state=${userId}`,
    `authorization_code=${authorizationCode}`,
    `credentials_id=${credentialsId}`,
    'authenticate=false',
  ];

  return `${env.tinkLinkUrl}/1.0/credentials/refresh?${params.join('&')}`;
};

export const authenticateCredentialsLink = (
  authorizationCode: string,
  userId: string,
  credentialsId: string
) => {
  // Read more about Tink Link initialization parameters: https://docs.tink.com/api/#initialization-parameters
  const params = [
    ...baseParams,
    'scope=user:read,credentials:read',
    `market=${env.market}`,
    `state=${userId}`,
    `authorization_code=${authorizationCode}`,
    `credentials_id=${credentialsId}`,
  ];

  return `${env.tinkLinkUrl}/1.0/credentials/authenticate?${params.join('&')}`;
};
