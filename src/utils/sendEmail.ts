import transporter from '../config/emailConfig';
import ejs from 'ejs';
import path from 'path';
import { promises as fs } from 'fs';
import { info } from 'console';

export const sendEmailForForgotPassword = async (data: {
  email: string;
  content: string;
}) => {
  try {
    const { email, content } = data;
    const templatePath = path.join(
      __dirname,
      `../../templates/passwordResetTemplate.ejs`
    );
    const html = await ejs.renderFile(templatePath, { resetLink: content });

    const mainOption = {
      from: '"benitech" info@mail.benitech.ir',
      to: email,
      subject: 'لینک بازنشانی رمز عبور بنی تک',
      html: html,
    };

    setImmediate(async () => {
      await transporter.sendMail(mainOption);
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
  }
};

export const sendEmailForSendOtpCode = async (email: string, otp: number) => {
  try {
    const templatePath = path.join(__dirname, `../../templates/sendOtp.ejs`);
    const html = await ejs.renderFile(templatePath, { password: otp });

    const mainOption = {
      from: '"benitech" info@mail.benitech.ir',
      to: email,
      subject: 'ورد به بنی تک',
      html: html,
    };

    setImmediate(async () => {
      await transporter.sendMail(mainOption);
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
  }
};
