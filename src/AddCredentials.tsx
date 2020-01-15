import React, { useState } from "react";
import {
  User,
  AuthorizationCode,
  createPermanentUser,
  getAddCredentialsLink,
  generateAuthorizationCode
} from "./api";

export const AddCredentials: React.FC = () => {
  const [user, setUser] = useState<User | undefined>(undefined);

  const [authorizationCode, setAuthorizationCode] = useState<
    AuthorizationCode | undefined
  >(undefined);

  const getUser = async () => {
    const user = await createPermanentUser();
    setUser(user);
  };

  const getAuthorizationCode = async (userId: string) => {
    const authorizationCode = await generateAuthorizationCode(userId);
    setAuthorizationCode(authorizationCode);
  };

  return (
    <div>
      <h1>Add credentials to permanent user</h1>

      <div>First we need a permanent user to add credentials to</div>
      <div>
        <button onClick={() => getUser()}>Create permanent user</button>
      </div>
      <textarea
        disabled
        cols={50}
        rows={3}
        defaultValue={JSON.stringify(user)}
      ></textarea>

      <div>
        Then we need to generate authorization code for created permanent user
        which we will use when launching Tink Link
      </div>
      <div>
        <button onClick={() => user && getAuthorizationCode(user.user_id)}>
          Generate authorization code
        </button>
      </div>
      <textarea
        disabled
        cols={50}
        rows={3}
        defaultValue={JSON.stringify(authorizationCode)}
      ></textarea>

      {authorizationCode && user && (
        <div>
          <div>Tink Link url to add credentials to user</div>
          <a href={getAddCredentialsLink(authorizationCode.code, user.user_id)}>
            {getAddCredentialsLink(authorizationCode.code, user.user_id)}
          </a>
        </div>
      )}
    </div>
  );
};
