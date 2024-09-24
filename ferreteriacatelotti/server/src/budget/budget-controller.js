import { BudgetService } from "./budget-service.js";

const budgetService = new BudgetService();

export class BudgetController{
    
    async addBudget(req, res){
        const {userID, clientID, budgetDate, budgetAmount, budgetStatus} = req.body;

        try {
            const newBudget = {
                userID,
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
}