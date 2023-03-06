import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../common/libs/dbConnect";
import User, { IDefaultReturnedType } from "../../common/modals/User";
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

const updateUserInfo = async (data) => {
  if (!data?.web3AccountAddress) {
    throw {
      code: 400,
      message: "web3AccountAddress field is required",
    };
  }

  const {
    web3AccountAddress,
    name,
    email,
    avatar,
    username,
    bio,
    phoneNumber,
    birthDate,
    gender,
  } = data;

  // remove Undefined key from obj

  const userObj = { web3AccountAddress };
  Object.keys(data).map((k) => {
    userObj[k] = k;
  });

  try {
    let user: any = await User.findOne({ web3AccountAddress });

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.avatar = avatar || user.avatar;
      user.username = username || user.username;
      user.bio = bio || user.bio;
      user.birthDate = birthDate || user.birthDate;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.gender = gender || user.gender;
    } else {
      user = new User({
        web3AccountAddress,
        name,
        email,
        avatar,
        username,
        bio,
        birthDate,
        phoneNumber,
        gender,
      });
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

      const name = fields.name?.[0];
      const web3AccountAddress = fields.web3AccountAddress?.[0];
      const email = fields.email?.[0];
      const username = fields.username?.[0];
      const bio = fields.bio?.[0];
      const phoneNumber = fields.phoneNumber?.[0];
      const birthDate = fields.birthDate?.[0];
      const gender = fields.gender?.[0];

      console.log("bio is ", bio, gender, phoneNumber, birthDate);
      const files = filesField.files;

      let avatar;

      try {
        if (files?.[0]) {
          avatar = await uploadFilesToS3(files[0]);
        }
        await updateUserInfo({
          web3AccountAddress,
          name,
          email,
          avatar,
          username,
          bio,
          phoneNumber,
          birthDate,
          gender,
        });
        resolve("User Info updated successfully");
      } catch (err) {
        return reject(err);
      }
    });
  });
};

const fetchUserInfo = async (web3AccountAddress: string) =>
  User.findOne({ web3AccountAddress });

const updateUserBioInfo = async (req: NextApiRequest) => {
  const { web3AccountAddress, bio, phoneNumber, birthDate, gender } =
    req.body.bioInfo;

  try {
    let user = await User.findOne({ web3AccountAddress });

    if (user) {
      user.bio = bio;
      user.phoneNumber = phoneNumber;
      user.birthDate = birthDate;
      user.gender = gender;
    } else {
      user = new User({
        web3AccountAddress,
        bio,
        phoneNumber,
        birthDate,
        gender,
      });
    }
    await user.save();
  } catch (err) {
    console.log("error in dealing with the user ", err);
    throw {
      code: 500,
      message: "Internal Error. Please try again later",
    };
  }
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // first retrive user info
  if (req.method == "GET") {
    const { web3AccountAddress } = req.query;
    if (!web3AccountAddress) {
      return res
        .status(400)
        .json({ message: "web3AccountAddress is required" });
    }
    try {
      const user = await fetchUserInfo(web3AccountAddress as string);
      return res.json({ user });
    } catch (err) {
      console.log("err in fetching the user info ", err);
      return res.status(500).json({ message: err?.message });
    }
  } else if (req.method === "POST") {
    // add new user info

    try {
      // update user Bio information like phoneNumber, bio, birthdate, gender
      // if (typeof req.body?.bioInfo !== "undefined") {
      //   await updateUserBioInfo(req);
      //   return res.json({ message: "user bio updated successfully" });
      // }

      //  update user Info like email, profilePic etc
      const result = await parseForm(req);
      res.json({ result });
    } catch (err) {
      return res.status(err?.code || 500).json({ message: err?.message });
    }
  } else
    return res.status(400).send({ message: "this method is not supported" });
}

export default dbConnect(handler);
