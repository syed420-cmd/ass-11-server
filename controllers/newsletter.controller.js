import Newsletter from "../models/newsletter.model.js";
export const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "You have already subscribed" });
    }
    const newsletter = new Newsletter({ email });
    await newsletter.save();
    res.status(201).json({ newsletter });
  } catch (error) {
    return next(error);
  }
};
