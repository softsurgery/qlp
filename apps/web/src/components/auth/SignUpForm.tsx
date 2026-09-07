import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
  cn,
} from "@qlp/ui";
import { PasswordField } from "@qlp/form-builder";
import {
  signUpAccountSchema,
  signUpPasswordSchema,
  signUpProfileSchema,
} from "../../types/validations/auth.validation";
import { useSignUp } from "../../hooks/useAuth";
import { ServerErrorResponse } from "@qlp/api-client";

interface SignUpFormProps {
  className?: string;
  onLogin: () => void;
}

const TOTAL_STEPS = 3;

export function SignUpForm({ className, onLogin }: SignUpFormProps) {
  const { t } = useTranslation();
  const signUp = useSignUp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const isProfileValid = signUpProfileSchema.safeParse(form).success;
  const isAccountValid = signUpAccountSchema.safeParse(form).success;
  const isPasswordValid = signUpPasswordSchema.safeParse(form).success;

  const canAdvance =
    step === 1 ? isProfileValid : step === 2 ? isAccountValid : isPasswordValid;

  const steps = [
    {
      value: 1,
      title: t("auth.stepProfile"),
      description: t("auth.stepProfileDescription"),
      disabled: false,
    },
    {
      value: 2,
      title: t("auth.stepAccount"),
      description: t("auth.stepAccountDescription"),
      disabled: !isProfileValid,
    },
    {
      value: 3,
      title: t("auth.stepPassword"),
      description: t("auth.stepPasswordDescription"),
      disabled: !isProfileValid || !isAccountValid,
    },
  ];

  const currentStep = steps[step - 1] ?? steps[0];

  const updateField = (field: keyof typeof form) => (value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canAdvance || signUp.isPending) return;

    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }

    signUp.mutate(
      {
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email,
        password: form.password,
      },
      {
        onSuccess: () => {
          toast.success(t("auth.accountCreated"));
          onLogin();
        },
        onError: (error: ServerErrorResponse) => {
          toast.error(error?.response?.data?.message);
        },
      },
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Stepper
        value={step}
        onValueChange={setStep}
        orientation="vertical"
        className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10"
        indicators={{
          completed: <Check className="size-3.5" />,
          loading: <Loader2 className="size-3.5 animate-spin" />,
        }}
      >
        <StepperNav className="w-full lg:w-56 lg:shrink-0">
          {steps.map((item, index) => (
            <StepperItem
              key={item.value}
              step={item.value}
              disabled={item.disabled}
              loading={item.value === TOTAL_STEPS && signUp.isPending}
              className="flex-col items-start justify-start not-last:flex-none"
            >
              <StepperTrigger className="w-full items-start rounded-md text-start">
                <StepperIndicator>{item.value}</StepperIndicator>
                <div className="flex flex-col gap-1">
                  <StepperTitle>{item.title}</StepperTitle>
                  <StepperDescription>{item.description}</StepperDescription>
                </div>
              </StepperTrigger>
              {index < steps.length - 1 ? (
                <StepperSeparator className="ms-3 group-data-[state=completed]/step:bg-primary" />
              ) : null}
            </StepperItem>
          ))}
        </StepperNav>

        <div className="min-w-0 flex-1">
          <Card>
            <CardHeader>
              <CardTitle>{currentStep.title}</CardTitle>
              <CardDescription>{currentStep.description}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <StepperPanel>
                  <StepperContent value={1} className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName">{t("auth.firstName")}</Label>
                      <Input
                        id="firstName"
                        value={form.firstName}
                        onChange={(e) =>
                          updateField("firstName")(e.target.value)
                        }
                        disabled={signUp.isPending}
                        autoComplete="given-name"
                        autoFocus
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lastName">{t("auth.lastName")}</Label>
                      <Input
                        id="lastName"
                        value={form.lastName}
                        onChange={(e) =>
                          updateField("lastName")(e.target.value)
                        }
                        disabled={signUp.isPending}
                        autoComplete="family-name"
                      />
                    </div>
                  </StepperContent>

                  <StepperContent value={2} className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="username">{t("auth.username")}</Label>
                      <Input
                        id="username"
                        value={form.username}
                        onChange={(e) =>
                          updateField("username")(e.target.value)
                        }
                        disabled={signUp.isPending}
                        autoComplete="username"
                        autoFocus
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">{t("auth.email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField("email")(e.target.value)}
                        disabled={signUp.isPending}
                        autoComplete="email"
                      />
                    </div>
                  </StepperContent>

                  <StepperContent value={3} className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="password">{t("auth.password")}</Label>
                      <PasswordField
                        id="password"
                        placeholder="•••••••"
                        value={form.password}
                        onChange={(e) =>
                          updateField("password")(e.target.value)
                        }
                        disabled={signUp.isPending}
                        autoComplete="new-password"
                        autoFocus
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">
                        {t("auth.confirmPassword")}
                      </Label>
                      <PasswordField
                        id="confirmPassword"
                        placeholder="•••••••"
                        value={form.confirmPassword}
                        onChange={(e) =>
                          updateField("confirmPassword")(e.target.value)
                        }
                        disabled={signUp.isPending}
                        autoComplete="new-password"
                      />
                    </div>
                  </StepperContent>
                </StepperPanel>
              </CardContent>
              <CardFooter className="mt-6 gap-2">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    disabled={signUp.isPending}
                  >
                    {t("auth.back")}
                  </Button>
                ) : null}
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={signUp.isPending || !canAdvance}
                >
                  {step < TOTAL_STEPS ? t("auth.next") : t("auth.register")}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="mt-4 text-center text-sm">
            {t("auth.hasAccount")}{" "}
            <button
              type="button"
              className="underline underline-offset-4"
              onClick={onLogin}
            >
              {t("auth.login")}
            </button>
          </div>
        </div>
      </Stepper>
    </div>
  );
}
