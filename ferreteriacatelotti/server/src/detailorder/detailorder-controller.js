import { DetailOrderService } from "./detailorder-service.js";

const detailOrderService = new DetailOrderService();

export class DetailOrderController {

    async createDetailOrder(req, res) {
        const { detailOrderProduct, detailOrderUnitCost, detailOrderQuantity, productID } = req.body;

        try {
            const newDetailOrder = {
                detailOrderProduct,
                detailOrderQuantity,
                detailOrderUnitCost,
                productID
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

    async createEditDetailOrderLine(req, res) {
        const { detailOrderProduct, detailOrderUnitCost, detailOrderQuantity, productID, purchaseOrderID } = req.body;

        try {
            const newDetailOrder = {
                detailOrderProduct,
                detailOrderQuantity,
                detailOrderUnitCost,
                productID,
                purchaseOrderID
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
            res.status(200).json({ data: detailOrders });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener los detalles de los pedidos" });
        }
    }

    async getDetailOrderById(req, res) {
        try {
            const { rowid } = req.params;
            const detailOrder = await detailOrderService.getDetailOrderById(rowid);

            if (detailOrder) {
                res.status(200).json({ detailOrder });
            } else {
                res.status(404).json({ message: "Detalle no encontrado" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener los detalles de los pedidos" });
        }
    }

    async updateDetailOrderLine(req, res) {
        try {
            const { rowid } = req.params;
            const { detailOrderProduct, detailOrderUnitCost, detailOrderQuantity, productID, purchaseOrderID } = req.body;

            console.log("Row id: ", rowid);
            
            const existingDetailOrder = await detailOrderService.getDetailOrderById(rowid);

            if (!existingDetailOrder) {
                throw new Error("Detalle no encontrado");
            }

            const updateData = {
                detailOrderProduct,
                detailOrderUnitCost,
                detailOrderQuantity,
                productID,
                purchaseOrderID
            }

            const updateDetailOrder = await detailOrderService.updateDetailOrderLine(rowid, updateData);

            if (updateDetailOrder) {
                res.status(200).json({
                    message: "Linea de detalle actualizada con éxito",
                    updatedOrder: updateDetailOrder
                });
            } else {
                res.status(404).json({ message: "Linea de detalle actualizada con exito" });

            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }


    }
}