const Stripe = require("stripe");
const stripeAPIKey = "";

const stripe = Stripe(stripeAPIKey);

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
