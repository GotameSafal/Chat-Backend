import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";
import { ErrorHandler } from "../utils/error.js";
export const authorization = async (req, res, next) => {
  let cookie = req.headers.authorization;
  if (!cookie)
    return next(
      new ErrorHandler(401, "you are not allowed to access this resource")
    );
  cookie = cookie.replace("Bearer", "");

  const decryptData = jwt.verify(cookie, process.env.JWT_SECRET);
  const user = await User.findOne({ _id: decryptData.id }, "-friends");
  req.user = user;
  next();
};
