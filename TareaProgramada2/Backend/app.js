// Importación de módulos
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const conn = require('../Prueba de Concepto/Connection.js'); // Importar el módulo de conexión

// Crear instancia de la aplicación Express
const app = express();
const port = 8080; // Puerto en el que se escucharán las solicitudes

// Configuraciones de middleware
app.use(cors()); // Habilitar CORS para permitir solicitudes de diferentes dominios
app.use(morgan('dev')); // Registro de solicitudes en la consola en formato 'dev'
app.use(bodyParser.urlencoded({ extended: false })); // Analizar datos URL-encoded en las solicitudes
app.use(express.json()); // Analizar datos JSON en las solicitudes

// Enrutador
const router = express.Router(); // Crear un enrutador Express

// Llamadas a funciones

/**
 * Función para obtener y mostrar los artículos mediante un procedimiento almacenado.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
async function select(req, res) {
    try {
        const pool = await conn.getConnection(); // Obtener conexión desde el módulo de conexión
        const result = await pool.request()
            .output('outResultCode', 0)
            .execute('MostrarArticulosOrdenados'); // Ejecutar el procedimiento almacenado
        res.json(result.recordset); // Enviar la lista de artículos como respuesta en formato JSON
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error en el servidor');
    }
}

/**
 * Función para insertar un artículo en la tabla mediante un procedimiento almacenado.
 * @param {Object} req - Objeto de solicitud HTTP con los datos del artículo a insertar.
 * @param {Object} res - Objeto de respuesta HTTP.
 */




async function insert(req, res) {
    
    try {
        
        const pool = await conn.getConnection(); // Obtener conexión desde el módulo de conexión
        console.log(req)
        const result = await pool.request()
            .input('inNombre', req.body.inNombre)
            .input('inPrecio', req.body.inPrecio)
            .output('outResultCode', 0)
            .execute('InsertarArticulo'); // Ejecutar el procedimiento almacenado para insertar
        // Verificar el resultado de la inserción y enviar la respuesta correspondiente
        console.log(req)
        if (result.output.outResultCode == 0) {
            res.json({
                access: "Inserción exitosa",
                message: "La inserción se ha realizado con éxito"
            });
        } else {
            res.json({
                access: "Error en la inserción",
                message: "La inserción no se ha realizado. Nombre de artículo existente"
            });
        }
    } catch (error) {
        res.status(500).json({
            access: "Error en la inserción",
            message: "Ha ocurrido un error durante la inserción"
        });
        console.log(req.body)
    }
}





// Configurar las rutas utilizando las funciones correspondientes
router.get('/select', select); // Ruta para obtener artículos
router.post('/insert', insert); // Ruta para insertar artículos

app.use('/', router); // Asociar el enrutador a la ruta raíz



// Iniciar el servidor
app.listen(port, () => {
console.log("Servidor en línea en el puerto:", port);
});


