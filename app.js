import express from "express";
import { config } from "dotenv";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userroute.js";
import chatRoute from "./routes/chatroute.js";
import messageRoute from "./routes/messageroute.js";
import cors from "cors";
const app = express();

config({ path: "./config/config.env" });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*";
  })
);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use("/api", userRoute);

app.use(errorMiddleware);
export default app;
