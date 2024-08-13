import mongoose from "mongoose";

const unitSchema = new mongoose.Schema({
    unitName: {
        type: String,
        required: true
    }
})

export const UnitModel = mongoose.model('units', unitSchema);