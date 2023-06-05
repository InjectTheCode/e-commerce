const app = require("./app");
const mongoose = require("mongoose");

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    mongoose
      .connect(process.env.MONGODB_URL)
      .then(() => console.log("Database connection established."));

    app.listen(port, console.log(`Server started at ${port}.`));
  } catch (error) {
    console.log(error);
  }
};

start();
