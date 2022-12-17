const router = require("express").Router();
const auth = require("../middleware/auth.js");
const User_Controller = require("../controllers/user.js");
const { UploadImage } = require("../middleware/file_middleware.js");

router.get("/:userId", auth.verifyToken, User_Controller.getUser);

router.put(
  "/:id/edit",
  [auth.verifyToken, UploadImage.single("avatar")],
  User_Controller.updateUser
);

module.exports = router;
