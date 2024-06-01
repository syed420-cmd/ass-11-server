import mongoose from "mongoose";

const NewsLetterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Newsletter = mongoose.model("Newsletter", NewsLetterSchema);

export default Newsletter;
