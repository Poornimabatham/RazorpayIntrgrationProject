const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/paymentController');
const useAuth = require('../middleware/useAuth');
const Order = require('../models/Order');
const User = require('../models/User');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');

router.post('/create-order', useAuth, createOrder);

router.post('/Paymentwebhook', async (req, res) => {
  try {
    console.log('Webhook received');

    const webhookSignature = req.get('X-Razorpay-Signature');
    const rawBody = req.body.toString('utf8');

    const isWebhookValid = validateWebhookSignature(
      rawBody,
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      return res.status(400).json({ message: 'Invalid Signature' });
    }

    const parsedBody = JSON.parse(rawBody);
    const paymentDetails = parsedBody.payload.payment.entity;

    const order = await Order.findOne({ razorpayOrderId: paymentDetails.order_id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = 'paid';
    await order.save();

    const user = await User.findById(order.userId);
    if (user) {
      user.isPremium = true;
      user.membershipType = order.plan;
      await user.save();
    }

    return res.status(200).json({ message: 'Webhook received successfully' });
  } catch (error) {
    console.log('Webhook error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
