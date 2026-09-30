import { useSearchParams } from "react-router-dom";

export type AuthScreen =
  "login" | "sign-up" | "forgot-password" | "reset-password";

const AUTH_SCREENS: AuthScreen[] = [
  "login",
  "sign-up",
  "forgot-password",
  "reset-password",
];

function isAuthScreen(value: string | null): value is AuthScreen {
  return AUTH_SCREENS.includes(value as AuthScreen);
}

export function useAuthScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const targetParam = searchParams.get("target");
  const token = searchParams.get("token");

  const requestedScreen = isAuthScreen(targetParam) ? targetParam : "login";
  const screen: AuthScreen =
    requestedScreen === "reset-password" || token
      ? token
        ? "reset-password"
        : "login"
      : requestedScreen;

  const goTo = (next: AuthScreen, extra?: Record<string, string>) => {
    if (next === "login") {
      setSearchParams({}, { replace: true });
      return;
    }
    setSearchParams({ target: next, ...extra }, { replace: true });
  };

  const clearParams = () => {
    setSearchParams({}, { replace: true });
  };

  return { screen, token, goTo, clearParams };
}
