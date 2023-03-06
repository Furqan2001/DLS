// /lib/dbConnect.js
import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://user:UO3uv1iWGJ8BoZ2D@cluster1.qfcdrhz.mongodb.net/?retryWrites=true&w=majority";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

const dbConnect = (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    return handler(req, res);
  }
  // Use new db connection
  try {
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  } catch (err) {
    console.log("err in connecting with mongodb ", err);
  }
  return handler(req, res);
};

export default dbConnect;
