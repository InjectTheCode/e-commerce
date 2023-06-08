const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync.js");
const { attachCookiesToResponse } = require("../utils/jwt");
const { StatusCodes } = require("http-status-codes");
const {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors");

const register = catchAsync(async (req, res, next) => {
  const { email, name, password } = req.body;

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ email, name, password, role });

  const tokenInfoForSign = {
    email: user.email,
    userId: user._id,
    role: user.role,
    name: user.name,
  };

  attachCookiesToResponse(res, tokenInfoForSign);

  res.status(StatusCodes.OK).json({
    status: "success",
    data: {
      email: user.email,
      name: user.name,
      userId: user._id,
      role: user.role,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password.");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new UnauthenticatedError("Invalid Credentials!");
  }

  const tokenInfoForSign = {
    email: user.email,
    userId: user._id,
    role: user.role,
  };

  attachCookiesToResponse(res, tokenInfoForSign);

  res.status(StatusCodes.OK).json({
    status: "success",
    data: {
      email: user.email,
      name: user.name,
      userId: user._id,
      role: user.role,
    },
  });
});

const logout = catchAsync(async (req, res, next) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 1000),
  });
});

module.exports = {
  register,
  login,
  logout,
};
