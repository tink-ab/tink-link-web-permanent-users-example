import React from 'react';
import { getPaymentLink, Transfer } from './api';
import { CheckIcon } from './images/CheckIcon';
import { PrettyCode } from './PrettyCode';

const PERMANENT_PAYMENT_REQUEST_ID = process.env.REACT_APP_TINK_LINK_PERMANENT_PAYMENT_REQUEST_ID;

type InitiatePaymentButtonProps = {
  userId: string;
  credentialsId: string;
  authorizationCode: string;
};

export const InitiatePaymentButton: React.FC<InitiatePaymentButtonProps> = ({
  userId,
  credentialsId,
  authorizationCode,
}) => {
  const initiatePayment = (credentialsId: string) => {
    if (authorizationCode && PERMANENT_PAYMENT_REQUEST_ID) {
      return getPaymentLink(authorizationCode, credentialsId, userId, PERMANENT_PAYMENT_REQUEST_ID);
    }
  };

  return (
    <>
      {PERMANENT_PAYMENT_REQUEST_ID && (
        <>
          <a className="button mt-24 ml-16" href={initiatePayment(credentialsId)}>
            Initiate payment
          </a>

          <div className="mt-40">Initiate payment</div>
          <PrettyCode
            className="mt-20"
            highlightSyntax={false}
            code={`${getPaymentLink(
              authorizationCode,
              credentialsId,
              userId,
              PERMANENT_PAYMENT_REQUEST_ID
            )}&session_id=`}
          />
        </>
      )}
    </>
  );
};

type TransfersListProps = {
  transfers?: Transfer[];
};

export const TransfersList: React.FC<TransfersListProps> = ({ transfers }) => {
  return (
    <>
      {transfers && (
        <div className="paper mt-20">
          <div className="display-flex">
            <div>
              <CheckIcon />
            </div>
            <div className="full-width ml-16 mr-40">
              <div className="heading-2">Created transfers</div>
              <PrettyCode code={JSON.stringify(transfers, null, ' ')} className="mt-20" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
