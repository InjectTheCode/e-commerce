const router = require("express").Router();
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/product.controller");
const { authenticateUser, authorizePermission } = require("../middleware/authentication");

router
  .route("/")
  .post([authenticateUser, authorizePermission("admin")], createProduct)
  .get(getAllProducts);

router
  .route("/upload-image")
  .post([authenticateUser, authorizePermission("admin")], uploadImage);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermission("admin")], updateProduct)
  .patch([authenticateUser, authorizePermission("admin")], deleteProduct);

module.exports = router;
