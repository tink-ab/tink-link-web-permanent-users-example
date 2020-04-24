require('dotenv').config({ path: '.env.development' });
const api = require('./api');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

app.use(bodyParser.json());

if (!process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID) {
  throw Error('Environment variable `REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID` is not set.');
}

if (!process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_SECRET) {
  throw Error(
    'Environment variable `REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_SECRET` is not set.'
  );
}

app.post('/permanent-user', async (req, res) => {
  const token = await api.fetchClientAccessToken();
  const permanentUser = await api.createPermanentUser(token);

  res.json({ data: permanentUser });
});

app.post('/authorization-code', async (req, res) => {
  const token = await api.fetchClientAccessToken();
  const authorizationCode = await api.fetchAuthorizationCode(req.body.user_id, token);

  res.json({ data: authorizationCode });
});

app.get('/user/:userId/credentials', async (req, res) => {
  const clientAccessToken = await api.fetchClientAccessToken();
  const userGrantAuthorizationCode = await api.getUserGrantAuthorizationCode(
    req.params.userId,
    clientAccessToken
  );
  const userAccessToken = await api.fetchUserAccessToken(userGrantAuthorizationCode.code);
  const userCredentials = await api.getUserCredentials(userAccessToken.access_token);

  res.json({ data: userCredentials });
});

app.get('/payments/:paymentRequestId/transfers', async (req, res) => {
  const { paymentRequestId } = req.params;
  const token = await api.fetchClientAccessToken();

  const transfers = await api.getPaymentTransfers(token, paymentRequestId);
  return res.json({ data: transfers });
});

app.listen(port, () => console.log(`Example app listening on port ${port}.`));
