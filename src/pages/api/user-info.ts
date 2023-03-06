import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../common/libs/dbConnect";
import User from "../../common/modals/User";
import AWS from "aws-sdk";
import multiparty from "multiparty";
import fs from "fs";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadFilesToS3 = async (file) => {
  const filename = file.originalFilename + Date.now();

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${filename}`,
    Body: fs.createReadStream(file.path),
    ContentType: file.headers["content-type"],
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.log(`Error uploading file: ${error.message}`);
    throw new Error(error);
  }
};

const updateUserInfo = async ({ web3AccountAddress, name, email, avatar }) => {
  if (!web3AccountAddress || !name || !email) {
    throw {
      code: 400,
      message: "All fields are required {web3AccountAddress, name, email}",
    };
  }

  try {
    let user = await User.findOne({ web3AccountAddress });

    if (user) {
      user.name = name;
      user.email = email;
      user.avatar = avatar;
    } else {
      user = new User({ name, email, web3AccountAddress, avatar });
    }
    await user.save();
  } catch (err) {
    console.log("error in dealing with the user ", err);
    throw {
      code: 500,
      message: "Internal Error. Please try again later",
    };
  }

  return;
};

const parseForm = (req) => {
  const form = new multiparty.Form();
  return new Promise((resolve, reject) => {
    form.parse(req, async (error, fields, filesField) => {
      if (error) {
        console.log(`Error parsing form data: ${error.message}`);
        return reject({ code: 500, message: "Error parsing form data" });
      }

      const name = fields.name[0];
      const web3AccountAddress = fields.web3AccountAddress[0];
      const email = fields.email[0];

      const files = filesField.files;

      let avatar;

      try {
        if (files?.[0]) {
          avatar = await uploadFilesToS3(files[0]);
        }
        await updateUserInfo({ web3AccountAddress, name, email, avatar });
        resolve("User Info updated successfully");
      } catch (err) {
        return reject(err);
      }
    });
  });
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json({ name: "Only Post Method is supported" });
  }

  try {
    const result = await parseForm(req);
    res.json({ result });
  } catch (err) {
    return res.status(err?.code || 500).json({ message: err?.message });
  }
}

export default dbConnect(handler);
