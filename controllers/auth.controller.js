const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync.js");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors");

const register = catchAsync(async (req, res, next) => {
  const { email, name, password } = req.body;
  const user = await User.create({ email, name, password });
  res.status(StatusCodes.OK).json({
    status: "success",
    data: {
      email: user.email,
      name: user.name,
      userId: user._id,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  res.send("Login route.");
});

const logout = catchAsync(async (req, res, next) => {
  res.send("Logout route.");
});

module.exports = {
  register,
  login,
  logout,
};
