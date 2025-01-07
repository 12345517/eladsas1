const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Middleware para verificar si el usuario es administrador
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Acceso denegado. Se requieren privilegios de administrador.' });
    }
    next();
  } catch (err) {
    res.status(500).send('Error del servidor');
  }
};

// Obtener todos los usuarios pendientes de aprobación
router.get('/pending-users', auth, isAdmin, async (req, res) => {
  try {
    const pendingUsers = await User.find({ isApproved: false }).select('-password');
    res.json(pendingUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Obtener todos los usuarios
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Aprobar un usuario
router.put('/approve-user/:userId', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { isApproved: true }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});


// Obtener estadísticas generales
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const approvedUsers = await User.countDocuments({ isApproved: true });
    const pendingUsers = await User.countDocuments({ isApproved: false });
    const totalEarnings = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$earnings" } } }
    ]);

    res.json({
      totalUsers,
      approvedUsers,
      pendingUsers,
      totalEarnings: totalEarnings[0]?.total || 0
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;

