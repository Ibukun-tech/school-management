const CourseModel = require("./../Model/courseModel");
const { catchAsyncError } = require("./errorController");
exports.allMceCourse = (req, res, next) => {
  req.query.name = "mce";
  next();
};
exports.getAllCourse = catchAsyncError(async (req, res, next) => {
  const allCourse = await CourseModel.find();
  res.status(200).json({
    status: "success",
    data: 22,
    data: {
      allCourse,
    },
  });
});
exports.createCourse = catchAsyncError(async (req, res, next) => {
  // console.log("kiojojjd");
  const data = await CourseModel.create(req.body);
  res.status(201).json({
    status: "success",
    data,
  });
});
exports.oneCourse = catchAsyncError(async (req, res, next) => {
  // console.log("nndjdn");
  const data = await CourseModel.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data,
  });
});
exports.updateOneCourse = catchAsyncError(async (req, res, next) => {
  const data = await CourseModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data,
  });
});
exports.findOneCourseAndDelete = catchAsyncError(async (req, res, next) => {
  await CourseModel.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
exports.deleteCourse = catchAsyncError(async (req, res, next) => {
  await CourseModel.findByIdAndDelete(req.params._id);
  res.status(204).json({
    status: "sucess",
    data: null,
  });
});
