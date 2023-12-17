import User from "../models/usermodel.js";
import FriendRequest from "../models/friendRequestModel.js";
import { v2 as cloudinary } from "cloudinary";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { ErrorHandler } from "../utils/error.js";
import getDataUri from "../utils/dataParser.js";
import mongoose from "mongoose";

export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorHandler(400, "Please enter email, password"));
  let user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler(400, "Invalid credentials"));
  const result = await user.comparePassword(password);
  if (!result) return next(new ErrorHandler(400, "Invalid credentails"));
  const token = await user.getJwtWebToken();
  // .cookie("Wechat", token, {
  //   expires: new Date(
  //     Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000
  //   ),
  //   httpOnly: true,
  // })
  res.status(200).send({
    success: true,
    message: `successfully logged In`,
    token,
  });
});

export const registerUser = catchAsyncError(async (req, res, next) => {
  const file = req.file;
  const { username, email, password, confirmPassword } = req.body;
  if (!username || !email || !password || !confirmPassword)
    return next(new ErrorHandler(400, "please enter in valid field"));
  let user = await User.findOne({ email });
  if (user)
    return next(
      new ErrorHandler(400, `user already exist with email ${email}`)
    );
  if (password !== confirmPassword)
    return next(
      new ErrorHandler(400, `password and confirm password doesn't match`)
    );
  const uri = getDataUri(file);
  const response = await cloudinary.uploader.upload(uri.content);
  const image = {
    url: response.url,
    public_id: response.public_id,
  };
  user = await User.create({
    username,
    email,
    password,
    image,
  });
  res.status(201).json({
    success: true,
    message: "successfully registered",
    user,
  });
});

export const logout = catchAsyncError(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { isOnline: false });
  res
    .status(200)
    .cookie("Wechat", "", { expires: new Date(0) })
    .send({
      success: true,
      message: "successfully logged out",
    });
});

export const fetchMyData = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id, "-password -friends");
  res.status(200).json({
    success: true,
    user,
  });
});
export const addFriend = catchAsyncError(async (req, res, next) => {
  const { receiver } = req.body;
  await FriendRequest.create({
    sender: req.user._id,
    receiver,
  });
  res.status(201).json({
    success: true,
    message: "Friend request sent",
  });
});

export const confirmFriendRequest = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const sender = await User.findById(req.body.id);
  user.friends.push(sender._id);
  sender.friends.push(user._id);
  await user.save({ new: true });
  await sender.save({ new: true });

  await FriendRequest.findOneAndDelete({
    receiver: req.user._id,
    sender: req.body.id,
  });
  res.status(200).json({
    success: true,
    message: "friend request accepted",
  });
});

export const deleteFriendRequest = catchAsyncError(async (req, res, next) => {
  await FriendRequest.findOneAndDelete({
    receiver: req.user._id,
    sender: req.body.id,
  });
  res.status(200).json({ success: false, message: "friend request deleted" });
});

export const getFriends = catchAsyncError(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const user = await User.findById(req.user._id, "friends").populate({
    path: "friends",
    select: "username image isOnline",
    options: { limit: 15 * page },
  });
  res.status(200).json({
    success: true,
    message: "successfully friends list received",
    friends: user.friends,
  });
});

export const getNewFriends = catchAsyncError(async (req, res, next) => {
  const page = req.query.page || 1;
  const user = await User.findById(req.user._id, "friends");
  const receiverRequest = await FriendRequest.find(
    { receiver: req.user._id },
    "sender"
  );
  const senderRequest = await FriendRequest.find(
    {
      sender: req.user._id,
    },
    "receiver"
  );

  const removeReceiver = receiverRequest.map(
    (item) => new mongoose.Types.ObjectId(item.sender)
  );
  const removeSender = senderRequest.map(
    (item) => new mongoose.Types.ObjectId(item.receiver)
  );

  const newFriends = await User.find({
    _id: {
      $nin: [...user.friends, req.user._id, ...removeReceiver, ...removeSender],
    },
  }).limit(page * 15);

  res.status(200).json({
    success: true,
    message: "list of new friends",
    newFriends,
  });
});

export const searchFriends = catchAsyncError(async (req, res, next) => {
  if (!req.query.keyword)
    return res.status(200).json({
      success: true,
      message: "searched friends received",
      user: [],
    });
  let keyword = {
    username: {
      $regex: req.query.keyword,
      $options: "i",
    },
  };
  const user = await User.find({ ...keyword }, "username image");
  res.status(200).json({
    success: true,
    message: "searched friends received",
    user,
  });
});

export const listFriendRequest = catchAsyncError(async (req, res, next) => {
  const id = req.user._id;
  const requestList = await FriendRequest.find(
    { receiver: id, status: "pending" },
    "sender"
  ).populate("sender", "username image");
  res.status(200).json({
    success: true,
    message: "Friend request list retreived",
    requestList,
  });
});
