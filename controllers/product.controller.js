const catchAsync = require("../utils/catchAsync");

const createProduct = catchAsync(async (req, res, next) => {
  res.send("create product");
});

const getAllProducts = catchAsync(async (req, res, next) => {
  res.send("get all product");
});

const getSingleProduct = catchAsync(async (req, res, next) => {
  res.send("get single product");
});

const updateProduct = catchAsync(async (req, res, next) => {
  res.send("update product");
});

const deleteProduct = catchAsync(async (req, res, next) => {
  res.send("delete product");
});

const uploadImage = catchAsync(async (req, res, next) => {
  res.send("upload image");
});

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
