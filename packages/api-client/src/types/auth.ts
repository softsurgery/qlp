import { ResponseUserDto } from "./user-managemnt.js";

export interface ResponseClientSigninDto {
  user?: ResponseUserDto;
  access_token: string;
  refresh_token: string;
}

export interface RequestAdminSignInDto {
  usernameOrEmail: string;
  password: string;
}

export interface ResponseAdminSignInDto {
  user?: ResponseUserDto;
  access_token: string;
  refresh_token: string;
}

export interface RequestResetTokenDto {
  usernameOrEmail: string;
}

export interface ResponseResetTokenDto {
  email: string;
  success: boolean;
}

export interface RequestCheckResetTokenDto {
  token: string;
}

export interface ResponseCheckResetTokenDto {
  token: string;
  valid: boolean;
}

export interface RequestResetPasswordDto {
  token: string;
  password: string;
}

export interface ResponseResetPasswordDto {
  success: boolean;
  message: string;
}

export interface RequestClientSignInDto {
  email: string;
  password: string;
}

export interface RequestClientSignUpDto {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export interface ResponseClientSignupDto {
  user: ResponseUserDto;
}

export interface RequestClientUpdateMailDto {
  email: string;
  password: string;
}

export interface RequestClientUpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export enum OAuthProvider {
  GOOGLE = "google",
  LINKEDIN = "linkedin",
  APPLE = "apple",
}

export interface RequestClientOAuthDto {
  provider: OAuthProvider;
  idToken: string;
  redirectUri?: string;
  codeVerifier?: string;
}
