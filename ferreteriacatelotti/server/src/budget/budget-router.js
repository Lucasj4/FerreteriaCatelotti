import express from 'express';
import { BudgetController } from './budget-controller.js';
import { budgetValidator } from './budget-validator.js';
const budgetController = new BudgetController();
export const budgetRouter = express.Router();

budgetRouter.post('/', budgetValidator, budgetController.addBudget);
budgetRouter.get('/', budgetController.getBudgets);
budgetRouter.get('/search', budgetController.searchBudgets);
budgetRouter.delete('/:id', budgetController.deleteById);

