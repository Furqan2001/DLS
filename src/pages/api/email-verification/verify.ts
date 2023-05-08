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
    const { email, code } = req.body;
    if (!email || !code)
      return res.send({
        message: "${ email, code } all fields are required",
      });

    const emailVerificationData = await EmailVerificationModel.findOne({
      email,
      code,
    });

    if (emailVerificationData) {
      await EmailVerificationModel.deleteOne({ email, code });
      return res.json({ message: "email verified" });
    }
    return res.status(400).json({ message: "Invalid code" });
  } else
    return res.status(400).send({ message: "this method is not supported" });
}

export default dbConnect(handler);
