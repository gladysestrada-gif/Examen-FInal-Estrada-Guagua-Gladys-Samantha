const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


dotenv.config();


connectDB();

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/services', require('./routes/serviceRoutes'));


app.get('/', (req, res) => {
    res.json({
        message: 'API de Samanistra S.A. - Gestión de Servicios',
        version: '1.0.0',
        endpoints: {
            services: '/api/services'
        }
    });
});


app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});