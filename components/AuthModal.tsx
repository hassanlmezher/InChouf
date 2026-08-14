"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getAuthCallbackUrl } from "@/lib/site";
import { X, Mail, Lock, User as UserIcon, Loader2, CircleCheck } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetAuthForm = useCallback(() => {
    setEmail("");
    setPassword("");
    setFullName("");
    setError(null);
    setSuccess(null);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        resetAuthForm();
        setIsLogin(true);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose, resetAuthForm]);

  if (!isOpen) return null;

  const closeModal = () => {
    resetAuthForm();
    setIsLogin(true);
    onClose();
  };

  const switchMode = () => {
    setIsLogin((currentMode) => !currentMode);
    resetAuthForm();
  };

  const getErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message;
    return "Something went wrong. Please try again.";
  };

  const createAccount = async (normalizedEmail: string) => {
    const trimmedName = fullName.trim();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: getAuthCallbackUrl(),
        data: {
          full_name: trimmedName,
        },
      },
    });

    if (signUpError) throw signUpError;

    if (data.session) {
      closeModal();
      return;
    }

    setSuccess(`We sent a free InChouf confirmation link to ${normalizedEmail}. Open the email and tap the link to finish creating your account.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (!isLogin && fullName.trim().length < 2) {
        throw new Error("Please enter your full name.");
      }

      if (!isLogin && password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }

      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (signInError) throw signInError;

        if (!data.session) {
          throw new Error("We couldn't start your session. Please try again.");
        }

        closeModal();
      } else {
        await createAccount(normalizedEmail);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const title = isLogin ? "Welcome back" : "Create an account";
  const subtitle = isLogin ? "Enter your details to sign in" : "Sign up to start discovering the Chouf";
  const submitLabel = isLogin ? "Sign In" : "Create Account";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <button
        type="button"
        aria-label="Close authentication dialog"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={closeModal}
        disabled={loading}
      />

      <div className="relative max-h-[calc(100svh-1.5rem)] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={closeModal}
          disabled={loading}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-6 sm:p-8">
          <div className="mb-6 text-center sm:mb-8">
            <h2 id="auth-modal-title" className="text-2xl font-bold text-slate-900 mb-2">
              {title}
            </h2>
            <p className="text-slate-500 text-sm">{subtitle}</p>
          </div>

          {error && (
            <div role="alert" className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-center">
              {error}
            </div>
          )}

          {success && (
            <div role="status" className="mb-6 flex items-start gap-2.5 p-3 bg-teal-50 border border-teal-100 text-teal-800 text-sm rounded-xl">
              <CircleCheck className="mt-0.5 shrink-0" size={18} />
              <span className="min-w-0">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  minLength={2}
                  autoComplete="name"
                  aria-label="Full name"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-slate-800 placeholder:text-slate-400"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              <input
                type="email"
                required
                autoComplete="email"
                autoFocus
                aria-label="Email address"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              <input
                type="password"
                required
                minLength={6}
                autoComplete={isLogin ? "current-password" : "new-password"}
                aria-label="Password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #1aab8a 0%, #2abf9e 100%)" }}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : submitLabel}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              disabled={loading}
              className="font-bold text-teal-600 hover:text-teal-700 transition-colors"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
