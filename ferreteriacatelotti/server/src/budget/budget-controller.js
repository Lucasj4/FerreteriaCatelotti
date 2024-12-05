import { BudgetService } from "./budget-service.js";
import BudgetDetaiLModel from '../budgetdetail/budgetdetail-model.js'
import { ProductService } from "../products/product-service.js";
import {BudgetDetaiLService} from '../budgetdetail/budgetdetail-service.js'

const productService = new ProductService();
const budgetService = new BudgetService();
const budgetDetailService = new BudgetDetaiLService();

export class BudgetController {

    async addBudget(req, res) {
        const { userID, clientId, budgetDate, budgetAmount, budgetStatus, detailIds } = req.body;

        try {
            const newBudget = {
                // userID,
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
            const { clientId, budgetStatus } = req.query;

            req.logger.info("Client id: " + clientId);
            req.logger.info("Status: " + budgetStatus);
            // Llama al servicio con los filtros recibidos
            const budgets = await budgetService.searchBudgets(clientId, budgetStatus);

            console.log("budgets filtrados: ", budgets);
            
            
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

            console.log("formateed: ", formattedBudgets);
            
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

        req.logger.info("Id de presupuesto: " + pid);
        console.log("Info id: ", pid);

        try {
            const data = await budgetService.getBudgetWithDetail(pid);

            if (data.error) {
                return res.status(404).json({ message: data.error });
            }

            console.log(data.budget);
            
            res.status(200).json({
                budget: data.budget,
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

            const budget = await budgetService.updateBudget(updateBudget, pid);

            if(budgetStatus === "Facturado"){
                const budgetDetails = await budgetDetailService.getBudgetDetailsByBudgetId(pid);
                
                for(const budgetDetail of budgetDetails){
                    const product = await productService.getProductById(budgetDetail.productID);
                    if(product)
                    product.productStock -= budgetDetail.budgetDetailQuantity;
                    await productService.updateProductStock(budgetDetail.productID, product.productStock )
                    console.log(`Stock actualizado para el producto ${product.productName}: Nuevo stock ${product.productStock}`);
                }
            }

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

    async updateBudgetStatus(req, res) {
        const { budgetStatus} = req.body;
        const { pid } = req.params;

        req.logger.info("Id budget: " + pid);
        

        const updateStatus = {
            budgetStatus
        }

        req.logger.info("update budget: " + updateStatus);
        
        try {
            if (!budgetStatus || !pid) {
                return res.status(400).json({ message: "Datos insuficientes para actualizar el presupuesto." });
            }

            const budget = await budgetService.updateBudget({budgetStatus: budgetStatus}, pid);

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
        const {idBudget } = req.params;
        
        req.logger.info('Id budget: ' + idBudget)

        try {
            req.logger.info("Desde controllador deleteBudget")
            const deletedDetails = await BudgetDetaiLModel.deleteMany({ budgetID: idBudget});
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

    async getBudgetById(req, res){
        const {budgetId} = req.params;
       
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
}