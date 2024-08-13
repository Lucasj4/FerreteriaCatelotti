import CategoryModel from "./category-model.js";

export class CategoryService{
    async addCategory(data){
        try {
            const category = new CategoryModel(data);
            return await category.save();
        } catch (error) {
            throw error;
        }
    }
    
    async getCategoryId(id){
        try {
            const category = await CategoryModel.findOne({_id: id});

            const categoryName = category.categoryName;
            
            return categoryName;
        } catch (error) {
            throw error;
        }
    }
    
    async getCategories(){
        try {
            const categories = await CategoryModel.find();
            return categories;
        } catch (error) {
            throw error;
        }
    }

    async getCategoryIdByName(name){
        try {
            const category = await CategoryModel.findOne({categoryName: name});
            return category._id
        } catch (error) {
            throw error;
        }
    }
}