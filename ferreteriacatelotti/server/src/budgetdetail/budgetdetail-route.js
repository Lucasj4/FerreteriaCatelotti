import express from 'express';
import BudgetDetailController from './budgetdetail-controller.js'
import {ValidateBudgetDetail}from './budgetdetail-validator.js'
const budgetDetailController = new BudgetDetailController();
export const budgetDetailRouter = express.Router();

budgetDetailRouter.post('/', ValidateBudgetDetail, budgetDetailController.addBudgetDetail);
budgetDetailRouter.get('/:rowid', budgetDetailController.getBudgetDetailById);
budgetDetailRouter.post('/details-by-ids', budgetDetailController.getBudgetDetailsByIds);
budgetDetailRouter.put('/:rowid', ValidateBudgetDetail, budgetDetailController.updateBudgetDetail);
budgetDetailRouter.delete('/:rowid', budgetDetailController.deleteBudgetDetail)


