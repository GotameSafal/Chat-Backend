import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import { connectDb } from "./config/connectDb.js";
import { v2 as cloudinary } from "cloudinary";
import User from "./models/usermodel.js";
connectDb();
cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_NAME,
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", async (socket) => {
  var userId;
  socket.on("set up", async (user) => {
    userId = user?._id;
    socket.join(user._id);

    await User.findByIdAndUpdate(userId, {
      $set: { isOnline: true },
    });
    socket.broadcast.emit("getUserOnline", userId);
  });

  socket.on("join_Chat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("new_message", (message) => {
    let chat = message.Chat;
    chat.users.forEach((user) => {
      socket.to(user._id).emit("update_chat_list");

      if (user._id !== message.sender._id) {
        socket.to(user._id).emit("message_received", message);
      } else {
        socket.emit("update_my_chat_list");
      }
    });
  });
  socket.on("friend_request_accepted", async () => {
    const user = await User.findById(userId, "friends").populate({
      path: "friends",
      select: "username image isOnline",
      options: { limit: 15 * 1 },
    });
    socket.emit("refetch friends", user.friends);
  });
  socket.on("disconnect", async () => {
    await User.findByIdAndUpdate(userId, {
      $set: { isOnline: false },
    });
    socket.broadcast.emit("getUserOffline", userId);
  });
});
server.listen(8000, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
