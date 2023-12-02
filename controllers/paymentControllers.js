const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// This example sets up an endpoint using the Express framework.

const handleIntent = async (req, res) => {
    try {

      // Use an existing Customer ID if this is a returning customer.
      // const customer = await stripe.customers.create();
      // const ephemeralKey = await stripe.ephemeralKeys.create(
      //   {customer: customer.id},
      //   {apiVersion: '2023-10-16'}
      // );
      const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'INR',
        // customer: customer.id,
        description: 'Payment for study material or quiz',
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // returning secret 
      res.json({
        paymentIntent: paymentIntent.client_secret,
        // ephemeralKey: ephemeralKey.secret,
        // customer: customer.id,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
      });
    } catch (error) {
      console.log(error)
      res.status(400).json({error: error.message})
    }
};

module.exports = { handleIntent }