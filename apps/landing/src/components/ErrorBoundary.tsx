import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@qlp/ui";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

function ErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const { t } = useTranslation();
  console.error(error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute end-5 top-5 sm:end-8 sm:top-8">
        <LanguageSwitcher className="text-foreground" />
      </div>
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {t("error.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("error.description")}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button onClick={reset}>{t("error.tryAgain")}</Button>
          <Button asChild variant="outline">
            <Link to="/" onClick={reset}>
              {t("error.goHome")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return <ErrorFallback error={this.state.error} reset={this.reset} />;
    }

    return this.props.children;
  }
}
