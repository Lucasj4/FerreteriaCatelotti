import { BudgetService } from "./budget-service.js";

const budgetService = new BudgetService();

export class BudgetController {

    async addBudget(req, res) {
        const { userID, clientID, budgetDate, budgetAmount, budgetStatus } = req.body;

        try {
            const newBudget = {
                // userID,
                clientID,
                budgetDate,
                budgetAmount,
                budgetStatus
            }

            const budget = await budgetService.createBudget(newBudget);

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
}