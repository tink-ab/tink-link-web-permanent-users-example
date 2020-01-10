import React from "react";
import { RefreshCredentials } from "./RefreshCredentials";

export const TinkLinkCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get("error");
  const userId = urlParams.get("state");

  if (error) {
    const errorMessage = urlParams.get("message");

    return (
      <div>
        An error <b>{error}</b> occured with a message: {errorMessage}
      </div>
    );
  }

  if (userId) {
    return <RefreshCredentials userId={userId} />;
  }

  return null;
};
