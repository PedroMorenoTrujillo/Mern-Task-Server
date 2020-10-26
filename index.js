const express = require('express');

const conectarDB = require('./config/db');

// Importar CORS
const cors = require('cors');

//crear el servidor
const app = express();

//conectando a db
conectarDB();

//Habilitar cors
app.use(cors());

//Habilitar express.json
app.use(express.json({ extended: true }));

//Puerto de la app
const PORT = process.env.PORT || 4000;

//Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));


//arrancar la app(servidor)
app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
})