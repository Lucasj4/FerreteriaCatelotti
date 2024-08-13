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

    async getUnitNameById(id){
        try {
            const units = await UnitModel.findOne({_id: id})
            return units.unitName;
        } catch (error) {
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