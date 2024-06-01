import express from "express";
import {
  create,
  deletepost,
  getTopTenPosts,
  getposts,
  updatepost,
  getPost
} from "../controllers/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getposts", getposts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);
router.put("/updatepost/:postId/:userId", verifyToken, updatepost);
router.get("/gettopposts", getTopTenPosts);
router.get("/:postId", getPost);

export default router;
