import { BudgetService } from "./budget-service.js";
import BudgetDetaiLModel from '../budgetdetail/budgetdetail-model.js'
import { ProductService } from "../products/product-service.js";
import { BudgetDetaiLService } from '../budgetdetail/budgetdetail-service.js'
import { generateInvoiceNumber } from '../utils/geneteinvoicenumber.js'
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const productService = new ProductService();
const budgetService = new BudgetService();
const budgetDetailService = new BudgetDetaiLService();

export class BudgetController {

    async addBudget(req, res) {
        const { clientId, budgetDate, budgetAmount, budgetStatus, detailIds } = req.body;


        if (!req.user || !req.user.user || !req.user.user._id) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const userId = req.user.user._id;

        try {

            const currentDate = new Date();
            const inputDate = new Date(budgetDate);


            if (inputDate.setUTCHours(0, 0, 0, 0) < currentDate.setUTCHours(0, 0, 0, 0)) {
                return res.status(400).json({
                    error: "La fecha del presupuesto no puede ser anterior al día de hoy."
                });
            };

            const newBudget = {
                userId,
                clientId,
                budgetDate,
                budgetAmount,
                budgetStatus
            }

            const budget = await budgetService.createBudget(newBudget);

            if (detailIds.length > 0) {
                await BudgetDetaiLModel.updateMany(
                    { _id: { $in: detailIds } }, // Filtrar los detalles a actualizar
                    { $set: { budgetID: budget._id } } // Agregar el ID del presupuesto
                );
            }

            return res.status(201).json({ message: "Presupuesto creado", budget });
        } catch (error) {
            req.logger.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async getBudgets(req, res) {
        try {
            const budgets = await budgetService.getBudgets();

            if (budgets) {

                const formattedBudgets = budgets.map(budget => {


                    const date = budget.budgetDate
                        ? new Date(budget.budgetDate).toLocaleDateString('es-ES', { timeZone: 'UTC' })
                        : null;
                    return {
                        ...budget._doc,
                        budgetDate: date,
                        clientId: budget.clientId ? budget.clientId.clientLastName : null
                    };
                });


                return res.status(200).json({ message: "Presupuestos", budgets: formattedBudgets })
            } else {
                return res.status(404).json({ message: "Presupuestos no encontrados" })
            }
        } catch (error) {
            req.logger.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async searchBudgets(req, res) {
        try {
            const { clientId, budgetStatus, startDate, endDate } = req.query;

            req.logger.info("Client id: " + clientId);
            req.logger.info("Status: " + budgetStatus);
            req.logger.info("fecha inicio: ", startDate);
            const budgets = await budgetService.searchBudgets(clientId, budgetStatus, startDate, endDate);

            req.logger.info("budgets filtrados: ", budgets);

            if (budgets.length === 0) {
                return res.status(404).json({ message: "No se encuentran presupuestos con los datos establecidos" })
            }

            const formattedBudgets = budgets.map(budget => {


                const date = budget.budgetDate
                    ? new Date(budget.budgetDate).toLocaleDateString('es-ES', { timeZone: 'UTC' })
                    : null;
                return {
                    ...budget._doc,
                    budgetDate: date,
                    clientId: budget.clientId ? budget.clientId.clientLastName : null
                };
            });

            req.logger.info("formateed: ", formattedBudgets);



            res.status(200).json({ budgets: formattedBudgets });

        } catch (error) {
            console.error("Error al buscar presupuestos", error);
            res.status(500).json({ error: "Error en el servidor" });
        }
    }


    async deleteById(req, res) {
        try {
            const { id } = req.params;
            const result = await budgetService.deleteById(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async getBudgetWithDetail(req, res) {
        const { pid } = req.params;

        try {
            const data = await budgetService.getBudgetWithDetail(pid);

            if (data.error) {
                return res.status(404).json({ message: data.error });
            }

            const formattedBudget = {
                ...data.budget._doc, // Mantener los demás campos
                budgetDate: data.budget.budgetDate
                    ? new Date(data.budget.budgetDate).toLocaleDateString('es-ES', { timeZone: 'UTC' })
                    : null // Formato español día/mes/año
            };

            console.log(data.budget);

            res.status(200).json({
                budget: formattedBudget,
                budgetDetailOrders: data.budgetDetails
            });
        } catch (error) {
            console.error("Backend Error:", error);
            res.status(500).json({ error: "Error al obtener el presupuesto con detalles" });
        }
    }

    async updateBudget(req, res) {
        const { budgetAmount, budgetDate, budgetStatus, clientId } = req.body;
        const { pid } = req.params;

        req.logger.info("Id budget: " + pid);
        req.logger.info("Desde controlador actualizar presupuesto");


        const updateBudget = {
            budgetAmount,
            budgetDate,
            budgetStatus,
            clientId
        }

        req.logger.info("update budget: " + updateBudget);

        try {
            if (!updateBudget || !pid) {
                return res.status(400).json({ message: "Datos insuficientes para actualizar el presupuesto." });
            }

            const existingBudget = await budgetService.getBudgetById(pid);
            const createdAt = new Date(existingBudget.budgetDate); // Convertimos a objeto Date
            const now = new Date();
            const timeDiff = now - createdAt; // Diferencia en milisegundos

            const hoursPassed = timeDiff / (1000 * 60 * 60); // Convertimos a horas
           
            
            req.logger.info("Horas desde que se facturo: " + hoursPassed);

            if (hoursPassed > 24) {
                return res.status(403).json({ message: "No puedes modificar este presupuesto después de 24 horas." });
            }

            const budget = await budgetService.updateBudget(updateBudget, pid);


            if (budget) {
                res.status(200).json({ message: "Presupeusto actualizado con exito", budget })
            } else {
                res.status(404).json({ message: "Presupuesto no encontrado." });
            }
        } catch (error) {
            console.error("Error actualizando el presupuesto:", error);
            res.status(500).json({ message: "Error en el servidor al actualizar el presupuesto." });
        }
    }

    async updateBudgetStatusAndAmount(req, res) {
        const { budgetStatus, budgetAmount } = req.body;
        const { pid } = req.params;

        req.logger.info("Id budget: " + pid);
        req.logger.info("BudgetAmount: " + budgetAmount);

        const updateBudget = {
            budgetStatus,
            budgetAmount
        }

        try {
            if (!budgetStatus || !pid) {
                return res.status(400).json({ message: "Datos insuficientes para actualizar el presupuesto." });
            }

            // const existingBudget = await budgetService.getBudgetById(pid);
            // const createdAt = new Date(existingBudget.budgetDate); // Convertimos a objeto Date
            // const now = new Date();
            // const timeDiff = now - createdAt; // Diferencia en milisegundos

            // const hoursPassed = timeDiff / (1000 * 60 * 60); // Convertimos a horas

            
            // if (hoursPassed > 24) {
            //     return res.status(403).json({ message: "No puedes modificar este presupuesto después de 24 horas." });
            // }
            
            // req.logger.info("Horas desde que se facturo: ", hoursPassed);

            const budget = await budgetService.updateBudgetStatusAndBudgetAmount(updateBudget, pid);

            req.logger.info("Presupuesto actualizado: " + budget)
            if (budget) {
                res.status(200).json({ message: "Presupeusto actualizado con exito", budget })
            } else {
                res.status(404).json({ message: "Presupuesto no encontrado." });
            }
        } catch (error) {
            console.error("Error actualizando el presupuesto:", error);
            res.status(500).json({ message: "Error en el servidor al actualizar el presupuesto." });
        }


    }

    async deleteBudget(req, res) {
        const { idBudget } = req.params;

        req.logger.info('Id budget: ' + idBudget)

        try {
            req.logger.info("Desde controllador deleteBudget")
            const deletedDetails = await BudgetDetaiLModel.deleteMany({ budgetID: idBudget });
            console.log(`Detalles eliminados: `, deletedDetails);
            // Intentar eliminar el presupuesto
            const deletedBudget = await budgetService.deleteBudget(idBudget);

            // Verificar si el presupuesto fue encontrado y eliminado
            if (deletedBudget) {
                res.status(200).json({ message: "Presupuesto eliminado con éxito" });
            } else {
                res.status(404).json({ message: "Presupuesto no encontrado" });
            }
        } catch (error) {
            console.error("Error al eliminar el presupuesto:", error);
            res.status(500).json({ message: "Error en el servidor al eliminar el presupuesto" });
        }
    }

    async getBudgetById(req, res) {
        const { budgetId } = req.params;

        try {
            const budget = await budgetService.getBudgetById(budgetId);



            if (budget) {
                // Formatear los campos
                const formattedBudget = {
                    ...budget._doc, // Si usas Mongoose, `_doc` contiene los datos del objeto
                    budgetDate: budget.budgetDate
                        ? new Date(budget.budgetDate).toLocaleDateString('es-ES', { timeZone: 'UTC' })
                        : null,
                    clientId: budget.clientId?.clientLastName || null, // Si `clientId` es un objeto poblado
                };

                res.status(200).json({
                    message: "Presupuesto encontrado con éxito",
                    budget: formattedBudget,
                });
            } else {
                res.status(404).json({ message: "Presupuesto no encontrado" });
            }
        } catch (error) {
            console.error("Error al encontrar presupuesto:", error);
            res.status(500).json({ message: "Error en el servidor al encontrar presupuesto con id el presupuesto" });
        }
    }

    async createFactura(req, res) {
        const { saleTotalAmount, saleDate, client, details } = req.body;

        const invoiceNumber = generateInvoiceNumber();

        if (!client || !saleTotalAmount || !saleDate || !invoiceNumber) {
            return res.status(400).json({ error: "Faltan datos necesarios" });
        }

        try {
            const doc = new PDFDocument();

            // Cabecera del PDF
            doc.fontSize(14).text(`Factura de venta No. ${invoiceNumber}`, { align: 'right' });

            // Separar un poco más la fecha y el cliente
            doc.fontSize(14).text(`Fecha: ${fecha}`, { align: 'left' }).moveDown(0.5);
            doc.text(`Cliente: ${cliente}`, { align: 'left' }).moveDown(0.5);

            // Ajustar un poco más la separación entre "Total" y las demás líneas
            doc.text(`Total: $${total}`, { align: 'left' }).moveDown(1.5);

            // Espacio para separar de la cabecera
            doc.moveDown();

            // Definir columnas de la tabla
            const tableHeaders = ["Producto", "Cantidad", "Costo Unitario", "Total"];
            const tableWidths = [100, 100, 100, 100]; // Anchos de las columnas (asegurarse que esta variable existe)

            const pageWidth = 595;  // Ancho de la página en PDF (tamaño carta)
            const tableWidth = tableWidths.reduce((a, b) => a + b, 0);  // Ancho total de la tabla, sumando los anchos de las columnas
            const marginLeft = (pageWidth - tableWidth) / 2;  // Centrar la tabla horizontalmente

            const tableTop = doc.y;
            const rowHeight = 30; // Altura fija de cada fila
            const marginExtra = 2; // Margen extra entre filas para espacio adicional

            // Dibujar las cabeceras de la tabla
            doc.font('Helvetica-Bold')
                .text(tableHeaders[0], marginLeft, tableTop, { width: tableWidths[0], align: 'center' })
                .text(tableHeaders[1], marginLeft + tableWidths[0], tableTop, { width: tableWidths[1], align: 'center' })
                .text(tableHeaders[2], marginLeft + tableWidths[0] + tableWidths[1], tableTop, { width: tableWidths[2], align: 'center' })
                .text(tableHeaders[3], marginLeft + tableWidths[0] + tableWidths[1] + tableWidths[2], tableTop, { width: tableWidths[3], align: 'center' });

            // Dibujar la línea que separa las cabeceras del resto de la tabla
            doc.moveTo(marginLeft, tableTop + rowHeight)
                .lineTo(marginLeft + tableWidths[0] + tableWidths[1] + tableWidths[2] + tableWidths[3], tableTop + rowHeight)
                .stroke();

            // Ajustar la posición 'y' después de la cabecera
            let yPosition = tableTop + rowHeight + 5; // Fija la posición 'y' para la primera fila

            // Dibujar cada fila de la tabla
            details.forEach(detalle => {
                const productYPosition = yPosition + (rowHeight - 12) / 2; // Centro verticalmente (12 es el tamaño de fuente)

                // Dibujar los datos de la fila con centrado vertical y horizontal
                doc.font('Helvetica')
                    .text(detalle.producto, marginLeft, productYPosition, { width: tableWidths[0], align: 'center' })
                    .text(detalle.cantidad, marginLeft + tableWidths[0], productYPosition, { width: tableWidths[1], align: 'center' })
                    .text(`$${detalle.costoUnitario.toFixed(2)}`, marginLeft + tableWidths[0] + tableWidths[1], productYPosition, { width: tableWidths[2], align: 'right' })
                    .text(`$${detalle.total.toFixed(2)}`, marginLeft + tableWidths[0] + tableWidths[1] + tableWidths[2], productYPosition, { width: tableWidths[3], align: 'right' });

                // Mover la posición 'y' después de cada fila, considerando margen extra
                yPosition += rowHeight + marginExtra;

                // Dibujar una línea después de cada fila
                doc.moveTo(marginLeft, yPosition)
                    .lineTo(marginLeft + tableWidths[0] + tableWidths[1] + tableWidths[2] + tableWidths[3], yPosition)
                    .stroke();
            });

            // Finalizar el documento y enviarlo como respuesta
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=factura.pdf');


            doc.pipe(res);
            doc.end();

            return res.status(200).json({
                Invoice: {
                    invoiceNumber,
                    saleDate
                }
            })

        } catch (err) {
            console.error("Error general:", err);
            res.status(500).json({ error: "Error al generar la factura." });
        }
    }


}