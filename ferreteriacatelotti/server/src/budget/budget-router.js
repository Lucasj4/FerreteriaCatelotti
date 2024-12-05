import express from 'express';
import { BudgetController } from './budget-controller.js';
import { budgetValidator } from './budget-validator.js';
const budgetController = new BudgetController();
export const budgetRouter = express.Router();




budgetRouter.post('/', budgetValidator, budgetController.addBudget);
budgetRouter.get('/', budgetController.getBudgets);
budgetRouter.get('/search', budgetController.searchBudgets);
budgetRouter.delete('/:idBudget', budgetController.deleteBudget);
budgetRouter.get('/budgetwithdetails/:pid', budgetController.getBudgetWithDetail);
budgetRouter.get("/:budgetId", budgetController.getBudgetById);
budgetRouter.put('/:pid', budgetValidator, budgetController.updateBudget);
budgetRouter.put('/updatestatus/:pid', budgetController.updateBudgetStatus);

