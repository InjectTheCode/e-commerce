const router = require("express").Router();
const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");
const { authenticateUser, authorizePermission } = require("../middleware/authentication");

router.route("/").post(authenticateUser, createReview).get(getAllReviews);

router
  .route("/:id")
  .get(getSingleReview)
  .patch(authenticateUser, authorizePermission("admin"), updateReview)
  .delete(authenticateUser, authorizePermission("admin"), deleteReview);

module.exports = router;
