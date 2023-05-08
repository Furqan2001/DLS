import mongoose, {
  Document,
  HydratedDocument,
  Schema,
  model,
  Types,
} from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface IUser {
  name: string;
  email: string;
  avatar?: string;
  accountAddress: string;
  username: string;
  cnic: string;
  bio?: string;
  phoneNumber?: string;
  birthDate?: Date;
  gender?: "male" | "female" | "other";
}

interface UserDoc extends mongoose.Document, IUser {}
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: IUser): UserDoc;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
  name: { type: String },
  email: { type: String },
  username: { type: String },
  cnic: { type: String },
  accountAddress: { type: String, required: true },
  avatar: String,
  bio: String,
  phoneNumber: String,
  birthDate: Date,
  gender: String,
});

// 3. Create a Model.
const userModel = () => mongoose.model<UserDoc, UserModel>("Users", userSchema);

const UserModel = (mongoose.models.Users || userModel()) as ReturnType<
  typeof userModel
>;

userSchema.statics.build = (attrs: IUser) => {
  return new UserModel(attrs);
};

export type IDefaultReturnedType = Document<unknown, {}, UserDoc> &
  Omit<
    UserDoc & {
      _id?: Types.ObjectId;
    },
    never
  >;

export default UserModel;
