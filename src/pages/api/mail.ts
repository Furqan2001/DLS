import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../common/libs/dbConnect";
import AWS from "aws-sdk";
import nodemailer from "nodemailer";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("process.env.password ", process.env.password);
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: "ayan.101121@gmail.com", //"securesally@gmail.com",
      pass: process.env.password2,
    },
    secure: false,
  });

  const mailData = {
    from: "ayan.101121@gmail.com",
    to: "injurdlion332@gmail.com",
    subject: `Message From M Ahmed Mushtaq`,
    text: "message" + " | Sent from: ",
    html: `<div>${"hello world"}</div><p>Sent from: </p>`,
  };

  transporter.sendMail(mailData, function (err, info) {
    if (err) console.log(err);
    else {
      console.log(info);
      res.send("success");
    }
  });
}

export default dbConnect(handler);
