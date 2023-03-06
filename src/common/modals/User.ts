import mongoose, { HydratedDocument, Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface IUser {
  name: string;
  email: string;
  avatar?: string;
  web3AccountAddress: string;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String,
  web3AccountAddress: { type: String, required: true },
});

// 3. Create a Model.
const UserModel = () => mongoose.model<IUser>("Users", userSchema);

export default (mongoose.models.Users || UserModel()) as ReturnType<
  typeof UserModel
>;
