import mongoose from "mongoose";

const schema = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    trim: true,
    requred: true,
  },
  Chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },
});

const Messages = new mongoose.model("Messages", schema);
export default Messages;
