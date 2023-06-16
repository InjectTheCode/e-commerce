const CustomError = require("../errors");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const catchAsync = require("../utils/catchAsync");
const { StatusCodes } = require("http-status-codes");

// GET ALL ORDERS:
const getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({
    status: "success",
    count: orders.length,
    data: orders,
  });
});

// GET SINGLE ORDER:
const getSingleOrder = catchAsync(async (req, res, next) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id: ${orderId}`);
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    data: order,
  });
});

// GET CURRENT USER's ORDERS:
const getCurrentUserOrder = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.userId });
  let data = orders.length < 1 ? "You have no orders!" : orders;
  res.status(StatusCodes.OK).json({
    status: "success",
    count: orders.length,
    data,
  });
});

// CREATE ORDER:
const createOrder = catchAsync(async (req, res, next) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("No cart items provided.");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError("Please provide tax and shipping fee.");
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(`No product with id : ${item.product}`);
    }
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    orderItems = [...orderItems, singleOrderItem];
    subtotal += item.amount * price;
  }

  const total = tax + shippingFee + subtotal;

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    user: req.user.userId,
  });

  res.status(StatusCodes.CREATED).json({
    status: "success",
    data: order,
  });
});

// UPDATE ORDER:
const updateOrder = catchAsync(async (req, res, next) => {
  res.send("Update order.");
});

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrder,
  createOrder,
  updateOrder,
};
