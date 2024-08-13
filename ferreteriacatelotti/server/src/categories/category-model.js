import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    
})

const CategoryModel = mongoose.model("categories", categorySchema);

export default CategoryModel;