import { UnitService } from "./unit-service.js";

const unitService = new UnitService();

export class UnitController{
    
    async addUnit(req, res){
        try {
            const {unitName} = req.body;
            req.logger.info("Unidad agregada: " + unitName)
            const newUnit = await unitService.addUnit({unitName})
            return res.status(200).json({message: "Unidad agregada", unit: newUnit});
        } catch (error) {
            throw error
        }
    }

    async getUnit(req, res){
        try {
            const units = await unitService.getUnit();
            req.logger.info("Unidades")
            return res.status(200).json({units: units})
        } catch (error) {
            throw error;
        }
    }
}