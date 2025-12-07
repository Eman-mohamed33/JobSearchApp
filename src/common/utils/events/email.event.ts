import EventEmitter from "node:events";
import Mail from "nodemailer/lib/mailer";
import { sendEmail, verifyEmailTemplate } from "../email";
import { TypeEnum } from "src/common/enums";
import { log } from "node:console";


export const emailEvent = new EventEmitter();
interface IEmail extends Mail.Options {
  otp: string;
  userName?: string;
  Content?: string;
  field?: string;
}

emailEvent.on(TypeEnum.ConfirmEmail, async (data: IEmail) => {
  try {
    ((data.subject = 'Please Confirm Email...'),
      (data.html = verifyEmailTemplate({
        otp: data.otp,
        userEmail: data.to as string,
        title: 'Email Confirmation',
      })));
    await sendEmail(data);
  } catch (error) {
    log(`Fail To Send Email To ${data.to}`, error);
  }
});

emailEvent.on('SendForgotPasswordCode', async (data: IEmail) => {
  try {
    ((data.subject = 'Forgot Password Code'),
      (data.html = verifyEmailTemplate({
        otp: data.otp,
        userEmail: data.to as string,
        title: 'Forgotten password code',
      })));
    await sendEmail(data);
  } catch (error) {
    log(`Fail To Send Email To ${data.to}`, error);
  }
});
