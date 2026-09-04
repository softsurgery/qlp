import type { AxiosInstance } from "axios";
import type {
  RequestClientSignInDto,
  ResponseClientSigninDto,
  RequestClientOAuthDto,
  RequestClientSignUpDto,
  RequestClientUpdateMailDto,
  RequestClientUpdatePasswordDto,
} from "../types/auth.js";
import { useAuthPersistStore } from "@qlp/hooks";

export function createAuthResource(http: AxiosInstance) {
  const saveToken = (access_token: string, refresh_token: string) => {
    const authPersistStore = useAuthPersistStore.getState();
    authPersistStore.setAccessToken(access_token);
    authPersistStore.setRefreshToken(refresh_token);
    authPersistStore.setAuthenticated(true);
  };

  const signIn = async (
    requestClientSignInDto: RequestClientSignInDto,
  ): Promise<ResponseClientSigninDto> => {
    const response = await http.post(
      "/client-auth/sign-in",
      requestClientSignInDto,
    );
    saveToken(response.data.access_token, response.data.refresh_token);
    return response.data;
  };

  const ssoSignIn = async (
    request: RequestClientOAuthDto,
  ): Promise<ResponseClientSigninDto> => {
    const response = await http.post("/client-auth/oauth", request);
    saveToken(response.data.access_token, response.data.refresh_token);
    return response.data;
  };

  const signUp = async (requestClientSignUpDto: RequestClientSignUpDto) => {
    const response = await http.post(
      "/client-auth/sign-up",
      requestClientSignUpDto,
    );
    return response.data;
  };

  const sendVerifyEmail = async (email?: string) => {
    const response = await http.post("/client-auth/send-verify-email", {
      email,
    });
    return response.data;
  };

  const updateEmail = async (request: RequestClientUpdateMailDto) => {
    const response = await http.post("/client-auth/update-email", request);
    return response.data;
  };

  const updatePassword = async (request: RequestClientUpdatePasswordDto) => {
    const response = await http.post("/client-auth/update-password", request);
    return response.data;
  };

  return {
    signIn,
    ssoSignIn,
    signUp,
    sendVerifyEmail,
    updateEmail,
    updatePassword,
  };
}

export type AuthResource = ReturnType<typeof createAuthResource>;
