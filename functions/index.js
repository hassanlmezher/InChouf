const { createClient } = require("@supabase/supabase-js");
const { onRequest } = require("firebase-functions/v2/https");
const nodemailer = require("nodemailer");

const REQUIRED_ENV_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
];

function getAuthCallbackUrl() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const siteUrl = configuredSiteUrl ? configuredSiteUrl.replace(/\/$/, "") : "https://inchouf.com";
  return `${siteUrl}/auth/callback`;
}

function getMissingEnvVars() {
  return REQUIRED_ENV_VARS.filter((key) => !process.env[key]?.trim());
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sendJson(response, status, body) {
  response.status(status).json(body);
}

exports.sendSignupCode = onRequest(
  {
    region: "us-central1",
    cors: true,
    secrets: ["SUPABASE_SERVICE_ROLE_KEY", "SMTP_PASS"],
  },
  async (request, response) => {
    if (request.method === "OPTIONS") {
      response.status(204).send("");
      return;
    }

    if (request.method !== "POST") {
      sendJson(response, 405, { error: "Method not allowed." });
      return;
    }

    const missingEnvVars = getMissingEnvVars();

    if (missingEnvVars.length > 0) {
      sendJson(response, 500, { error: `Missing email configuration: ${missingEnvVars.join(", ")}` });
      return;
    }

    const email = request.body?.email?.trim().toLowerCase() ?? "";
    const fullName = request.body?.fullName?.trim() ?? "";
    const password = request.body?.password ?? "";

    if (!isValidEmail(email)) {
      sendJson(response, 400, { error: "Enter a valid email address." });
      return;
    }

    if (fullName.length < 2) {
      sendJson(response, 400, { error: "Please enter your full name." });
      return;
    }

    if (password.length < 6) {
      sendJson(response, 400, { error: "Password must be at least 6 characters." });
      return;
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "signup",
      email,
      password,
      options: {
        redirectTo: getAuthCallbackUrl(),
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      sendJson(response, 400, { error: error.message });
      return;
    }

    const emailOtp = data.properties?.email_otp;

    if (!emailOtp) {
      sendJson(response, 500, { error: "We could not generate a verification code. Please try again." });
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Your InChouf verification code",
      text: `Your InChouf verification code is ${emailOtp}. This code expires shortly and can only be used once.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.5;">
          <h1 style="font-size: 24px; margin: 0 0 16px;">Your InChouf verification code</h1>
          <p style="margin: 0 0 18px;">Enter this code to finish creating your account:</p>
          <div style="display: inline-block; letter-spacing: 8px; font-size: 32px; font-weight: 700; background: #f0fdfa; color: #0f766e; padding: 14px 18px; border-radius: 10px;">
            ${emailOtp}
          </div>
          <p style="margin: 18px 0 0; color: #64748b;">This code expires shortly and can only be used once.</p>
        </div>
      `,
    });

    sendJson(response, 200, { ok: true });
  }
);
