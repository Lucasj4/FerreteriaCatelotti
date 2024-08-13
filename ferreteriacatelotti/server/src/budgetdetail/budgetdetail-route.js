import express from 'express';
import BudgetDetailController from './budgetdetail-controller.js'

const budgetDetailController = new BudgetDetailController();
export const budgetDetailRouter = express.Router();


