export const env = {
  tinkLinkUrl: process.env.REACT_APP_TINK_LINK_BASEURL || 'https://link.tink.com',
  market: process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_MARKET || 'SE',
  clientId: process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID,
  paymentRequestId: process.env.REACT_APP_TINK_LINK_PERMANENT_PAYMENT_REQUEST_ID || '',
}
