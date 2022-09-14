const express = require("express");
const {
  createCourse,
  getAllCourse,
  allMceCourse,
  updateOneCourse,
  oneCourse,
  findOneCourseAndDelete,
} = require("./../Controller/courseContoller");
const courseRouter = express.Router();
courseRouter.route("/allmcecourse", allMceCourse, getAllCourse);
courseRouter.get("/allcourse", getAllCourse);
courseRouter.post("/allcourse", createCourse);
courseRouter
  .route("/:id")
  .patch(updateOneCourse)
  .get(oneCourse)
  .delete(findOneCourseAndDelete);
module.exports = courseRouter;
