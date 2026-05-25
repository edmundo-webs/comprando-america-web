import nodemailer from "nodemailer";
import { ENV } from "./env";

function createTransport() {
  return nodemailer.createTransport({
    host: ENV.smtpHost,
    port: ENV.smtpPort,
    secure: ENV.smtpPort === 465,
    auth: {
      user: ENV.smtpUser,
      pass: ENV.smtpPass,
    },
  });
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!ENV.smtpHost || !ENV.smtpUser || !ENV.smtpPass) {
    console.warn("[email] SMTP not configured — skipping email to", opts.to);
    return;
  }
  const transporter = createTransport();
  await transporter.sendMail({
    from: ENV.smtpFrom || ENV.smtpUser,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });
}
