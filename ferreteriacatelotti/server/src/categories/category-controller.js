import { CategoryService } from "./category-service.js";

const categoryService = new CategoryService();

export class CategoryController{
    async addCategory(req, res) {
        try {
            const { categoryName} = req.body;
            const category = await categoryService.addCategory({categoryName})
            res.status(201).json({ message: "Categoria agregada con exito", category });
        } catch (error) {
            throw error;
        }

    }
    async getCategoryId(req, res){
        const {id} = req.body;
        
        try {
            const categoryName = await categoryService.getCategoryId(id);
            if(categoryName){
                return res.status(200).json(categoryName);
            }else{
                return res.status(404).json({message: "Categoria no existe"});
            }
        } catch (error) {
            throw error;
        }
    }

    async getCategories(req, res) {
        try {
            const categories = await categoryService.getCategories();
            if (!categories || categories.length === 0) {
                return res.status(404).json({ message: "No se encontraron categorías" });
            }
            res.status(200).json({ message: "Categorías", categories });
        } catch (error) {
            res.status(500).json({ message: "Error al obtener categorías", error: error.message });
        }
    }

    // async getCategoryByName(req,res){
    //     try {
    //         const { name } = req.query;
    //         if (!name) {
    //             return res.status(400).json({ message: "El nombre del producto es requerido" });
    //         }
    
    //         const products = await productService.getProductsByName(name);
    //         const enhancedProducts = await enhanceProducts(products);
    //         return res.status(200).json({ message: "Productos", products: enhancedProducts });
    //     } catch (error) {
    //         console.error("Error al obtener productos por nombre:", error);
    //         return res.status(500).json({ message: "Error interno del servidor" });
    //     }
    // }
}