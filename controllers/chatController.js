import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { ErrorHandler } from "../utils/error.js";
import Chat from "../models/chatModel.js";
import User from "../models/usermodel.js";
export const createChat = catchAsyncError(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) return next(new ErrorHandler(400, "userid not found"));
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password -friends")
    .populate("latestMessage");

  isChat = await User.populate(isChat,{
    path: "latestMessage.sender",
    select: "-friends -password",
  });
  if (isChat.length > 0) {
    res.status(200).json({
      success: true,
      isChat: isChat[0],
    });
  } else {
    let createdChat = await Chat.create({
      chatname: "sender",
      users: [req.user._id, userId],
    });
    let fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password -friends"
    );
    res.status(201).json({
      success: true,
      isChat:fullChat,
    });
  }
});

export const fetchChats = catchAsyncError(async (req, res, next) => {
  let chatData = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("users", "-password -friends")
    .populate("latestMessage")
    .populate("groupAdmin", "-password -friends")
    .sort({ updatedAt: -1 });
  chatData = await User.populate(chatData, {
    path: "latestMessage.sender",
    select: "-password -friends",
  });

  res.status(200).send(chatData);
});
