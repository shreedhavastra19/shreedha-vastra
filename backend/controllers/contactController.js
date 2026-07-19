import asyncHandler from 'express-async-handler';
import sendEmail from '../utils/sendEmail.js';

export const sendContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Name, email, and message are required');
  }

  await sendEmail({
    to: process.env.EMAIL_USER,
    subject: `New Contact Form Message from ${name}`,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });

  res.status(200).json({ success: true, message: 'Message sent successfully' });
});