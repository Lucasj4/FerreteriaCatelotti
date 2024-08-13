import express from 'express';
import { UnitController } from './unit-controller.js';


const unitController = new UnitController()
export const unitRouter = express.Router();


unitRouter.post("/", unitController.addUnit)
unitRouter.get("/", unitController.getUnit)

