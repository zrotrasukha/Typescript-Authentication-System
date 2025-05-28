import resend from "../config/resend";
import { EMAIL_SENDER, NODE_ENV } from "../constants/env";

type emailParams = {
  to: string,
  text: string,
  subject: string,
  html: string,
}

const getFromEmail = () =>
  NODE_ENV === "development" ? "onboarding@resend.dev" : EMAIL_SENDER;

const getToEmail = (to: string) =>
  NODE_ENV === "development" ? "deliveredTo@resend.dev" : to;
export const sendMail = async ({ to, text, subject, html }: emailParams) => {
  const emailData = await resend.emails.send({
    from: getFromEmail(),
    to: getToEmail(to),
    subject,
    text,
    html
  })
  return { emailData };
}

