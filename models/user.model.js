import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/ddszzpmvy/image/upload/v1716908110/blog/profile/wsq0r6v4ajbyxvxrgqf6.png",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
