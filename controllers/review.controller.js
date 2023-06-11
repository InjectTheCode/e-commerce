const Review = require("../models/review.model");
const Product = require("../models/product.model");
const catchAsync = require("../utils/catchAsync");
const CustomError = require("../errors");
const filterObject = require("../utils/filterObject");
const { StatusCodes } = require("http-status-codes");
const { attachCookiesToResponse } = require("../utils/jwt");

const createReview = catchAsync(async (req, res, next) => {
  const { product: productId } = req.body;
  req.body.user = req.user.userId;

  const allowedFields = ["rating", "title", "comment", "user", "product"];
  const filteredObj = filterObject(req.body, ...allowedFields);

  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (alreadySubmitted) {
    throw new CustomError.BadRequestError("Already submitted review for this product.");
  }

  const review = await Review.create(filteredObj);
  res.status(StatusCodes.CREATED).json({
    status: "success",
    data: review,
  });
});

const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  });
  res.status(StatusCodes.OK).json({
    status: "success",
    count: reviews.length,
    data: reviews,
  });
});

const getSingleReview = catchAsync(async (req, res, next) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId }).populate({
    path: "user",
    select: "name",
  });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    data: review,
  });
});

const updateReview = catchAsync(async (req, res, next) => {
  const { id: reviewId } = req.params;
  const allowedFields = ["rating", "title", "comment"];
  const filteredObj = filterObject(req.body, ...allowedFields);
  const review = await Review.findByIdAndUpdate({ _id: reviewId }, filteredObj, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({
    status: "success",
    data: review,
  });
});

const deleteReview = catchAsync(async (req, res, next) => {
  const { id: reviewId } = req.params;
  const review = await Review.findByIdAndDelete({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ status: "success" });
});

const getSingleProductReviews = catchAsync(async (req, res, next) => {
  const { id: productId } = req.params;
  const review = await Review.find({ product: productId }).populate({
    path: "user",
    select: "name",
  });
  if (review.length < 1) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    count: review.length,
    data: review,
  });
});

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
