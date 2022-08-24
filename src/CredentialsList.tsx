import React, { useState, useEffect } from 'react';
import {
  getUserCredentials,
  getAddCredentialsLink,
  generateAuthorizationCode,
  Credentials,
  refreshCredentialsLink,
  authenticateCredentialsLink,
  getPaymentTransfers,
  Transfer,
  getProductsUpdateConsentLink,
  getAccountCheckUpdateConsentLink,
  getTransactionsUpdateConsentLink,
} from './api';
import { Header } from './Header';
import { CheckIcon } from './images/CheckIcon';
import { PrettyCode } from './PrettyCode';
import { InitiatePaymentButton, TransfersList } from './Payments';

type CredentialsListProps = {
  userId: string;
  paymentRequestId: string | null;
};

export const CredentialsList: React.FC<CredentialsListProps> = ({ userId, paymentRequestId }) => {
  const [credentials, setCredentials] = useState<Credentials[] | undefined>(undefined);
  const [transfers, setTransfers] = useState<Transfer[] | undefined>(undefined);
  const [authorizationCode, setAuthorizationCode] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getCredentials = async (userId: string) => {
      const credentialsResponse = await getUserCredentials(userId);
      setCredentials(credentialsResponse.credentials);
    };

    const getAuthorizationCode = async (userId: string) => {
      const authorizationCode = await generateAuthorizationCode(userId);
      setAuthorizationCode(authorizationCode);
    };

    const getTransfers = async (paymentRequestId: string) => {
      const transfers = await getPaymentTransfers(paymentRequestId);
      setTransfers(transfers);
    };

    getCredentials(userId);
    getAuthorizationCode(userId);
    if (paymentRequestId) {
      getTransfers(paymentRequestId);
    }
  }, [userId, paymentRequestId]);

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
            <div className="full-width ml-16 mr-40">
              <div className="heading-2">Credentials were successfully added to user!</div>
              {!credentials && <div>Fetching credentials ...</div>}
              {credentials &&
                credentials.map((credential) => (
                  <div key={credential.id}>
                    <PrettyCode code={JSON.stringify(credential, null, 2)} className="mt-20" />
                    {authorizationCode && (
                      <>
                        <div className="mt-40">Refresh credentials</div>
                        <PrettyCode
                          className="mt-20"
                          highlightSyntax={false}
                          code={refreshCredentialsLink(authorizationCode, userId, credential.id)}
                        />
                        <a
                          className="button mt-24"
                          href={refreshCredentialsLink(authorizationCode, userId, credential.id)}
                        >
                          Refresh credentials
                        </a>
                        <a
                          className="button mt-24 ml-16"
                          href={authenticateCredentialsLink(
                            authorizationCode,
                            userId,
                            credential.id
                          )}
                        >
                          Authenticate PSD2 credentials
                        </a>

                        <InitiatePaymentButton
                          userId={userId}
                          credentialsId={credential.id}
                          authorizationCode={authorizationCode}
                        />

                        <div className="mt-40">Transactions: Update consent</div>
                        <PrettyCode
                          className="mt-20"
                          highlightSyntax={false}
                          code={getTransactionsUpdateConsentLink(
                            authorizationCode,
                            userId,
                            credential.id
                          )}
                        />

                        <div className="mt-40">Account Check: Update consent</div>
                        <PrettyCode
                          className="mt-20"
                          highlightSyntax={false}
                          code={getAccountCheckUpdateConsentLink(
                            authorizationCode,
                            userId,
                            credential.id
                          )}
                        />

                        <div className="mt-40">Products: Update consent</div>
                        <PrettyCode
                          className="mt-20"
                          highlightSyntax={false}
                          code={getProductsUpdateConsentLink(
                            authorizationCode,
                            userId,
                            credential.id
                          )}
                        />
                      </>
                    )}
                  </div>
                ))}

              {authorizationCode && (
                <>
                  <div className="mt-40">Add credentials</div>
                  <PrettyCode
                    className="mt-20"
                    highlightSyntax={false}
                    code={getAddCredentialsLink(authorizationCode, userId)}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <TransfersList transfers={transfers} />

        <div className="walking-hand my-auto mt-120 mb-80"></div>
      </div>
    </>
  );
};
