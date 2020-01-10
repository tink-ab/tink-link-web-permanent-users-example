# Tink Link web permanent users example

This is an example app showing how to add/refresh credentials for permanent users. This project was bootstrapped with [create-react-app](https://github.com/facebook/create-react-app).

## Installation

Running this example application requires `CLIENT_ID` and `CLIENT_SECRET` which you can get by creating a developer account at [Tink Console](https://console.tink.com).

## Running the app locally

1. Install dependencies

```
yarn
```

2. Set your client identifier and client secret as environment variables

```
export REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID='<YOUR_CLIENT_ID>'
export REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_SECRET='<YOUR_CLIENT_SECRET>'
```

3. Run client and server in terminal separately

```
yarn start:client
yarn start:server
```

The client app is available at `http://localhost:3000`. The server is running at `http://localhost:8080`.

## Resources

For more information about permanent users please visit [our documentation page](https://docs.tink.com/resources/tutorials/permanent-users).
