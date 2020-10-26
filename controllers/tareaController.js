const Tarea = require('../models/Tareas');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator'); 


//Crea una nueva Tarea
exports.crearTarea = async (req, res) => {
    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    
    try {
        //Extraer el proyecto 
        const { proyecto } = req.body;
        const existeProyecto = await Proyecto.findById(proyecto);
        console.log(existeProyecto)
        // comprobar si existe el proyecto
        if (!existeProyecto) {
            res.status(404).json({ msg: 'Proyecto no encontrado' });
        }
        // revisar que el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(404).json({ msg: 'No autorizado' });
        }

        //Crear la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

// Obtener tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    
    try {
        //Extraer el proyecto 
        const { proyecto } = req.query;
        const existeProyecto = await Proyecto.findById(proyecto);
        // comprobar si existe el proyecto
        if (!existeProyecto) {
            res.status(404).json({ msg: 'Proyecto no encontrado' });
        }
        // revisar que el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(404).json({ msg: 'No autorizado' });
        }

        //Obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({creador: -1});
        res.json({ tareas });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

//Actualizar tarea
exports.actualizarTarea = async (req, res) => {
    try {
        //Extraer el proyecto 
        const { proyecto, nombre, estado } = req.body;
        // comprobar si la tarea existe
        let tareaExiste = await Tarea.findById(req.params.id);
        if (!tareaExiste) {
            res.status(404).json({ msg: 'Tarea no existe' });
        }
        //extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
        console.log(existeProyecto)

        // revisar que el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(404).json({ msg: 'No autorizado' });
        }
        
        //Crear un objeto con la nueva informacion
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //Guardar la tarea
        tarea = await Tarea.findByIdAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });
        res.json({ tarea });


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

//Eliminar tarea
exports.eliminarTarea = async (req, res) => {
    try {
        //Extraer el proyecto 
        const { proyecto } = req.query;
        // comprobar si la tarea existe
        let tareaExiste = await Tarea.findById(req.params.id);
        if (!tareaExiste) {
            res.status(404).json({ msg: 'Tarea no existe' });
        }
        //extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
        console.log(existeProyecto)

        // revisar que el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(404).json({ msg: 'No autorizado' });
        }
        
        // Eliminar tarea
        await Tarea.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Tarea eliminada' });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};