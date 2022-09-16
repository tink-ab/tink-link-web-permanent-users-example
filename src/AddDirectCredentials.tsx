import React, { useEffect, useState, useCallback } from 'react';
import {
  User,
  Session,
  PaymentRequest,
  createPermanentUser,
  createPaymentRequest,
  generateAuthorizationCode,
  createSession,
  getPaymentsLink,
} from './api';
import { CheckIcon } from './images/CheckIcon';
import { Header } from './Header';
import { PrettyCode } from './PrettyCode';

export const AddDirectCredentials: React.FC = () => {
  const [user, setUser] = useState<User | undefined>(undefined);

  const [authorizationCode, setAuthorizationCode] = useState<string | undefined>(undefined);
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | undefined>(undefined);

  const getUser = useCallback(async () => {
    const user = await createPermanentUser();
    setUser(user);
  }, [setUser]);

  const getSession = useCallback(async () => {
    const session = await createSession();
    setSession(session);
  }, [setSession]);

  const getPaymentRequest = useCallback(async () => {
    const paymentRequest = await createPaymentRequest();
    setPaymentRequest(paymentRequest);
  }, [setPaymentRequest]);

  const getAuthorizationCode = useCallback(async (userId: string) => {
    const code = await generateAuthorizationCode(userId);
    setAuthorizationCode(code);
  }, [setAuthorizationCode]);

  useEffect(() => {
    if (user) {
      getAuthorizationCode(user.user_id);
    }
  }, [getAuthorizationCode, user]);

  return (
    <>
      <Header />
      <div className='content'>
        <div className='heading-1'>Add credentials to permanent user</div>

        <div className='paper'>
          <div className='display-flex'>
            <div>{user ? <CheckIcon /> : <div className='step'>1</div>}</div>
            <div className='ml-16'>
              <div className='heading-2'>Create a permanent user</div>
              <div>First we need a permanent user to add credentials to.</div>
              {user && <PrettyCode code={JSON.stringify(user, null, 2)} className='mt-20' />}
              <button className='button mt-24' onClick={getUser}>
                Create permanent user
              </button>
            </div>
          </div>

          <div className='delimiter' />

          <div className='display-flex'>
            <div>{authorizationCode ? <CheckIcon /> : <div className='step'>2</div>}</div>
            <div className='ml-16'>
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
                      className='mt-20'
                    />
                  )}
                  <button
                    className='button mt-20'
                    onClick={() => user && getAuthorizationCode(user.user_id)}
                  >
                    Generate authorization code
                  </button>
                </>
              )}
            </div>
          </div>

          <div className='delimiter'></div>

          <div className='display-flex'>
            <div>{session ? <CheckIcon /> : <div className='step'>3</div>}</div>
            <div className='ml-16'>
              <div className={`heading-2 ${user ? '' : 'm-0'}`}>
                Generate a session
              </div>

              {user && (
                <>
                  <div>
                    Then we need to generate authorization code for created permanent user which we
                    will use when launching Tink Link.
                  </div>
                  {session && (
                    <PrettyCode
                      code={JSON.stringify(session.sessionId, null, 2)}
                      className='mt-20'
                    />
                  )}
                  <button
                    className='button mt-20'
                    onClick={getSession}
                  >
                    Generate session
                  </button>
                </>
              )}
            </div>
          </div>

          <div className='delimiter'></div>

          <div className='display-flex'>
            <div>{paymentRequest ? <CheckIcon /> : <div className='step'>3</div>}</div>
            <div className='ml-16'>
              <div className={`heading-2 ${user ? '' : 'm-0'}`}>
                Generate a payment request
              </div>

              {paymentRequest && (
                <PrettyCode
                  code={JSON.stringify(paymentRequest.id, null, 2)}
                  className='mt-20'
                />
              )}
              <button
                className='button mt-20'
                onClick={getPaymentRequest}
              >
                Generate payment request
              </button>
            </div>
          </div>

          <div className='delimiter'></div>

          <div className='display-flex'>
            <div>
              <div className='step'>4</div>
            </div>
            {paymentRequest && (
              <div className='ml-16'>
                <div className='heading-2'>Open Tink Link</div>
                <div>Payments</div>
                <PrettyCode
                  className='mt-20'
                  highlightSyntax={false}
                  code={getPaymentsLink(
                    paymentRequest.id,
                    authorizationCode,
                    session?.sessionId,
                    'se-demobank-open-banking-bankid',
                    // 'se-demobank-open-banking-redirect',
                  )}
                />
              </div>)}
          </div>
        </div>
        <div className='walking-hand my-auto mt-120 mb-80'></div>
      </div>
    </>
  );
};
