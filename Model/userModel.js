const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    validator: validator.isEmail,
  },
  dateOfBirth: {
    type: String,
  },
  mobileNumber: {
    type: Number,
    min: 11,
  },
  role: {
    type: String,
    enum: ["student", "lecturer"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "your password is required sir"],
    min: 7,
    // select: false,
  },
  passwordConfirmed: {
    type: String,
    validate: {
      validator: function (val) {
        return this.password === val;
      },
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
  course: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "CourseModel",
    },
  ],

  resetToken: String,
  passwordTimeChanged: Date,
  passwordResetTimeExpires: Date,
});
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "course",
    select: "-_id -__v   ",
  });
  next();
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirmed = undefined;
  next();
});
userSchema.methods.checkPassword = function (password, dbPassword) {
  console.log("checking password");
  // if (!this.isModified("password") || this.isNew) return false;

  return bcrypt.compare(password, dbPassword);
};
userSchema.methods.newPassword = function (jwtTime) {
  if (this.passwordTimeChanged) {
    const passwordChangTime = Number.parseInt(
      parseInt(this.passwordChangTime.getTime() / 1000, 10)
    );
    return jwtTime < passwordChangTime;
  }
  return false;
};
userSchema.methods.setPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTimeExpires = Date.now() + 5 * 60 * 1000;
  return resetToken;
};
const UserModel = mongoose.model("UserModel", userSchema);
module.exports = UserModel;
