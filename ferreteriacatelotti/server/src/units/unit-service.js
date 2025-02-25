import { UnitModel } from "./unit-model.js"

export class UnitService{

    async addUnit(data){
        try {
            const unit = new UnitModel(data);
            return await unit.save();
        } catch (error) {
            throw error;
        }
    }

    async getUnit(req, res){
        try {
            const units = await UnitModel.find()
            return units;
        } catch (error) {
            throw error;
        }
    }

    async getUnitNameById(id) {
        try {
            const unit = await UnitModel.findOne({ _id: id });
            if (!unit) {
                console.error(`Unidad no encontrada para ID: ${id}`);
                return null;
            }
            return unit.unitName;
        } catch (error) {
            console.error("Error en getUnitNameById:", error);
            throw error;
        }
    }

    async getUnitIdByName(name){
        try {
            const unit = await UnitModel.findOne({ unitName: name});
            return unit._id
        } catch (error) {
            throw error;
        }
    }
}