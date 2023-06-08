const router = require("express").Router();
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/user.controller");
const { authenticateUser, authorizePermission } = require("../middleware/authentication");

router
  .route("/")
  .get(authenticateUser, authorizePermission("admin", "owner"), getAllUsers);
router.route("/show-me").get(authenticateUser, showCurrentUser);

router.route("/update-user").patch(authenticateUser, updateUser);
router.route("/update-user-password").patch(authenticateUser, updateUserPassword);

router.route("/:id").get(getSingleUser);

module.exports = router;
