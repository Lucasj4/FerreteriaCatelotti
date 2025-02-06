import ProductModel from "./product-model.js";
import CategoryModel from "../categories/category-model.js";
export class ProductService{

    async getProductsCount() {
        try {
            const count = await ProductModel.countDocuments();
            return count;
        } catch (error) {
            console.error("Error al contar los productos:", error);
            throw error;
        }
    }
    
    
    async addProduct(data){
        try{
            const newProduct = new ProductModel(data);
            return await newProduct.save();
        }catch(error){
            throw error
        }
    }
    async getProductByCode(code){
        try {
            const product = await ProductModel.findOne({code:code});
            return product;
        } catch (error) {
           throw error;
        }
    }

    async getProductById(id){
        try {
            const product = await ProductModel.findById(id);
            return product;
        } catch (error) {
            throw error;
        }
    }

    async getProducts(){
        try {
            const products = await ProductModel.find();
            return products;
        } catch (error) {
            throw error;
        }
    }

    async getProductsByName(name){
        try {
            const products = await ProductModel.find({
                productName: { $regex: name, $options: 'i' } // Busca productos cuyo nombre contenga el texto, sin importar mayúsculas o minúsculas
            });
            return products;
        } catch (error) {
            throw error;
        }
    }

    async getProductByName(name) {
        try {
            const product = await ProductModel.findOne({ productName: name });
            return product ? product.productName : null;
        } catch (error) {
            throw error;
        }
    }
    

    async getProductsByCategory(category) {
        try {
            const categoryObj = await CategoryModel.findOne({
                categoryName: { $regex: category, $options: 'i' }
            });
            
            if (!categoryObj) {
                return [];
            }
            const products = await ProductModel.find({ categoryID: categoryObj._id })
                .populate('categoryID', 'categoryName')
                
            
            return products;
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(idProduct,data){
        try {
            const updateProduct = await ProductModel.findByIdAndUpdate(idProduct, data);
            return updateProduct;
        } catch (error) {
            throw error;
        }
    }

    async updateProductStock(idProduct, stock){
        try {
            const updateProductStock = await ProductModel.findByIdAndUpdate(idProduct, {productStock: stock},  { new: true } );
            return updateProductStock
        } catch (error) {
            throw error;
        }
    }

    async deleteProducts(){
        try {
            const deleteProducts = await ProductModel.deleteMany();
            return deleteProducts;
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id){
        try {
            const deleteProduct = await ProductModel.findByIdAndDelete(id);
            return deleteProduct;
        } catch (error) {
            throw error;
        }
    }

    async getProductsWithLowStock(maxStock = 10) {
        try {
            const products = await ProductModel.find({  productStock: { $lte: maxStock } });
            return products;
        } catch (error) {
            throw error;
        }
    }

    
}