import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const verifyEmailConnection = async (): Promise<void> => {
  try {
    await transporter.verify();
    console.log('✅ Email server connected successfully');
  } catch (error) {
    console.error('❌ Email server connection failed:', error);
    console.error('Check EMAIL_USER and EMAIL_PASSWORD in .env');
  }
};

export default transporter;
