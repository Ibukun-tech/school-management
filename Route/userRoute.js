const express = require("express");
const userRouter = express.Router();
const {
  protect,
  signUp,
  logIn,
  forgetPassword,
  resetPassword,
} = require("./../Controller/authController");
const {
  findAllUser,
  deleteAccount,
  updateData,
} = require("./../Controller/userController");
console.log("modd");
userRouter.route("/").get(findAllUser);
userRouter.route("/signup").post(signUp);
userRouter.route("/login").post(logIn);

userRouter.route("/delete").delete(protect, deleteAccount);
userRouter.route("/forgetpassword").post(forgetPassword);
userRouter.route("/:resetToken").post(resetPassword);
// userRouter.use(protect);
userRouter.route("/registercourse").patch(protect, updateData);
module.exports = userRouter;
