const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/paymentController');
const useAuth = require('../middleware/useAuth');
const user = require("../models/User");

const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');

// Protected - user must be logged in to create order
router.post("/create-order", useAuth, createOrder);
router.post("/Paymentwebhook", async (req, res) => {
    try {
    const webhookSignature = req.get['X-razorpay-signature'];
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );
        
       if (!isWebhookValid){
            return  res.status(400).json("Invalid Signature ")
        };
        
            //update my payment status to DB
            //UPDATE the user as premium
        const paymentDetails = req.body.payload.payment.entity
        const payment = await Order.findOne({ razorpayOrderId: paymentDetails.order_id });  
        payment.status = paymentDetails.status;

        await payment.save()

        const user = await user.findOne({ _id: payment.userId });
        user.isPremium = true
        user.membershiptType = paymentDetails.notes.membershitType
            //return success response to razorpay
        

        return res.status(200).json({ message: 'Webhook received successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    });
https: module.exports = router;
