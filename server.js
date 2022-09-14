const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: `${__dirname}/config.env` });
const app = require("./app");
// WORKS FOR UNHANDLED VARIABLES
process.on("uncaughtException", (err) => {
  console.log(err.message);
  process.exit(1);
});

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("successful connected");
  })
  .catch((err) => {
    console.log(err);
  });
const server = app.listen(
  (port = process.env.PORT || 3000),
  "127.0.0.1",
  () => {
    console.log(`You are currently logged into ${port}`);
  }
);
// WORKS FOR ASYNCHRONOUS
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
