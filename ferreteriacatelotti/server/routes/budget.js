import express from 'express';
import { purchaseOrderModel} from '../models/purchaseorder-model.js';

export const budgetRouter = express.Router();
const orderrModel = new purchaseOrderModel();


budgetRouter.get('/', async (req, res) => {
    try {
        const orders = await new purchaseOrderModel().getAll();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error al obtener todos los pedidos:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

budgetRouter.post('/nuevalinea', async (req, res) => {
    try {
        // Obtiene los datos del cuerpo de la solicitud
        const { fecha, proveedor, producto, cantidad, precioUnitario, unidad } = req.body;

        // Crea un nuevo objeto con los datos recibidos
        const orderData = {
            articulo: producto,
            cantidad: Number(cantidad),
            precioUnitario: Number(precioUnitario),
            unidad,
            fecha: new Date(fecha),
            subtotal: precioUnitario * cantidad,
            proveedor,
        };

        console.log(`Recibido de front : ${JSON.stringify(orderData)}`);

        // Utiliza el modelo para guardar los datos en la base de datos
        const newOrder = await orderrModel.createOrder(orderData);

        //Envía una respuesta al cliente

     
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
