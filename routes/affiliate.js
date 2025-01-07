const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Obtener red de afiliados
router.get('/network', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Obtener referidos directos
    const directReferrals = await User.find({ referredBy: user._id })
      .select('name email membership points');

    // Obtener referidos de segundo nivel
    const secondLevelReferrals = await User.find({
      referredBy: { $in: directReferrals.map(ref => ref._id) }
    }).select('name email membership points referredBy');

    res.json({
      user: {
        name: user.name,
        email: user.email,
        membership: user.membership,
        points: user.points
      },
      directReferrals,
      secondLevelReferrals
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Obtener código de referido
router.get('/referral-code', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('referralCode');
    res.json({ referralCode: user.referralCode });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;

