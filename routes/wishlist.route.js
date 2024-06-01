// routes/wishlist.js
import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/add", verifyToken, addToWishlist);
router.post("/remove", verifyToken, removeFromWishlist);
router.get("/", verifyToken, getWishlist);

export default router;
