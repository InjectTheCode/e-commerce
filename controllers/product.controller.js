const catchAsync = require("../utils/catchAsync");
const path = require("path");
const Product = require("../models/product.model");
const filterObject = require("../utils/filterObject");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

// CREATE PRODUCT:
const createProduct = catchAsync(async (req, res, next) => {
  req.body.user = req.user.userId;
  const allowedFields = [
    "name",
    "price",
    "description",
    "image",
    "category",
    "company",
    "colors",
    "featured",
    "freeShipping",
    "inventory",
    "averageRating",
    "user",
  ];
  const filteredObj = filterObject(req.body, ...allowedFields);
  const product = await Product.create(filteredObj);
  res.status(StatusCodes.CREATED).json({
    status: "success",
    data: product,
  });
});

// GET ALL PRODUCTS
const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({
    status: "success",
    count: products.length,
    data: products,
  });
});

// GET ONE PRODUCT:
const getSingleProduct = catchAsync(async (req, res, next) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  }

  res.status(StatusCodes.OK).json({
    status: "success",
    data: product,
  });
});

// UPDATE:
const updateProduct = catchAsync(async (req, res, next) => {
  const { id: productId } = req.params;
  const allowedFields = [
    "name",
    "price",
    "description",
    "image",
    "category",
    "company",
    "colors",
    "featured",
    "freeShipping",
    "inventory",
    "averageRating",
  ];
  const filteredObj = filterObject(req.body, ...allowedFields);
  const product = await Product.findOneAndUpdate({ _id: productId }, filteredObj, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  }

  res.status(StatusCodes.OK).json({
    status: "success",
    data: product,
  });
});

// DELETE:
const deleteProduct = catchAsync(async (req, res, next) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  }

  await product.remove();
  res.status(StatusCodes.OK).json({
    status: "success",
  });
});

// UPLOAD:
const uploadImage = catchAsync(async (req, res, next) => {
  const productImage = req.files.image;
  const maxSize = 1024 * 1024 * 5;

  if (!req.files) {
    throw new CustomError.BadRequestError("No file uploaded!");
  }
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please only upload images.");
  }
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError("Please upload image, smaller than 5MB.");
  }

  // formating the date
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const fullDateFormat = [year, month, day].join("-");

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${fullDateFormat}-` + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({
    status: "success",
    image: `uploads/${productImage.name}`,
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
