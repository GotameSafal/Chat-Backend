import multer from "multer";

const storage = multer.memoryStorage();

export const multerdata = multer({ storage }).single("profile");
