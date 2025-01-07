const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

// Cargar variables de entorno
dotenv.config();

// Inicializar la aplicación express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch((err) => console.error('No se pudo conectar a MongoDB', err));

// Rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const affiliateRoutes = require('./routes/affiliate');
const cycleRoutes = require('./routes/cycle');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/affiliate', affiliateRoutes);
app.use('/api/cycle', cycleRoutes);
app.use('/api/admin', adminRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

// Ruta raíz
app.get('/', (req, res) => {
  res.send('La API de ELAD SAS está funcionando');
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

// Cierre gracioso
process.on('SIGTERM', () => {
  console.log('Señal SIGTERM recibida: cerrando el servidor HTTP')
  app.close(() => {
    console.log('Servidor HTTP cerrado')
    mongoose.connection.close(false, () => {
      console.log('Conexión de MongoDB cerrada');
      process.exit(0);
    });
  });
});

