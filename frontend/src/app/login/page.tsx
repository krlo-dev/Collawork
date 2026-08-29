"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "signin") {
        await login(email, password);
        router.push("/discover");
      } else {
        await register(name, email, password);
        router.push("/onboarding");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Ha ocurrido un error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center p-4 md:p-16">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-lg p-8 md:p-16 flex flex-col gap-6">
        <header className="flex flex-col items-center gap-3 mb-6">
          <span className="text-headline-lg font-bold text-primary">Collawork</span>
          <h1 className="text-headline-lg-mobile md:text-headline-lg text-center text-on-surface font-semibold">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-body-md text-on-surface-variant text-center">
            Connect with your professional network.
          </p>
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
                className="w-full px-3 py-3 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-body-md text-on-surface transition-colors"
                placeholder="Jane Doe"
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-label-md text-on-surface-variant" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-3 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-body-md text-on-surface transition-colors"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-label-md text-on-surface-variant" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-3 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-body-md text-on-surface transition-colors"
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-label-md text-error">{error}</p>}

          <div className="flex flex-col gap-3 mt-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-on-primary py-3 px-6 rounded text-label-md font-medium hover:bg-on-primary-fixed-variant transition-colors disabled:opacity-60"
            >
              {mode === "signin" ? "Sign In" : "Create Account"}
            </button>
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
              onClick={() => {
                setError(null);
                setMode(mode === "signin" ? "signup" : "signin");
              }}
              className="w-full bg-transparent border border-outline-variant text-on-surface py-3 px-6 rounded text-label-md font-medium hover:bg-surface-container transition-colors"
            >
              {mode === "signin" ? "Create Account" : "Back to Sign In"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
