const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Obtener información del ciclo actual
router.get('/current', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('currentCycle cycleProgress');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Avanzar en el ciclo
router.post('/advance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.cycleProgress += 1;

    if (user.cycleProgress >= 10) {  // Asumiendo que cada ciclo requiere 10 puntos
      user.currentCycle += 1;
      user.cycleProgress = 0;
      user.points += 100;  // Bonificación por completar un ciclo
    }

    await user.save();

    res.json({
      currentCycle: user.currentCycle,
      cycleProgress: user.cycleProgress,
      points: user.points
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;

