import express from 'express';
import { BudgetController } from './budget-controller.js';
import { budgetValidator } from './budget-validator.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';
import { checkUserRole } from '../middlewares/checkrole.js';
const budgetController = new BudgetController();
export const budgetRouter = express.Router();



budgetRouter.get('/count', authMiddleware, checkUserRole(["Admin", "Empleado", "Dueño"]), budgetController.getBudgetsCount);
budgetRouter.get('/', authMiddleware, checkUserRole(["Admin", "Empleado", "Dueño"]), budgetController.getBudgets);
budgetRouter.get('/search', authMiddleware, checkUserRole(["Admin", "Empleado"]), budgetController.searchBudgets);
budgetRouter.get('/budgetwithdetails/:pid', authMiddleware, checkUserRole(["Admin", "Empleado"]), budgetController.getBudgetWithDetail);
budgetRouter.get('/:budgetId', authMiddleware, checkUserRole(["Admin", "Empleado"]), budgetController.getBudgetById);
budgetRouter.put('/:pid', authMiddleware, checkUserRole(["Admin", "Empleado"]), budgetValidator, budgetController.updateBudget);
budgetRouter.post('/', authMiddleware, checkUserRole(["Admin", "Empleado"]), budgetValidator, budgetController.addBudget);
budgetRouter.post('/invoice',authMiddleware, checkUserRole(["Admin", "Empleado"]), budgetValidator, budgetController.addBudget);
budgetRouter.put('/updatestatusandamount/:pid', authMiddleware, checkUserRole(["Admin", "Empleado"]), budgetController.updateBudgetStatusAndAmount);
budgetRouter.delete('/:idBudget', authMiddleware, checkUserRole(["Admin", "Empleado"]), budgetController.deleteBudget);

