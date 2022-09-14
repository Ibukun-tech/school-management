const express = require("express");
// const path = require("path");
const ApiError = require("./utils/ErrorClass");
const { errorController } = require("./Controller/errorController");
const morgan = require("morgan");
const courseRouter = require("./Route/courseRoute");
const userRouter = require("./Route/userRoute");
const app = express();

// console.log(process.env);

if (process.env.NODE_ENV === "Development") {
  console.log("development");
  app.use(morgan("dev"));
}
app.use(express.json());
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/user", userRouter);
// app.use();
app.all("*", (req, res, next) => {
  next(new ApiError("no implemented url address like this", 400));
});
app.use(errorController);

module.exports = app;
