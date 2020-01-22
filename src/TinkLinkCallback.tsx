import React from "react";
import { Error } from "./Error";
import { RefreshCredentials } from "./RefreshCredentials";

export const TinkLinkCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get("error");
  const userId = urlParams.get("state");

  if (error) {
    const errorMessage = urlParams.get("message") || undefined;

    return <Error error={error} errorMessage={errorMessage} />;
  }

  if (userId) {
    return <RefreshCredentials userId={userId} />;
  }

  return null;
};
