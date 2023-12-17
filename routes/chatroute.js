import express from 'express';
import { authorization } from '../middlewares/authorize.js';
import { createChat, fetchChats } from '../controllers/chatController.js';
const router = express.Router();
router.route("/").post(authorization, createChat);
router.route("/").get(authorization, fetchChats);
export default router