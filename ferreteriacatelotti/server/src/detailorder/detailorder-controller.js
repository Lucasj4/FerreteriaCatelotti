import { DetailOrderService } from "./detailorder-service.js";

const detailOrderService = new DetailOrderService();

export class DetailOrderController {

    async createDetailOrder(req, res) {
        const { item, unitCost, quantity } = req.body;

        try {
            const newDetailOrder = {
                item,
                unitCost,
                quantity
            }
            const createdDetailOrder = await detailOrderService.createDetailOrder(newDetailOrder);

            // Enviar respuesta con el ID del nuevo detalle
            res.status(201).json({
                message: "Línea de detalle agregada con éxito",
                detail: {
                    _id: createdDetailOrder._id, // Aquí asumo que el ID está almacenado en la propiedad _id
                    item: createdDetailOrder.item,
                    unitCost: createdDetailOrder.unitCost,
                    quantity: createdDetailOrder.quantity
                }
            });
        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    async getDetailOrders(req, res) {
        try {
            const detailOrders = await detailOrderService.getDetailsOrdes();
            res.status(200).json(detailOrders);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener los detalles de los pedidos" });
        }
    }
}