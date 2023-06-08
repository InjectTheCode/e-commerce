const CustomError = require("../errors");
const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const { tokenIsValid } = require("../utils/jwt");

const authenticateUser = catchAsync(async (req, res, next) => {
  // when we use cookies, we can access the token with signedCookies.
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.UnauthenticatedError("Please provide a token!");
  }

  const { email, userId, role, name } = tokenIsValid(token);

  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError.NotFoundError(
      "This token is not belonging to this user, User not found!"
    );
  }

  req.user = { email, userId, role, name };
  next();
});

const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.ForbiddenError("You are not allowed to access this route.");
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermission,
};
