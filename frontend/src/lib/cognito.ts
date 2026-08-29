import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js";

let cachedUserPool: CognitoUserPool | null = null;

function getUserPool(): CognitoUserPool {
  if (!cachedUserPool) {
    const UserPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
    const ClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
    if (!UserPoolId || !ClientId) {
      throw new CognitoAuthError(
        "Cognito is not configured yet. Set NEXT_PUBLIC_COGNITO_USER_POOL_ID and NEXT_PUBLIC_COGNITO_CLIENT_ID.",
      );
    }
    cachedUserPool = new CognitoUserPool({ UserPoolId, ClientId });
  }
  return cachedUserPool;
}

export class CognitoAuthError extends Error {}

function toError(err: unknown): CognitoAuthError {
  const message = err instanceof Error ? err.message : "Authentication error";
  return new CognitoAuthError(message);
}

export function signUp(name: string, email: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const attributes = [new CognitoUserAttribute({ Name: "name", Value: name })];
    getUserPool().signUp(email, password, attributes, [], (err) => {
      if (err) return reject(toError(err));
      resolve();
    });
  });
}

export function confirmSignUp(email: string, code: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: getUserPool() });
    user.confirmRegistration(code, true, (err) => {
      if (err) return reject(toError(err));
      resolve();
    });
  });
}

export function resendConfirmationCode(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: getUserPool() });
    user.resendConfirmationCode((err) => {
      if (err) return reject(toError(err));
      resolve();
    });
  });
}

export function signIn(email: string, password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: getUserPool() });
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });
    user.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(session.getIdToken().getJwtToken()),
      onFailure: (err) => reject(toError(err)),
    });
  });
}

export function signOut(): void {
  getUserPool().getCurrentUser()?.signOut();
}

export function forgotPassword(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: getUserPool() });
    user.forgotPassword({
      onSuccess: () => resolve(),
      onFailure: (err) => reject(toError(err)),
    });
  });
}

export function confirmForgotPassword(email: string, code: string, newPassword: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: getUserPool() });
    user.confirmPassword(code, newPassword, {
      onSuccess: () => resolve(),
      onFailure: (err) => reject(toError(err)),
    });
  });
}

export function getCurrentIdToken(): Promise<string | null> {
  return new Promise((resolve) => {
    let user;
    try {
      user = getUserPool().getCurrentUser();
    } catch {
      return resolve(null);
    }
    if (!user) return resolve(null);

    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session || !session.isValid()) return resolve(null);
      resolve(session.getIdToken().getJwtToken());
    });
  });
}
