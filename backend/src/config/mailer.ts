import nodemailer from "nodemailer";

// ---------------------------------------------------------------------------
// Outbound email (Nodemailer over SMTP).
//
// Free setup for development using Gmail:
//   1. Turn on 2-Step Verification for the Google account.
//   2. Create an App Password: https://my.google.com/apppasswords
//   3. Fill these values in backend/.env:
//        SMTP_HOST=smtp.gmail.com
//        SMTP_PORT=587
//        SMTP_USER=you@gmail.com
//        SMTP_PASS=your-16-character-app-password   (NOT your Google password)
//        MAIL_FROM="Elysian <you@gmail.com>"
//
// While SMTP_* are empty the server still runs; it just logs a clear warning
// on startup and (if someone requests a reset) a clear error in the console.
// ---------------------------------------------------------------------------

export interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const isSmtpConfigured = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
);

export const sendMail = async (options: MailOptions): Promise<void> => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT || 587);

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS in backend/.env (see the notes at the top of this file)."
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = implicit TLS, 587 = STARTTLS
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || `Elysian <${user}>`,
    ...options,
  });
};
