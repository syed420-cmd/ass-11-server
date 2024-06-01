import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import { uploadImage } from "../utils/cloudinary.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  if (
    !req.body.title ||
    !req.body.long_description ||
    !req.body.short_description ||
    !req.body.image ||
    !req.body.category
  ) {
    return next(errorHandler(400, "Please provide all required fields"));
  }
  const imageUrl = await uploadImage(req.body.image);
  if (!imageUrl) {
    return next(errorHandler(500, "Image upload failed"));
  }

  req.body.image = imageUrl;
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    return next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 50;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      posts,
    });
  } catch (error) {
    return next(error);
  }
};

export const getTopTenPosts = async (req, res, next) => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $sort: { long_description: -1 },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          title: 1,
          short_description: 1,
          long_description: 1,
          category: 1,
          image: 1,
          createdAt: 1,
          user: {
            name: 1,
            profilePicture: 1,
          },
        },
      },
    ]);

    res.status(200).json({
      posts,
    });
  } catch (error) {
    return next(error);
  }
};

export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("The post has been deleted");
  } catch (error) {
    return next(error);
  }
};

export const updatepost = async (req, res, next) => {
  try {
    if (req.body.newImage == "yes") {
      const imageUrl = await uploadImage(req.body.image);
      if (!imageUrl) {
        return next(errorHandler(500, "Image upload failed"));
      }
      req.body.image = imageUrl;
    }
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          long_description: req.body.long_description,
          short_description: req.body.short_description,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    return next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    // return post with user details and comments
    const post = await Post.findOne({ _id: req.params.postId }).populate(
      "userId"
    );
    let comments = [];
    // return comment with post id for each comment return taht comment user also
    if (post) {
      comments = await Comment.find({ postId: req.params.postId }).populate(
        "userId"
      );
    }

    res.status(200).json({ ...post._doc, comments });
  } catch (error) {
    return next(error);
  }
};
