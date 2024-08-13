import { BudgetService } from "./budget-service.js";

const budgetService = new BudgetService();

export class BudgetController{
    
    async addBudget(req, res){
        const {userID, clientID, date, amount, status} = req.body;

        try {
            
        } catch (error) {
            
        }
    }
}