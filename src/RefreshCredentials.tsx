import React, { useState, useEffect } from "react";
import {
  AuthorizationCode,
  getUserCredentials,
  getAddCredentialsLink,
  generateAuthorizationCode,
  Credentials,
  refreshCredentialsLink
} from "./api";

type RefreshCredentialsProps = {
  userId: string;
};

export const RefreshCredentials: React.FC<RefreshCredentialsProps> = ({
  userId
}) => {
  const [credentials, setCredentials] = useState<Credentials[] | undefined>(
    undefined
  );
  const [authorizationCode, setAuthorizationCode] = useState<
    AuthorizationCode | undefined
  >(undefined);

  useEffect(() => {
    const getCredentials = async (userId: string) => {
      const credentialsResponse = await getUserCredentials(userId);
      setCredentials(credentialsResponse.credentials);
    };

    const getAuthorizationCode = async (userId: string) => {
      const authorizationCode = await generateAuthorizationCode(userId);
      setAuthorizationCode(authorizationCode);
    };

    getAuthorizationCode(userId);

    getCredentials(userId);
  }, [userId]);

  return (
    <>
      <h3>
        User <pre style={{ display: "inline" }}>{userId}</pre> has added
        credentials successfuly!
      </h3>

      {!credentials && <div>Fetching credentials ...</div>}
      {credentials &&
        credentials.map(credential => (
          <div key={credential.id}>
            <textarea
              cols={50}
              rows={10}
              defaultValue={JSON.stringify(credential)}
            ></textarea>
            {authorizationCode && (
              <div>
                Tink Link url to refresh{" "}
                <pre style={{ display: "inline" }}>{credential.id}</pre>{" "}
                credentials: <br />
                <a
                  href={refreshCredentialsLink(
                    authorizationCode.code,
                    userId,
                    credential.id
                  )}
                >
                  Refresh credentials
                </a>
              </div>
            )}
          </div>
        ))}

      <hr />

      {authorizationCode && (
        <div>
          <a href={getAddCredentialsLink(authorizationCode.code, userId)}>
            Add another credentials to this user
          </a>
        </div>
      )}
    </>
  );
};
