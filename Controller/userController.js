const UserModel = require("./../Model/userModel");
const ApiError = require("./../utils/ErrorClass");
const { catchAsyncError } = require("./errorController");
exports.deleteAccount = catchAsyncError(async (req, res, next) => {
  const data = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      active: false,
    },
    {
      new: true,
    }
  );
  if (!data) {
    return next(
      new ApiError("There is an error in updating your account Profile", 400)
    );
  }
  res.status(204).json({ status: "success", data });
});
const filterData = function (filter) {
  const obj = { ...filter };
  const objectNotWanted = ["password", "passwordConfirmed"];
  objectNotWanted.forEach((el) => {
    obj[el];
  });
  console.log(obj);
  return obj;
};
exports.updateData = catchAsyncError(async (req, res, next) => {
  const filter = filterData(req.body);

  const data = await UserModel.findByIdAndUpdate(id, filter, {
    new: true,
    runValidator: true,
  });
  console.log(data);
  if (!data) {
    return next(new ApiError("bad request to the database", 400));
  }
  res.status(200).json({
    status: "success",
    data,
  });
});
exports.findAllUser = catchAsyncError(async (req, res, next) => {
  console.log("stuff");
  const users = await UserModel.find();
  res.status(200).json({
    status: "success",
    users,
  });
});
