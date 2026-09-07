import type { AxiosInstance } from "axios";
import type {
  RequestAdminSignInDto,
  RequestCheckResetTokenDto,
  RequestResetPasswordDto,
  RequestResetTokenDto,
  ResponseAdminSignInDto,
  ResponseCheckResetTokenDto,
  ResponseResetPasswordDto,
  ResponseResetTokenDto,
} from "../types/auth.js";
import { useAuthPersistStore } from "@qlp/hooks";

export function createAdminAuthResource(http: AxiosInstance) {
  const saveToken = (access_token: string, refresh_token: string) => {
    useAuthPersistStore.getState().setTokens(access_token, refresh_token);
  };

  const signIn = async (
    request: RequestAdminSignInDto,
  ): Promise<ResponseAdminSignInDto> => {
    const response = await http.post<ResponseAdminSignInDto>(
      "/admin/auth/sign-in",
      request,
    );
    saveToken(response.data.access_token, response.data.refresh_token);
    return response.data;
  };

  const forgotPassword = async (
    request: RequestResetTokenDto,
  ): Promise<ResponseResetTokenDto> => {
    const response = await http.post<ResponseResetTokenDto>(
      "/admin/auth/forgot-password",
      request,
    );
    return response.data;
  };

  const checkResetToken = async (
    request: RequestCheckResetTokenDto,
  ): Promise<ResponseCheckResetTokenDto> => {
    const response = await http.post<ResponseCheckResetTokenDto>(
      "/admin/auth/check-reset-token",
      request,
    );
    return response.data;
  };

  const resetPassword = async (
    request: RequestResetPasswordDto,
  ): Promise<ResponseResetPasswordDto> => {
    const response = await http.post<ResponseResetPasswordDto>(
      "/admin/auth/reset-password",
      request,
    );
    return response.data;
  };

  return {
    signIn,
    forgotPassword,
    checkResetToken,
    resetPassword,
  };
}

export type AdminAuthResource = ReturnType<typeof createAdminAuthResource>;
