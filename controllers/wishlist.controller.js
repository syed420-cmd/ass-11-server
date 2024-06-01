import User from "../models/user.model.js";

export const addToWishlist = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user.wishlist.includes(postId)) {
      user.wishlist.push(postId);
      await user.save();
      return res.status(200).json({ message: "Post added to wishlist" });
    }
    return res.status(400).json({ message: "Post already in wishlist" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    user.wishlist = user.wishlist.filter((id) => id.toString() !== postId);
    await user.save();
    res.status(200).json({ message: "Post removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWishlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate("wishlist");
    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
