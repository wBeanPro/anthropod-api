const router = require("express").Router();
const auth = require("../middleware/auth.js");
const User_Controller = require("../controllers/user.js");
const Purchase_Controller = require("../controllers/purchaseAd");
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

router.post(
  "/decrease-withdrawbalance",
  [auth.verifyToken],
  User_Controller.decreaseWithdrawBalance
);

router.post(
  "/increase-withdrawbalance",
  [auth.verifyToken],
  User_Controller.increaseWithdrawBalance
);

router.get(
  "/purchase/all",
  [auth.verifyToken],
  Purchase_Controller.GET_ALL_PURCHASE
);

router.get(
  "/insert/purchase",
  [auth.verifyToken],
  Purchase_Controller.CREATE_PURCHASE
);

router.get("/user/get-history", [auth.verifyToken], User_Controller.getHistory);

router.put(
  "/:id/edit",
  [auth.verifyToken, UploadImage.single("avatar")],
  User_Controller.updateUser
);

module.exports = router;
