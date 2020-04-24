import React, { useState, useEffect } from 'react';
import {
  AuthorizationCode,
  getUserCredentials,
  getAddCredentialsLink,
  generateAuthorizationCode,
  Credentials,
  refreshCredentialsLink,
  authenticateCredentialsLink,
  getPaymentLink,
} from './api';
import { Header } from './Header';
import { CheckIcon } from './images/CheckIcon';
import { PrettyCode } from './PrettyCode';

const PERMANENT_PAYMENT_REQUEST_ID = process.env.REACT_APP_TINK_LINK_PERMANENT_PAYMENT_REQUEST_ID;

type CredentialsListProps = {
  userId: string;
};

export const CredentialsList: React.FC<CredentialsListProps> = ({ userId }) => {
  const [credentials, setCredentials] = useState<Credentials[] | undefined>(undefined);
  const [authorizationCode, setAuthorizationCode] = useState<AuthorizationCode | undefined>(
    undefined
  );

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

  const initiatePayment = async (credentialsId: string) => {
    if (authorizationCode && PERMANENT_PAYMENT_REQUEST_ID) {
      const tinkLinkUrl = getPaymentLink(
        authorizationCode.code,
        credentialsId,
        userId,
        PERMANENT_PAYMENT_REQUEST_ID
      );

      window.location.href = tinkLinkUrl;
    }
  };

  return (
    <>
      <Header />

      <div className="content">
        <div className="heading-1">Add credentials to permanent user</div>

        <div className="paper">
          <div className="display-flex">
            <div>
              <CheckIcon />
            </div>
            <div className="ml-16 mr-40">
              <div className="heading-2">Credentials were successfully added to user!</div>
              {!credentials && <div>Fetching credentials ...</div>}
              {credentials &&
                credentials.map((credential) => (
                  <div key={credential.id}>
                    <PrettyCode code={JSON.stringify(credential, null, 2)} className="mt-20" />
                    {authorizationCode && (
                      <>
                        <a
                          className="button mt-24"
                          href={refreshCredentialsLink(
                            authorizationCode.code,
                            userId,
                            credential.id
                          )}
                        >
                          Refresh credentials
                        </a>
                        {credential.providerName.includes('open-banking') && (
                          <a
                            className="button mt-24 ml-16"
                            href={authenticateCredentialsLink(
                              authorizationCode.code,
                              userId,
                              credential.id
                            )}
                          >
                            Authenticate PSD2 credentials
                          </a>
                        )}

                        {PERMANENT_PAYMENT_REQUEST_ID && (
                          <button
                            type="button"
                            className="button mt-24 ml-16"
                            onClick={() => {
                              initiatePayment(credential.id);
                            }}
                          >
                            Initiate payment
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ))}

              {authorizationCode && (
                <div>
                  <div className="mt-40">Tink Link url to add additional credentials</div>
                  <pre className="code break-word mt-16 text">
                    {getAddCredentialsLink(authorizationCode.code, userId)}
                  </pre>

                  <a
                    className="button mt-24 mb-40"
                    href={getAddCredentialsLink(authorizationCode.code, userId)}
                  >
                    Add another credentials to this user
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="walking-hand my-auto mt-120 mb-80"></div>
      </div>
    </>
  );
};
