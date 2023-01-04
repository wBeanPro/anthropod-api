const router = require("express").Router();
const stripeController = require("../controllers/stripe.js");

router.get("/create", stripeController.create_payment);

module.exports = router;
