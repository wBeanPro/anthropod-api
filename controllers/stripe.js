const Stripe = require("stripe");
const stripeAPIKey =
  "sk_test_51Lucw8I9rxkJyrxmw5SMD1sqdKITAPS3usQ6hn18kDGA5Ii3ywZ7DdANu7VINhjv2sGSdjLG3MgWjImzCtxdwqht00RGxTLoxu";
require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.create_payment = async (req, res, next) => {
  const { amount, name } = req.body;
  console.log(amount);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      receipt_email: "topstardev.703@gmail.com",
      description: `Customer named ${name}`,
      // automatic_payment_methods: {
      //   enabled: true,
      // },
    });

    return res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err });
  }
};
