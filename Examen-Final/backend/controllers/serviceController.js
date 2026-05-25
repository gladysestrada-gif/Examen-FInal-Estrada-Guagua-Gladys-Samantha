const Service = require('../models/Service');

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener servicios',
            error: error.message
        });
    }
};

exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            data: service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el servicio',
            error: error.message
        });
    }
};


exports.createService = async (req, res) => {
    try {
        const service = await Service.create(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Servicio creado exitosamente',
            data: service
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear el servicio',
            error: error.message
        });
    }
};


exports.updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Servicio actualizado exitosamente',
            data: service
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar el servicio',
            error: error.message
        });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Servicio eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el servicio',
            error: error.message
        });
    }
};