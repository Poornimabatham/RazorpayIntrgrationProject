const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const useAuth = require('../middleware/useAuth');

router.post('/signup', signup);
router.post('/login', login);

// Protected route example
router.get('/me', useAuth, (req, res) => {
  res.json({ message: 'Protected route accessed', user: req.user });
});

module.exports = router;
