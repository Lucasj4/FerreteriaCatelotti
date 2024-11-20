import { BudgetService } from "./budget-service.js";
import BudgetDetaiLModel from '../budgetdetail/budgetdetail-model.js'
const budgetService = new BudgetService();

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

            if(detailIds.lenght > 0){
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
                        clientID: budget.clientID ? budget.clientID.clientLastName : null
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


            res.status(200).json({ budgets });
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
        const { updateBudget } = req.body;
        const { pid } = req.params;

        try {
            if (!updateBudget || !pid) {
                return res.status(400).json({ message: "Datos insuficientes para actualizar el presupuesto." });
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

    async deleteBudget(req, res) {
        const { pid } = req.params;
    
        try {
            // Intentar eliminar el presupuesto
            const deletedBudget = await budgetService.deleteBudget(pid);
    
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
}