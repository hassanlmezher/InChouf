"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

const submissionEndpoint = "https://formsubmit.co/ajax/inchoufapp@gmail.com";

export default function ListYourPlacePage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(submissionEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const result = (await response.json()) as { success?: boolean | string };

      if (!response.ok || (result.success !== true && result.success !== "true")) {
        throw new Error("The request could not be sent.");
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 font-sans sm:px-5 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/#cta"
          className="mb-5 inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50 md:mb-6"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Back to InChouf
        </Link>

        <div className="grid overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-100 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-400 p-6 text-white sm:p-8 md:p-10 lg:p-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" aria-hidden="true" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-slate-950/10" aria-hidden="true" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <Building2 size={25} aria-hidden="true" />
              </div>
              <p className="mt-7 text-sm font-bold uppercase tracking-[0.18em] text-teal-50">Join InChouf</p>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                Put your place on the map.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85">
                Tell us about your business, venue, or experience in the Chouf. Our team will review your request and contact you about the next steps.
              </p>

              <div className="mt-8 space-y-4 text-sm font-semibold text-white/90">
                <div className="flex items-center gap-3">
                  <BadgeCheck className="shrink-0 text-teal-100" size={20} aria-hidden="true" />
                  Reach locals and visitors exploring the Chouf
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="shrink-0 text-teal-100" size={20} aria-hidden="true" />
                  Share your location, category, and story
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="shrink-0 text-teal-100" size={20} aria-hidden="true" />
                  Get a direct follow-up from the InChouf team
                </div>
              </div>
            </div>
          </section>

          <section className="p-5 sm:p-8 md:p-10 lg:p-12">
            {status === "success" ? (
              <div className="flex min-h-[560px] flex-col items-center justify-center text-center" role="status">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                  <CheckCircle2 size={34} aria-hidden="true" />
                </div>
                <h2 className="mt-6 text-2xl font-extrabold text-slate-900 sm:text-3xl">Your request has been sent</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">
                  Thank you for your interest in InChouf. Our team will review your details and contact you using the information you provided.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-7 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-teal-200 hover:text-teal-700"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <>
                <div className="mb-7">
                  <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Request a listing</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Fields marked with <span className="text-red-500">*</span> are required.
                  </p>
                </div>

                <form
                  action="https://formsubmit.co/inchoufapp@gmail.com"
                  method="POST"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <input type="hidden" name="_subject" value="New InChouf listing request" />
                  <input type="hidden" name="_template" value="table" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Your full name" required>
                      <input
                        id="contact-name"
                        name="Contact name"
                        type="text"
                        autoComplete="name"
                        required
                        className={inputClassName}
                        placeholder="e.g. Rami Khoury"
                      />
                    </Field>

                    <Field label="Phone number" required>
                      <input
                        id="phone"
                        name="Phone number"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        required
                        className={inputClassName}
                        placeholder="e.g. +961 70 123 456"
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Email address" required>
                      <input
                        id="email"
                        name="Email address"
                        type="email"
                        autoComplete="email"
                        required
                        className={inputClassName}
                        placeholder="you@example.com"
                      />
                    </Field>

                    <Field label="Place or business name" required>
                      <input
                        id="business-name"
                        name="Place or business name"
                        type="text"
                        autoComplete="organization"
                        required
                        className={inputClassName}
                        placeholder="Your place name"
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Category" required>
                      <select id="category" name="Category" required defaultValue="" className={inputClassName}>
                        <option value="" disabled>Select a category</option>
                        <option>Eat &amp; Drink</option>
                        <option>Stay</option>
                        <option>Nature &amp; Outdoors</option>
                        <option>Sports &amp; Activities</option>
                        <option>Culture &amp; Heritage</option>
                        <option>Shopping &amp; Local Products</option>
                        <option>Services</option>
                        <option>Other</option>
                      </select>
                    </Field>

                    <Field label="Town or area" required>
                      <input
                        id="location"
                        name="Town or area"
                        type="text"
                        autoComplete="address-level2"
                        required
                        className={inputClassName}
                        placeholder="e.g. Deir El Qamar"
                      />
                    </Field>
                  </div>

                  <Field label="Website or social media page" hint="Optional">
                    <input
                      id="online-presence"
                      name="Website or social media"
                      type="text"
                      inputMode="url"
                      className={inputClassName}
                      placeholder="Website, Instagram, or Facebook link"
                    />
                  </Field>

                  <Field label="Tell us about your place" required>
                    <textarea
                      id="description"
                      name="About the place"
                      rows={5}
                      required
                      className={`${inputClassName} resize-y`}
                      placeholder="What do you offer, and what makes your place special?"
                    />
                  </Field>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
                    <input
                      type="checkbox"
                      name="Permission to contact"
                      value="Yes"
                      required
                      className="mt-0.5 h-4 w-4 shrink-0 accent-teal-600"
                    />
                    <span>
                      I confirm these details are accurate and allow the InChouf team to contact me about this listing request. <span className="text-red-500">*</span>
                    </span>
                  </label>

                  {status === "error" && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700" role="alert">
                      <Mail className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
                      We could not send your request. Please check your connection and try again.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-teal-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-65 sm:text-base"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="animate-spin" size={19} aria-hidden="true" />
                        Sending request…
                      </>
                    ) : (
                      <>
                        <Send size={18} aria-hidden="true" />
                        Send listing request
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs leading-relaxed text-slate-400">
                    Your details are only used to review your request and contact you about listing on InChouf.
                  </p>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

const inputClassName =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10";

function Field({
  label,
  hint,
  required = false,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-bold text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
      {hint && <span className="ml-2 font-normal text-slate-400">({hint})</span>}
      {children}
    </label>
  );
}
