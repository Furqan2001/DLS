import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../common/libs/dbConnect";
import nodemailer from "nodemailer";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { to, subject, message } = req.body;
  if (!to || !subject || !message)
    return res
      .status(400)
      .send({ message: `{to, subject, message} all fields are required` });

  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    service: "outlook", // service name
    secureConnection: false,
    tls: {
      ciphers: "SSLv3", // tls version
    },
    port: 587, // port
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_USER_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: "DLS No-reply <injurdlion332@outlook.com>", // sender address
      to: to,
      subject: subject, // Subject line
      text: message, // plain text body
      html: `<p>${message}</p>`, // html body
    });

    return res.send(info);
  } catch (err) {
    res.status(500).send(err);
  }
}

export default dbConnect(handler);
