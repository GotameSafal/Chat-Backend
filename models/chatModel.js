import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: { type: mongoose.Schema.Types.ObjectId, ref: "Messages" },
    },
  },
  { timestamps: true }
);

const Chat = new mongoose.model("Chat", schema);
export default Chat;
