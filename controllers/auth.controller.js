import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    name === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  //exist or not

  const existing = await User.findOne({ email });

  if (existing) {
    return next(errorHandler(400, "User already exists"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json("Signup successful");
  } catch (error) {
    return next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }
    const user = {
      id: validUser._id,
      name: validUser.name,
      email: validUser.email,
      image: validUser.profilePicture,
      isAdmin: validUser.isAdmin,
      wishlist: validUser.wishlist,
    };

    const token = jwt.sign(user, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;

    //set httpOnly cookie
    res.cookie("access_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), //1 day
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.json(user);
  } catch (error) {
    return next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      const userObject = {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.profilePicture,
        isAdmin: user.isAdmin,
        wishlist: user.wishlist,
      };
      const token = jwt.sign(userObject, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res.cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), //1 day
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      });
      res.json(userObject);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        name: name,
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const userObject = {
        id: newUser._doc._id,
        name: newUser._doc.name,
        email: newUser._doc.email,
        image: newUser._doc.profilePicture,
        isAdmin: newUser._doc.isAdmin,
        wishlist: [],
      };
      const token = jwt.sign(userObject, process.env.JWT_SECRET);
      res.cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), //1 day
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      });

      res.json(userObject);
    }
  } catch (error) {
    next(error);
  }
};
