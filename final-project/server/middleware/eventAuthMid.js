import jwt from "jsonwebtoken";
import db from "../db.js";

const eventAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded: ", decoded);
    const userId = decoded.userId;

    const user = await db.User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Check if the user is a Musician
    if (user.UserType !== "Musician") {
      return res
        .status(403)
        .json({ message: "Forbidden: Only musicians can create events" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error verifying token:", JSON.stringify(error, null, 2));
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default eventAuth;
