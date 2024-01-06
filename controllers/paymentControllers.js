const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Razorpay = require('razorpay');
// This example sets up an endpoint using the Express framework.
const PaidMaterial = require('../models/PaidMaterial')
const PaidQuiz = require('../models/PaidQuiz');
const Quiz = require('../models/Quiz');
const StudyMaterial = require('../models/StudyMaterial');
const User = require('../models/User');

// helper function after successful payment
const addPaidMaterial = async (userId, materialId) => {
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
      return res.status(200).json({ message: 'You have already purchased this study material!' });
    }
    // Create a new paidMaterial instance
    newPaidMaterial = new PaidMaterial(paidMaterialObj);
  }
  if (quizExists) {
    const paidMaterialObj = {
      user: userId,
      quiz: materialId,
    }
    const quizBookmarkId = await PaidQuiz.exists(paidMaterialObj)
    if (quizBookmarkId) {
      return res.status(200).json({ message: 'You have already purchased this test series!' });
    }
    // Create a new bookmark instance
    newPaidMaterial = new PaidQuiz(paidMaterialObj);
  }

  // Save the bookmark to the database
  await newPaidMaterial.save();
}

// order api
const createOrder = async (req, res) => {
  try {
    const { amount, userId, materialId } = req.body;
    const Razorpay = require('razorpay');
    var instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })

    var options = {
      amount: amount,  // amount in the smallest currency unit
      currency: "INR",
      notes: { userId, materialId }
    };
    instance.orders.create(options, function (err, order) {
      if (!err)
        res.json({ order })
      else
        res.json({ err })
    });
  } catch (error) {
    console.error('Error buying material:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const verifyPayment = async (req, res) => {
  try {
    //verification here
    const crypto = require('crypto')
    const shasum = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET)
    shasum.update(JSON.stringify(req.body))
    const digest = shasum.digest('hex')

    if (digest === req.headers['x-razorpay-signature']) {
      // db changes here
      const metadata = req.body?.payload?.payment?.entity?.notes;

      //adding paid material
      addPaidMaterial(metadata?.userId, metadata?.materialId)
      res.json({ status: 'ok' })
    }
    else {
      res.status(500).json({ status: 'failed' })
    }
  } catch (error) {
    console.error('Error buying material:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = { addPaidMaterial, createOrder, verifyPayment }