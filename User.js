const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  membership: {
    type: String,
    enum: ['Kit Registro', 'Pre Junior', 'Junior', 'Master', 'Águila Dorada'],
    default: 'Kit Registro'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  points: {
    type: Number,
    default: 0
  },
  earnings: {
    type: Number,
    default: 0
  },
  currentCycle: {
    type: Number,
    default: 1
  },
  cycleProgress: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

