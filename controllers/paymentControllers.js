const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// This example sets up an endpoint using the Express framework.
const PaidMaterial = require('../models/PaidMaterial')
const PaidQuiz = require('../models/PaidQuiz');
const Quiz = require('../models/Quiz');
const StudyMaterial = require('../models/StudyMaterial');
const User = require('../models/User');

//-------------- payment intent api ------------------
const handleIntent = async (req, res) => {
  try {
    const { amount, userId, materialId } = req.body;
    // console.log(req.body)
    // Use an existing Customer ID if this is a returning customer.
    // const customer = await stripe.customers.create();
    // const ephemeralKey = await stripe.ephemeralKeys.create(
    //   {customer: customer.id},
    //   {apiVersion: '2023-10-16'}
    // );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, //int in paise
      currency: 'INR',
      // customer: customer.id,
      description: 'Payment for study material or quiz',
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: { userId, materialId }
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
    res.status(400).json({ error: error.message })
  }
};



//--------------- add paidMaterial webhook ------------------------
const addPaidMaterial = async (req, res) => {
  try {
    console.log("api running...")
    // Authentication
    // This is your Stripe CLI webhook secret for testing your endpoint locally.
    const endpointSecret = "whsec_808gN8gl7EvW3YquiQg8f4ttY4PsDotO";

    const sig = req.headers['stripe-signature'];
    // console.log(sig)
    // console.log(req.body)

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    console.log("event = ", event);

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Access metadata from paymentIntent
        const metadata = paymentIntent.metadata;

        // Your logic to save the order using metadata
        // console.log(paymentIntent);
        const userId = metadata.userId;
        const materialId = metadata.materialId;

        // Check if the user and material exist 
        const userExists = await User.exists({ _id: userId });
        const materialExists = await StudyMaterial.exists({ _id: materialId });
        const quizExists = await Quiz.exists({ _id: materialId });

        if (!userExists || !(quizExists || materialExists)) {
          return res.status(404).json({ error: 'User or material not found.' });
        }

        let newPaidMaterial;
        if (materialExists) {
          const paidMaterialObj = {
            user: userId,
            material: materialId,
          }
          const materialBookmarkId = await PaidMaterial.exists(paidMaterialObj)
          // delete if bookmark exists
          if (materialBookmarkId) {
            // await MaterialBookmark.findByIdAndRemove(materialBookmarkId);
            return res.status(200).json({ message: 'You have already purchased this study material!' });
          }
          // Create a new bookmark instance
          newPaidMaterial = new PaidMaterial(paidMaterialObj);
        }
        if (quizExists) {
          const paidMaterialObj = {
            user: userId,
            quiz: materialId,
          }
          const quizBookmarkId = await PaidQuiz.exists(paidMaterialObj)
          // delete if bookmark exists
          if (quizBookmarkId) {
            // await QuizBookmark.findByIdAndRemove(quizBookmarkId);
            return res.status(200).json({ message: 'You have already purchased this test series!' });
          }
          // Create a new bookmark instance
          newPaidMaterial = new PaidQuiz(paidMaterialObj);
        }

        // Save the bookmark to the database
        await newPaidMaterial.save();

        return res.status(201).json({msg:"Success!"});

      default:
        // Unexpected event type
        return res.status(400).end();
    }


  } catch (error) {
    console.error('Error buying material:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = { handleIntent, addPaidMaterial }