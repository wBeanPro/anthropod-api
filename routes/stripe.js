const router = require("express").Router();
const stripeController = require("../controllers/stripe.js");

router.post("/create", stripeController.create_payment);

module.exports = router;
