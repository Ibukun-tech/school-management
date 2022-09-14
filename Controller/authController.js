const jwt = require("jsonwebtoken");
const UserModel = require("./../Model/userModel");
const ApiError = require("./../utils/ErrorClass");
const crypto = require("crypto");
const { catchAsyncError } = require("./errorController");
const { promisify } = require("util");
const email = require("./../utils/email");
exports.signUp = catchAsyncError(async (req, res, next) => {
  console.log("sign up");

  console.log(req.body);
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    dateOfBirth: req.body.dateOfBirth,
    mobileNumber: req.body.mobileNumber,
    role: req.body.role,
    photo: req.body.photo,
    password: req.body.password,
    passwordChanged: req.body.passwordChanged,
  });
  console.log(user);
  if (!user) {
    return next(
      new ApiError(
        "you have not yet inputted your details for you to be logged in",
        400
      )
    );
  }
  console.log("sign 1", process.env.EXPIRESIN);
  const token = jwt.sign({ id: user._id }, process.env.KEY, {
    expiresIn: process.env.EXPIRESIN,
  });
  const cookieOption = {
    secure: true,
    // expires: new Date(Date.now() + process.env.EXPIRESIN * 24 * 60 * 60 * 1000),
  };
  if (process.env.NODE_ENV === "Production") cookieOption.httpOnly = true;

  res.cookie("jwt", token, cookieOption);
  res.status(201).json({
    status: "success",
    user,
    token,
  });
});
exports.logIn = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user || !user.checkPassword(password, user.password)) {
    return next(
      new ApiError(
        "Incorrect Email or password make sure the email is correct",
        400
      )
    );
  }
  const token = jwt.sign({ id: user._id }, process.env.KEY, {
    expiresIn: process.env.EXPIRESIN,
  });
  const cookieOption = {
    secure: true,
    // expires: process.env.EXPIRESIN,
  };
  if (process.env.NODE_ENV === "Production") cookieOption.httpOnly = true;

  res.cookie("jwt", token, cookieOption);
  res.status(200).json({
    status: "success",
    token,
  });
});
exports.protect = catchAsyncError(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return next(new ApiError("You are not yet logged in", 400));
  }
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  const decoded = await promisify(jwt.verify)(token, process.env.Key);
  console.log(decoded, "bvgysyfsf");
  const user = await UserModel.findOne({ _id: decoded.id });
  console.log(user);
  if (!user) {
    return next(new ApiError("you are not yet still logged in", 400));
  }
  if (user.newPassword(decoded.iat)) {
    return next(new ApiError("you just recently changed password", 400));
  }
  req.user = user;
  console.log("update daata aaa");
  // return next();
  // console.log("update daata aaa");
  next();
});

exports.forgetPassword = catchAsyncError(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    next(new ApiError("This is not your email account", 400));
  }
  const resetToken = user.setPasswordResetToken();
  const token = crypto.createHash("sha256").update(resetToken).digest("hex");
  const message = `To change your password click on this link:
  ${req.protocol}://${req.get("host")}/api/v1/user/${token}`;
  const emailOptions = {
    message,
    email: user.email,
    subject: "The link t change your password and it would up to 5 minutes",
  };
  try {
    await email(emailOptions);
    res.statu(200).json({
      status: "success",
      message: "Link has been sent to your email",
    });
  } catch (err) {
    user.resetToken = undefined;
    user.passwordResetTimeExpires = undefined;
    user.save({ validateBeforeSave: false });
    next(new ApiError("There was  an error sending you the mail", 400));
  }
});
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const user = await UserModel.findOne({
    setPasswordResetToken: req.params.resetToken,
    passwordResetTimeExpires: { $ge: Date.now() },
  });
  if (!user) {
    next(
      new ApiError(
        "you have exceeded the minute time bro to reset your password",
        400
      )
    );
  }
  user.password = req.body.password;
  user.passwordConfirmed = req.body.passwordConfirmed;
  user.resetToken = undefined;
  user.passwordResetTimeExpires = undefined;
  user.passwordTimeChangeed = undefined;
  user.save({ validateBeforeSave: true });
  // const token = jwt.sign();
  const token = jwt.sign({ id: user._id }, process.env.KEY, {
    expiresIn: process.env.EXPIRESIN,
  });
  const cookieOption = {
    secure: true,
    // expires: process.env.EXPIRESIN,
  };
  if (process.env.NODE_ENV === "Production") cookieOption.httpOnly = true;

  res.cookie("jwt", token, cookieOption);
  res.status(200).json({
    status: "success",
    token,
  });
});
