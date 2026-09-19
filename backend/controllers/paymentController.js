const paymentService = require('../services/paymentService');

const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    if (!plan) return res.status(400).json({ message: 'Plan is required' });

    const order = await paymentService.createOrder(req.user.id, plan);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { createOrder };
