import express from 'express'
import { CategoryController } from './category-controller.js'

const categoryController = new CategoryController();

export const categoryRouter = express.Router();

categoryRouter.post('/', categoryController.addCategory);
categoryRouter.get("/:categoryname" , categoryController.getCategoryByName)
categoryRouter.get('/:categoryid', categoryController.getCategoryId);
categoryRouter.get('/', categoryController.getCategories);
