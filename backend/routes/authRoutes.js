const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const useAuth = require("../middleware/useAuth");
const User = require("../models/User");

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", useAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

module.exports = router;
