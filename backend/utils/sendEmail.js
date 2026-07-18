// ================================================================
// Shreedha Vastra — Email Utility (Nodemailer)
// ================================================================
// Sends transactional emails using SMTP credentials from .env.
// Used for: welcome emails, password reset links, order
// confirmations, shipping updates.
// ================================================================

import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // true for port 465, false for 587 (STARTTLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || 'Shreedha Vastra'}" <${
      process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER
    }>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;
