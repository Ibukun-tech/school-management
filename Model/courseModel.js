const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
  },
  code: {
    type: Number,
  },

  textBooks: {
    type: [String],
  },
  courseUrl: {
    type: String,
  },
});
courseSchema.pre("save", function (next) {
  this.courseUrl = `${this.name} ${this.code}`;
  next();
});
const CourseModel = mongoose.model("CourseModel", courseSchema);
module.exports = CourseModel;
