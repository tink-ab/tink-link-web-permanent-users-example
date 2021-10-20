# Tink Link web permanent users example

This is an example app showing how to add/refresh credentials for permanent users. This project was bootstrapped with [create-react-app](https://github.com/facebook/create-react-app).

## Installation

Running this example application requires `CLIENT_ID` and `CLIENT_SECRET` which you can get by creating a developer account at [Tink Console](https://console.tink.com).

## Running the app locally

1. Install dependencies

```sh
yarn
```

2. Copy `.env.example` to `.env`

```bash
# Copy the .env.example
cp .env.example .env
```

3. Set variables in `.env`.

```bash
REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID='<YOUR_CLIENT_ID>'
TINK_LINK_PERMANENT_USERS_CLIENT_SECRET='<YOUR_CLIENT_SECRET>'
```

4. Run client and server in terminal separately

```
yarn start:client
yarn start:server
```

The client app is available at `http://localhost:3000`. The server is running at `http://localhost:8080`.

## Optional

If you want to be able to initiate payments, you need to generate a `paymentRequestId` following [this guide](https://docs.tink.com/resources/payments/start-payment#1-create-a-payment-request) and set it as `REACT_APP_TINK_LINK_PERMANENT_PAYMENT_REQUEST_ID` in `.env`.

## Resources

For more information about permanent users please visit [our documentation page](https://docs.tink.com/resources/tutorials/permanent-users).
