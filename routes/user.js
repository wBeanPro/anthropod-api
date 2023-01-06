const router = require("express").Router();
const auth = require("../middleware/auth.js");
const User_Controller = require("../controllers/user.js");
const { UploadImage } = require("../middleware/file_middleware.js");

router.get("/:userId", auth.verifyToken, User_Controller.getUser);

router.post(
  "/disclaimed",
  [auth.verifyToken],
  User_Controller.updateDisclaimed
);

router.post(
  "/reset_password",
  [auth.verifyToken],
  User_Controller.resetPassword
);

router.post(
  "/decrease-balance",
  [auth.verifyToken],
  User_Controller.decreaseBalance
);

router.post(
  "/increase-balance",
  [auth.verifyToken],
  User_Controller.increaseBalance
);

router.put(
  "/:id/edit",
  [auth.verifyToken, UploadImage.single("avatar")],
  User_Controller.updateUser
);

module.exports = router;
