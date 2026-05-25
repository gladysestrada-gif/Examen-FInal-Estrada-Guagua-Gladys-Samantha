const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del servicio es obligatorio'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        enum: ['INGENIERÍA CIVIL', 'INGENIERÍA MECÁNICA', 'INGENIERÍA INDUSTRIAL', 
               'MANTENIMIENTO ELÉCTRICO', 'AIRES ACONDICIONADO', 'PINTURA', 
               'TELECOMUNICACIONES', 'FUMIGACIÓN', 'CERRAGERÍA', 
               'CONSTRUCCIÓN METÁLICA']
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    duration: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['activo', 'inactivo'],
        default: 'activo'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);