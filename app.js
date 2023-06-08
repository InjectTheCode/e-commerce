// Importing main modules.
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Importing middleware.
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// Importing routes.
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const productRoute = require("./routes/product.route");

const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
