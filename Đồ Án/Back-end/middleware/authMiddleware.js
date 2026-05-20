import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token =
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No token",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};

export const admin = (req, res, next) => {
  if (req.user?.isAdmin) {
    return next();
  }
  res.status(403).json({ message: "Not authorized as admin" });
};
