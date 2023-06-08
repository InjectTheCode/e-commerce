const CustomAPIError = require("./custom-api");
const UnauthenticatedError = require("./unauthenticated");
const NotFoundError = require("./not-found");
const BadRequestError = require("./bad-request");
const ForbiddenError = require("./forbidden");

module.exports = {
  ForbiddenError,
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
};
