import nodemailer from 'nodemailer';
import config from '../config/config.js';

const { email } = config;

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: email.host,
  port: email.port,
  secure: email.secure, // true for 465, false for other ports
  auth: {
    user: email.user,
    pass: email.password,
  },
});

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text email body
 * @param {string} [options.html] - HTML email body
 * @returns {Promise<Object>} Email send result
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // In development, log the email instead of sending
    if (process.env.NODE_ENV === 'development') {
      console.log('--- Email Preview ---');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Text: ${text}`);
      console.log('---------------------');
      return { message: 'Email logged in development mode' };
    }

    // In production, send the actual email
    const info = await transporter.sendMail({
      from: `"${email.fromName}" <${email.fromEmail}>`,
      to,
      subject,
      text,
      html,
    });

    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

export { sendEmail };
