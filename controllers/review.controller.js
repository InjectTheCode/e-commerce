const Review = require("../models/review.model");
const catchAsync = require("../utils/catchAsync");

const createReview = catchAsync(async (req, res, next) => {
  res.send("create review");
});

const getAllReviews = catchAsync(async (req, res, next) => {
  res.send("get all reviews");
});

const getSingleReview = catchAsync(async (req, res, next) => {
  res.send("get single review");
});

const updateReview = catchAsync(async (req, res, next) => {
  res.send("update review");
});

const deleteReview = catchAsync(async (req, res, next) => {
  res.send("delete review");
});

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
