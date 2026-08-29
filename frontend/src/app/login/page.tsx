"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { CognitoAuthError } from "@/lib/cognito";
import { Logo } from "@/components/Logo";

type Mode = "signin" | "signup" | "confirm" | "forgot" | "reset";

const INPUT_CLASS =
  "w-full px-3 py-3 bg-surface-container-lowest border border-outline-variant rounded hover:border-outline focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-body-md text-on-surface transition-colors";

const HEADINGS: Record<Mode, { title: string; subtitle: string }> = {
  signin: { title: "Welcome back", subtitle: "Connect with your professional network." },
  signup: { title: "Create your account", subtitle: "Connect with your professional network." },
  confirm: { title: "Verify your email", subtitle: "Enter the code we just sent you." },
  forgot: { title: "Reset your password", subtitle: "We'll email you a verification code." },
  reset: { title: "Choose a new password", subtitle: "Enter the code and your new password." },
};

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, signUp, confirmSignUp, resendConfirmationCode, forgotPassword, confirmForgotPassword } = useAuth();
  const router = useRouter();

  function switchMode(next: Mode) {
    setError(null);
    setInfo(null);
    setMode(next);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      if (mode === "signin") {
        await login(email, password);
        router.push("/discover");
      } else if (mode === "signup") {
        await signUp(name, email, password);
        setCode("");
        switchMode("confirm");
      } else if (mode === "confirm") {
        await confirmSignUp(email, code);
        await login(email, password);
        router.push("/onboarding");
      } else if (mode === "forgot") {
        await forgotPassword(email);
        setCode("");
        switchMode("reset");
      } else if (mode === "reset") {
        await confirmForgotPassword(email, code, newPassword);
        setPassword("");
        switchMode("signin");
        setInfo("Password updated. Sign in with your new password.");
      }
    } catch (err) {
      setError(err instanceof CognitoAuthError ? err.message : "Ha ocurrido un error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendCode() {
    setError(null);
    setInfo(null);
    try {
      await resendConfirmationCode(email);
      setInfo("Code resent. Check your inbox.");
    } catch (err) {
      setError(err instanceof CognitoAuthError ? err.message : "Ha ocurrido un error");
    }
  }

  const { title, subtitle } = HEADINGS[mode];

  return (
    <main className="flex-1 flex items-center justify-center p-4 md:p-16">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-lg p-8 md:p-16 flex flex-col gap-6">
        <header className="flex flex-col items-center gap-3 mb-6">
          <Logo className="w-16 h-16 md:w-20 md:h-20" />
          <span className="text-headline-lg font-bold text-primary">Collawork</span>
          <h1 className="text-headline-lg-mobile md:text-headline-lg text-center text-on-surface font-semibold">
            {title}
          </h1>
          <p className="text-body-md text-on-surface-variant text-center">{subtitle}</p>
        </header>

        <form className="flex flex-col gap-3 w-full" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="flex flex-col gap-1">
              <label className="text-label-md text-on-surface-variant" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={INPUT_CLASS}
                placeholder="Jane Doe"
              />
            </div>
          )}

          {(mode === "signin" || mode === "signup" || mode === "forgot" || mode === "confirm" || mode === "reset") && (
            <div className="flex flex-col gap-1">
              <label className="text-label-md text-on-surface-variant" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                disabled={mode === "confirm" || mode === "reset"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${INPUT_CLASS} disabled:opacity-60`}
                placeholder="Enter your email"
              />
            </div>
          )}

          {(mode === "confirm" || mode === "reset") && (
            <div className="flex flex-col gap-1">
              <label className="text-label-md text-on-surface-variant" htmlFor="code">
                Verification code
              </label>
              <input
                id="code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={INPUT_CLASS}
                placeholder="123456"
              />
            </div>
          )}

          {(mode === "signin" || mode === "signup") && (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-label-md text-on-surface-variant" htmlFor="password">
                  Password
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    className="text-label-md text-primary hover:text-on-primary-fixed-variant transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={INPUT_CLASS}
                placeholder="Enter your password"
              />
            </div>
          )}

          {mode === "reset" && (
            <div className="flex flex-col gap-1">
              <label className="text-label-md text-on-surface-variant" htmlFor="newPassword">
                New password
              </label>
              <input
                id="newPassword"
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={INPUT_CLASS}
                placeholder="Enter a new password"
              />
            </div>
          )}

          {mode === "confirm" && (
            <button
              type="button"
              onClick={handleResendCode}
              className="text-label-sm text-primary hover:underline self-start transition-colors"
            >
              Resend code
            </button>
          )}

          {info && <p className="text-label-md text-secondary">{info}</p>}
          {error && <p className="text-label-md text-error">{error}</p>}

          <div className="flex flex-col gap-3 mt-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-on-primary py-3 px-6 rounded text-label-md font-medium hover:bg-on-primary-fixed-variant transition-colors disabled:opacity-60"
            >
              {mode === "signin" && "Sign In"}
              {mode === "signup" && "Create Account"}
              {mode === "confirm" && "Verify"}
              {mode === "forgot" && "Send code"}
              {mode === "reset" && "Update password"}
            </button>

            {(mode === "signin" || mode === "signup") && (
              <>
                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-outline-variant" />
                  </div>
                  <div className="relative px-4 bg-surface-container-lowest text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Or
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
                  className="w-full bg-transparent border border-outline-variant text-on-surface py-3 px-6 rounded text-label-md font-medium hover:bg-surface-container transition-colors"
                >
                  {mode === "signin" ? "Create Account" : "Back to Sign In"}
                </button>
              </>
            )}

            {(mode === "confirm" || mode === "forgot" || mode === "reset") && (
              <button
                type="button"
                onClick={() => switchMode("signin")}
                className="w-full bg-transparent border border-outline-variant text-on-surface py-3 px-6 rounded text-label-md font-medium hover:bg-surface-container transition-colors"
              >
                Back to Sign In
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
