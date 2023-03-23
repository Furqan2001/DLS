import mongoose, {
  Document,
  HydratedDocument,
  Schema,
  model,
  Types,
} from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface IEmailVerification {
  email: string;
  code: string;
}

interface EmailVerificationDoc extends mongoose.Document, IEmailVerification {}
interface EmailVerificationsModel extends mongoose.Model<EmailVerificationDoc> {
  build(attrs: IEmailVerification): EmailVerificationDoc;
}

// 2. Create a Schema corresponding to the document interface.
const EmailVerificationSchema = new Schema<IEmailVerification>({
  email: { type: String, required: true },
  code: { type: String, required: true },
});

// 3. Create a Model.
const emailVerificationModel = () =>
  mongoose.model<EmailVerificationDoc, EmailVerificationsModel>(
    "EmailVerifications",
    EmailVerificationSchema
  );

const EmailVerificationModel = (mongoose.models.EmailVerifications ||
  emailVerificationModel()) as ReturnType<typeof emailVerificationModel>;

export default EmailVerificationModel;
