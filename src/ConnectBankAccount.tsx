import React, { useEffect } from "react";
import { Header } from "./Header";
import { getAddCredentialsLink } from "./api";

export const ConnectBankAccount = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  if (!code) {
    throw new Error("`code` missing in url search parametes");
  }

  useEffect(() => {
    const eventHandler = (message: MessageEvent) => {
      if (message.origin !== "http://localhost:3006") {
        return;
      }

      const data = JSON.parse(message.data);

      if (data.type === "none") {
        window.location.href = `/callback?state=${state}`;
      }

      if (["error", "credentials"].includes(data.type)) {
        window.location.href = `/callback?state=${state}&error=${data.error.status}`;
      }
    };

    window.addEventListener("message", eventHandler, false);

    return () => {
      window.removeEventListener("message", eventHandler);
    };
  }, [state]);

  return (
    <>
      <Header />
      <div className="content">
        <div className="heading-1">Connect your bank account</div>

        <div className="paper">
          <iframe
            title="Tink Link"
            src={`${getAddCredentialsLink(code, "state")}&iframe=true`}
            frameBorder="0"
            height={700}
            width={400}
            style={{
              border: "1px solid #ccc",
              display: "block",
              margin: "0 auto"
            }}
          ></iframe>
        </div>
      </div>
    </>
  );
};
