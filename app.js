// Importing main modules.
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// Importing middleware.
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// Importing routes.
const authRoute = require("./routes/auth.route");

const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
