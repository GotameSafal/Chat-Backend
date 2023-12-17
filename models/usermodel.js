import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
const Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, "please enter email"],
      unique: true,
      validator: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "please enter password"],
      minLength: true,
      select: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    image: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
Schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
Schema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
Schema.methods.getJwtWebToken = async function () {
  return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

const UserModel = new mongoose.model("User", Schema);
export default UserModel;
