import express from 'express';
import { BudgetController } from './budget-controller.js';
import { budgetValidator } from './budget-validator.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';
import { checkUserRole } from '../middlewares/checkrole.js';
const budgetController = new BudgetController();
export const budgetRouter = express.Router();




budgetRouter.post('/', authMiddleware, checkUserRole(["Admin", "Empleado"]), budgetValidator, budgetController.addBudget);
budgetRouter.post('/invoice',authMiddleware, checkUserRole(["Admin", "Empleado"]), budgetValidator, budgetController.addBudget);
budgetRouter.get('/', authMiddleware, checkUserRole(["Admin", "Empleado"]), budgetController.getBudgets);
budgetRouter.get('/search', authMiddleware, checkUserRole(["Admin", "Empleado"]), budgetController.searchBudgets);
budgetRouter.delete('/:idBudget', authMiddleware, checkUserRole(["Admin", "Empleado"]), budgetController.deleteBudget);
budgetRouter.get('/budgetwithdetails/:pid', authMiddleware, checkUserRole(["Admin", "Empleado"]), budgetController.getBudgetWithDetail);
budgetRouter.get("/:budgetId", authMiddleware, checkUserRole(["Admin", "Empleado"]), budgetController.getBudgetById);
budgetRouter.put('/:pid', authMiddleware, checkUserRole(["Admin", "Empleado"]), budgetValidator, budgetController.updateBudget);
budgetRouter.put('/updatestatus/:pid', authMiddleware, checkUserRole(["Admin", "Empleado"]), budgetController.updateBudgetStatus);

