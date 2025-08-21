import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import config from '../config';

const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport(
    {
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.NODE_ENV === 'production', // true for 465
      auth: {
        user: config.SMTP_MAIL,
        pass: config.SMTP_PASSWORD,
      },
      tls: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: false,
      },
      socketTimeout: 60000,
    } as SMTPTransport.Options // <-- Type assertion
  );

  await transporter.sendMail({
    from: `${config.SMTP_FROM_NAME} <${config.SMTP_MAIL}>`,
    to,
    subject: 'Reset Password Link',
    html,
  });
};

export default sendEmail;
