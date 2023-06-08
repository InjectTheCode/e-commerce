const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const CustomError = require("../errors");
const filteringObj = require("../utils/filterObject");
const { StatusCodes } = require("http-status-codes");
const { attachCookiesToResponse } = require("../utils/jwt");

// Get All Users:
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ role: "user" });
  res.status(StatusCodes.OK).json({
    status: "success",
    data: users,
  });
});

// Get Single User:
const getSingleUser = catchAsync(async (req, res, next) => {
  const user = await User.findById({ _id: req.params.id });
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    data: user,
  });
});

// Show Current User:
const showCurrentUser = catchAsync(async (req, res, next) => {
  console.log(req.user);
  res.status(StatusCodes.OK).json({
    status: "success",
    data: req.user,
  });
});

// Update:
const updateUser = catchAsync(async (req, res, next) => {
  const filtered = filteringObj(req.body, "email", "name");
  const user = await User.findOneAndUpdate({ _id: req.user.userId }, filtered, {
    new: true,
    runValidators: true,
  });

  const tokenInfoForSign = {
    email: user.email,
    userId: user._id,
    role: user.role,
    name: user.name,
  };

  attachCookiesToResponse(res, tokenInfoForSign);

  res.status(StatusCodes.OK).json({
    status: "success",
    date: tokenInfoForSign,
  });
});

// Update Password:
const updateUserPassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both password values.");
  }

  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    throw new CustomError.NotFoundError("User not found!");
  }

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials.");
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({
    status: "success",
    data: "Password updated successfully",
  });
});

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
