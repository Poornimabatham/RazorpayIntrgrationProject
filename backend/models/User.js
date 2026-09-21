const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  membershipType: { type: String, enum: ['silver', 'gold', null], default: null },
}, { timestamps: true });




module.exports = mongoose.model('User', userSchema);
