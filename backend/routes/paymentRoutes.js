const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/paymentController');
const useAuth = require('../middleware/useAuth');

// Protected - user must be logged in to create order
router.post('/create-order', useAuth, createOrder);

module.exports = router;
