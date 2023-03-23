import axios from "axios";
import { ISendMail } from "../../@core/globals/types";

export const sendMail: (props: ISendMail) => Promise<void> = async (
  props: ISendMail
) => {
  const res = await axios.post("/api/mail", { ...props });
  return res.data;
};

export const sendEmailConfirmation: (
  props: ISendMail
) => Promise<void> = async (props: ISendMail) => {
  const res = await axios.post("/api/email-verification", { ...props });
  return res.data;
};

export const confirmEmailVerificationCode = async ({ email, code }) => {
  const res = await axios.post("/api/email-verification/verify", {
    email,
    code,
  });
  return res.data;
};
