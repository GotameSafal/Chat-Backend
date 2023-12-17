import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import Message from "../models/messageModel.js";
import User from "../models/usermodel.js";
import Chat from "../models/chatModel.js";
export const sendMessage = catchAsyncError(async (req, res, next) => {
  let message = await Message.create({
    sender: req.user._id,
    message: req.body.content,
    Chat: req.body.chatId,
  });
  message = await message.populate("sender", "-friends -password");
  message = await message.populate("Chat");
  message = await User.populate(message, {
    path: "Chat.users",
    select: "-password -friends ",
  });
  await Chat.findByIdAndUpdate(req.body.chatId, {
    $set: { latestMessage: req.body.content },
  });
  res.status(200).json({ success: true, message });
});

export const fetchAllMessage = catchAsyncError(async (req, res, next) => {
  let message = await Message.find({ Chat: req.params.chatId })
    .populate("sender", "-friends -password")
    .populate("Chat");
  res.status(200).json({ success: true, message });
});
