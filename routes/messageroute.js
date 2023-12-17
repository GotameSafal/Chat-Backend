import express from "express";
import { fetchAllMessage, sendMessage } from "../controllers/messageController.js";
import { authorization } from "../middlewares/authorize.js";
const router = express.Router();
router.route("/:chatId").get(fetchAllMessage)
router.route("/").post(authorization, sendMessage);
export default router;
