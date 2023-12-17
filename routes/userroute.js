import express from "express";
import {
  addFriend,
  confirmFriendRequest,
  deleteFriendRequest,
  loginUser,
  registerUser,
  getFriends,
  getNewFriends,
  logout,
  searchFriends,
  listFriendRequest,
  fetchMyData,
} from "../controllers/usercontrollers.js";
import { multerdata } from "../middlewares/multer.js";
import { authorization } from "../middlewares/authorize.js";
const router = express.Router();
router.route("/login").post(loginUser);
router.route("/signup").post(multerdata, registerUser);
router.route("/logout").get(authorization, logout);
router.route("/me").get(authorization, fetchMyData);
router.route("/addfriend").post(authorization, addFriend);
router.route("/confirmFriend").post(authorization, confirmFriendRequest);
router.route("/deleteFriend").delete(authorization, deleteFriendRequest);
router.route("/getFriends").get(authorization, getFriends);
router.route("/getNewFriends").get(authorization, getNewFriends);
router.route("/search").get(authorization, searchFriends);
router.route("/requests").get(authorization, listFriendRequest);
export default router;
