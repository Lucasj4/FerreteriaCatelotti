import express from 'express';
import { BudgetController } from './budget-controller.js';

const budgetController = new BudgetController();
export const budgetRouter = express.Router();

