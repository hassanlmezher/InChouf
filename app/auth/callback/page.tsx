"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CircleCheck, Loader2, TriangleAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Confirming your account...");

  useEffect(() => {
    let isMounted = true;

    async function confirmEmail() {
      const currentUrl = new URL(window.location.href);
      const errorDescription = currentUrl.searchParams.get("error_description");
      const code = currentUrl.searchParams.get("code");

      if (errorDescription) {
        if (!isMounted) return;
        setStatus("error");
        setMessage(errorDescription);
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          if (!isMounted) return;
          setStatus("error");
          setMessage(error.message);
          return;
        }
      }

      const { data } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (data.session) {
        setStatus("success");
        setMessage("Your email is confirmed. Taking you back to InChouf...");
        window.setTimeout(() => router.replace("/"), 1200);
        return;
      }

      setStatus("success");
      setMessage("Your email is confirmed. You can sign in now.");
    }

    confirmEmail();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-md rounded-lg border border-slate-100 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600">
          {status === "loading" && <Loader2 className="animate-spin" size={28} />}
          {status === "success" && <CircleCheck size={28} />}
          {status === "error" && <TriangleAlert size={28} />}
        </div>

        <h1 className="mb-2 text-2xl font-bold text-slate-900">
          {status === "error" ? "Confirmation failed" : "Confirming email"}
        </h1>
        <p className="mb-6 text-sm leading-6 text-slate-500">{message}</p>

        <Link
          href="/"
          className="inline-flex rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
        >
          Back to InChouf
        </Link>
      </section>
    </main>
  );
}
