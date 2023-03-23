import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../common/libs/dbConnect";
import User, { IDefaultReturnedType } from "../../../common/models/User";
import AWS from "aws-sdk";
import multiparty from "multiparty";
import fs from "fs";
import { generateRandomNumber } from "../../../@core/helpers";
import EmailVerificationModel from "../../../common/models/EmailVerification";
import { sendMailApiWrapper } from "../mail";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // first retrive user info
  if (req.method == "POST") {
    const { to, subject, message } = req.body;
    if (!to || !subject || !message)
      return res.send({
        message: "${to, subject, message} all fields are required",
      });
    const code = generateRandomNumber(1000, 1000000);
    const emailVerification = new EmailVerificationModel({
      code,
      email: to,
    });

    await emailVerification.save();

    try {
      await sendMailApiWrapper({
        to,
        subject,
        message: `${message} ${code}`,
      });
      res.json({ message: "Please check your email" });
    } catch (err) {
      res.status(500).json(err);
    }
  } else
    return res.status(400).json({ message: "this method is not supported" });
}

export default dbConnect(handler);
