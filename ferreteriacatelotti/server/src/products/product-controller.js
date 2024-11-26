import { ProductService } from "./product-service.js";
import { generateRandomCode } from "../utils/generatecode.js";
import { CategoryService } from "../categories/category-service.js";
import { UnitService } from "../units/unit-service.js";
import mongoose from "mongoose";
const productService = new ProductService();
const categoryService = new CategoryService();

const unitService = new UnitService();

export class ProductController{
    
    async addProduct(req, res) {
        const { productName, productPrice, productStock, productUnit, productCategory, productCost } = req.body;
        const productCode = generateRandomCode(8);
    
        try {
    
            const existingProduct = await productService.getProductByName(productName);
            
            if (existingProduct) {
                return res.status(409).json({ error: `El producto ${productName} ya existe` });
            }
    
            const [unitID, categoryID] = await Promise.all([
                unitService.getUnitIdByName(productUnit),
                categoryService.getCategoryIdByName(productCategory)
            ]);
    
            const newProduct = {
                productName,
                productPrice,
                productStock,
                productCost,
                categoryID,
                unitID,
                productCode,
            }
    
            const product = await productService.addProduct(newProduct);
            return res.status(201).json({ message: "Producto creado", product });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async updateProduct(req, res){
        const { updateProduct} = req.body;
        const {productId} = req.body
        
        console.log("prodcut id desde controller updateProduct: ", productId);

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "ID de producto no válido" });
        }
        try {
            const existingProduct = await productService.getProductById(productId);

            if(!existingProduct){
                return res.status(404).json({ success: false, message: "Producto no encontrado" });
            }

            const product = await productService.updateProduct(productId, updateProduct);
            
            if(product){
                return res.status(200).json({ message: 'Producto actualizado con éxito', product: existingProduct});
            }
        } catch (error) {
            req.logger.error("Error al actualizar el producto:", error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async updateProductStock(req, res) {
        const { pid} = req.params;
        const { quantityToDecrease } = req.body; // Quantity to subtract from the stock
        req.logger.info("Desde updaeproductStock");
        req.logger.info("Product ID:" + pid);
        req.logger.info("Quantity to decrease:" + quantityToDecrease);
    
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }
    
        try {
            const product = await productService.getProductById(pid);
    
            if (!product) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }
    
            const currentStock = product.productStock; // Current stock of the product
    
            // Check if there is enough stock
            if (currentStock >= quantityToDecrease) {
                const updatedStock = currentStock - quantityToDecrease;
    
                // Update the product stock
                const updatedProduct = await productService.updateProduct(pid, { productStock: updatedStock });
    
                if (updatedProduct) {
                    return res.status(200).json({
                        success: true,
                        message: 'Stock updated successfully',
                        updatedProduct: updatedProduct,
                    });
                } else {
                    return res.status(500).json({ success: false, message: "Error updating product stock" });
                }
            } else {
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for product ${pid}. Current stock is ${currentStock}`,
                });
            }
        } catch (error) {
            console.error("Error updating product stock:", error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async deleteProduct(req, res) {
        const { pid } = req.params; // Extrae el ID de los parámetros de la URL
        try {
            console.log("Id: ", pid);
            const deleteProduct = await productService.deleteProduct(pid);
            console.log("Producto eliminado: ", deleteProduct);
            if (!deleteProduct) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }
    
            return res.status(200).json({ message: "Producto eliminado con éxito" });
        } catch (error) {
            return res.status(500).json({ message: "Error al eliminar el producto", error });
        }
    }

    async getProducts(req, res){
        try {
            const products = await productService.getProducts();
            
            const enhancedProducts = await Promise.all(
                products.map(async (product) => {
                  const [unitName, categoryName] = await Promise.all([
                    unitService.getUnitNameById(product.unitID),
                    categoryService.getCategoryId(product.categoryID)
                  ]);
                 
                  const productObj = product.toObject();
                  return {
                    ...productObj,
                    unitID: unitName,
                    categoryID: categoryName,
                  };
                })
              );
           
           
     
            if(products){
                return res.status(200).json({message: "Productos", products: enhancedProducts})
            }else{
                return res.status(404).json({message: "Productos no encontrados"})
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteProducts(req, res){
        try {
            const deleteProducts = await productService.deleteProducts();
            return res.status(200).json({message: "Productos eliminados", productos: deleteProducts});
        } catch (error) {
            req.logger.error("Error al actualizar el producto:", error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async getProductsByFilter(req, res) {
        const { name, category } = req.query;
        try {
            let products = [];
            if (name) {
                products = await productService.getProductsByName(name);
            } else if (category) {
                products = await productService.getProductsByCategory(category);
                
            }
            if (!products.length) {
                return res.status(404).json({ message: 'No se encontraron productos' });
            }
    
            const enhancedProducts = await Promise.all(
                products.map(async (product) => {
                    const [unitName, categoryName] = await Promise.all([
                        unitService.getUnitNameById(product.unitID),
                        categoryService.getCategoryId(product.categoryID)
                    ]);
                    
                    const productObj = product.toObject();
                    return {
                        ...productObj,
                        unitID: unitName,
                        categoryID: categoryName,
                    };
                })
            );
    
    
          
            // Envía los productos encontrados como respuesta
            return res.status(200).json({ products: enhancedProducts });
        } catch (error) {
            console.error('Error al buscar productos:', error);
            return res.status(500).json({ message: 'Error en el servidor', error });
        }
    }

    async getProductById(req, res){
        const {pid} = req.params;

        try {
            console.log("Pid desde controller: " + pid);
            
            const product = await productService.getProductById(pid);
            console.log("Product: " + product);
            
            return res.status(200).json({ product });
        } catch (error) {
            console.error('Error al buscar productos:', error);
            return res.status(500).json({ message: 'Error en el servidor', error });
        }
    }

    async getProductsWithLowStock(req, res) {
        try {
            console.log("Desde low stock");
            
            const maxStock = 10; // You can adjust this value if needed
            const lowStockProducts = await productService.getProductsWithLowStock(maxStock);
            console.log("productos con bajo stock: " + lowStockProducts);
            if (!lowStockProducts.length) {
                return res.status(404).json({ message: "No se encontraron productos con bajo stock" });
            }
           
            
            const enhancedProducts = await Promise.all(
                lowStockProducts.map(async (product) => {
                    const [unitName, categoryName] = await Promise.all([
                        unitService.getUnitNameById(product.unitID),
                        categoryService.getCategoryId(product.categoryID)
                    ]);

                    const productObj = product.toObject();
                    return {
                        ...productObj,
                        unitID: unitName,
                        categoryID: categoryName,
                    };
                })
            );

            return res.status(200).json({ products: enhancedProducts });
        } catch (error) {
            console.error('Error al obtener productos con bajo stock:', error);
            return res.status(500).json({ message: 'Error en el servidor', error });
        }
    }

    
}