import React, { useEffect, useState } from 'react';
import {
  User,
  createPermanentUser,
  getAddCredentialsLink,
  generateAuthorizationCode,
  getTransactionsLink,
} from './api';
import { CheckIcon } from './images/CheckIcon';
import { Header } from './Header';
import { PrettyCode } from './PrettyCode';

export const AddCredentials: React.FC = () => {
  const [user, setUser] = useState<User | undefined>(undefined);

  const [authorizationCode, setAuthorizationCode] = useState<string | undefined>(undefined);

  const getUser = async () => {
    const user = await createPermanentUser();
    setUser(user);
  };

  const getAuthorizationCode = async (userId: string) => {
    const authorizationCode = await generateAuthorizationCode(userId);
    setAuthorizationCode(authorizationCode);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      getAuthorizationCode(user.user_id);
    }
  }, [user]);

  return (
    <>
      <Header />
      <div className="content">
        <div className="heading-1">Add credentials to permanent user</div>

        <div className="paper">
          <div className="display-flex">
            <div>{user ? <CheckIcon /> : <div className="step">1</div>}</div>
            <div className="ml-16">
              <div className="heading-2">Create a permanent user</div>
              <div>First we need a permanent user to add credentials to.</div>
              {user && <PrettyCode code={JSON.stringify(user, null, 2)} className="mt-20" />}
              <button className="button mt-24" onClick={() => getUser()} disabled={!!user}>
                Create permanent user
              </button>
            </div>
          </div>

          <div className="delimiter" />

          <div className="display-flex">
            <div>{authorizationCode ? <CheckIcon /> : <div className="step">2</div>}</div>
            <div className="ml-16">
              <div className={`heading-2 ${user ? '' : 'm-0'}`}>
                Generate an authorization token
              </div>

              {user && (
                <>
                  <div>
                    Then we need to generate authorization code for created permanent user which we
                    will use when launching Tink Link.
                  </div>
                  {authorizationCode && (
                    <PrettyCode
                      code={JSON.stringify(authorizationCode, null, 2)}
                      className="mt-20"
                    />
                  )}
                  <button
                    className="button mt-20"
                    disabled={!!authorizationCode}
                    onClick={() => user && getAuthorizationCode(user.user_id)}
                  >
                    Generate authorization code
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="delimiter"></div>

          <div className="display-flex">
            <div>
              <div className="step">3</div>
            </div>
            <div className="ml-16 full-width">
              <div className="heading-2">Open Tink Link</div>
              {authorizationCode && user && (
                <>
                  <div>Account Aggregation: Add Credentials</div>
                  <textarea rows={5} readOnly className="mt-20 mb-40">
                    {getAddCredentialsLink(authorizationCode, user.user_id)}
                  </textarea>
                  <div>Transactions: Connect Accounts</div>
                  <textarea rows={5} readOnly className="mt-20">
                    {getTransactionsLink(authorizationCode, user.user_id)}
                  </textarea>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="walking-hand my-auto mt-120 mb-80"></div>
      </div>
    </>
  );
};
