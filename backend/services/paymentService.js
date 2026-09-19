const Razorpay = require('razorpay');
const Order = require('../models/Order');

const PLANS = {
  silver: { amount: 49900, label: 'Silver Membership' },  // amount in paise (499 INR)
  gold:   { amount: 99900, label: 'Gold Membership' },    // amount in paise (999 INR)
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (userId, plan) => {
  const selectedPlan = PLANS[plan];
  if (!selectedPlan) throw new Error('Invalid plan selected');

  const receipt = `receipt_${userId}_${Date.now()}`;

  const razorpayOrder = await razorpay.orders.create({
    amount: selectedPlan.amount,
    currency: 'INR',
    receipt,
    notes: {
      userId: userId.toString(),
      plan,
    },
  });

  const order = await Order.create({
    userId,
    razorpayOrderId: razorpayOrder.id,
    plan,
    amount: selectedPlan.amount,
    receipt,
  });

  return {
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    plan,
    receipt,
    key: process.env.RAZORPAY_KEY_ID,
  };
};

module.exports = { createOrder };
