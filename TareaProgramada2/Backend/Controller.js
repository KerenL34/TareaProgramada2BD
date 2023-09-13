// Importar el módulo de conexión desde la carpeta ../Prueba de Concepto
const conn = require('../Prueba de Concepto/Connection')

/*
Funcion para llamar sp que muestra los articulos
*/
const select = async (req, res) => {
    try {
        // Obtener una conexión desde el módulo de conexión
        const pool = await conn.obtenerConexión();

        // Ejecutar un procedimiento almacenado llamado MostrarArticulosOrdenados
        const result = await pool.request()
            .output('outResultCode', 0)
            .execute('MostrarArticulosOrdenados');

        // Enviar la lista de artículos como respuesta en formato JSON
        res.json(result.recordset);
    } catch (error) {
        // Manejo de errores en caso de problemas durante la conexión o ejecución
        console.error('Error:', error.message);
        res.status(500).send('Error en el servidor');
    }
};

/*
Funcion para llamar sp que inserta en la tabla Articulo
*/
const insert = async (req, res) => {
    try {
        // Conexión a la base de datos usando el pool de conexiones
        const pool = await conn.obtenerConexión();

        // Ejecución del procedimiento almacenado para insertar un artículo
        const result = await pool.request()
            .input('inNombre', req.body.inNombre)
            .input('inPrecio', req.body.inPrecio)
            .output('outResultCode', 0)
            .execute('InsertarArticulo');
            
        // Verificación del resultado de la inserción y envío de la respuesta correspondiente
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
        // Manejo de errores y envío de respuesta en caso de error
        res.status(500).json({
            access: "Error en la inserción",
            message: "Ha ocurrido un error durante la inserción"
        });
    }
};

exports.insert = insert;
exports.select = select;