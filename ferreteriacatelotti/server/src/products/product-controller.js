import { ProductService } from "./product-service.js";
import { generateRandomCode } from "../utils/generatecode.js";
import { CategoryService } from "../categories/category-service.js";
import { UnitService } from "../units/unit-service.js";
import mongoose from "mongoose";
const productService = new ProductService();
const categoryService = new CategoryService();

const unitService = new UnitService();

export class ProductController {

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

    async getProductsCount(req, res) {
        try {
            const count = await productService.getProductsCount();
            return res.status(200).json({ count });
        } catch (error) {
            console.error("Error al obtener la cantidad de productos:", error);
            res.status(500).json({ error: "Error al obtener la cantidad de productos" });
        }
    }

    async getProductUnitByProductId(productId) {
        try {
            const product = await productService.getProductById(productId);
            if (!product) return null;
            console.log("Unidad id: " + product.unitID);
            const unitProduct = await unitService.getUnitNameById(product.unitID);
            return unitProduct;
        } catch (error) {
            console.error("Error al obtener la unidad del producto:", error);
            return null;
        }
    }
    

    async updateProduct(req, res) {

        const { productName, productStock, productUnit, productPrice, productCategory, productCost, } = req.body;
        const {pid} = req.params;

        const [unitID, categoryID] = await Promise.all([
            unitService.getUnitIdByName(productUnit),
            categoryService.getCategoryIdByName(productCategory)
        ]);

        const updateProduct = {
            productName,
            unitID,
            categoryID,
            productStock,
            productPrice,
            productCost
        }

        req.logger.info("prodcut id desde controller updateProduct: " + pid);

        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ success: false, message: "ID de producto no válido" });
        }
        try {
            const existingProduct = await productService.getProductById(pid);

            if (!existingProduct) {
                return res.status(404).json({ success: false, message: "Producto no encontrado" });
            }

            const product = await productService.updateProduct(pid, updateProduct);

            if (product) {
                return res.status(200).json({ message: 'Producto actualizado con éxito', product });
            }
        } catch (error) {
            req.logger.error("Error al actualizar el producto:", error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async updateProductStocks(req, res) {
        const { products } = req.body; 
    
        req.logger.info("Validando y actualizando stock para múltiples productos");
    
        try {
            const updatedProducts = [];
            
            
            for (const { pid, quantity, operationType } of products) {
                if (!mongoose.Types.ObjectId.isValid(pid)) {
                    return res.status(400).json({ success: false, message: `Invalid product ID: ${pid}` });
                }
    
                const product = await productService.getProductById(pid);
    
                if (!product) {
                    return res.status(404).json({ success: false, message: `Product not found: ${pid}` });
                }
    
                if (operationType === 'decrease' && product.productStock < quantity) {
                    return res.status(400).json({
                        success: false,
                        message: `No hay suficiente stock del producto ${product.productName}. El stock actual es ${product.productStock}.`,
                    });
                }
            }
    
            // Si todos los productos pasan la validación, actualizar stocks
            for (const { pid, quantity, operationType } of products) {
                const product = await productService.getProductById(pid);
                const updatedStock = operationType === 'decrease' 
                    ? product.productStock - quantity 
                    : product.productStock + quantity;
    
                const updatedProduct = await productService.updateProduct(pid, { productStock: updatedStock });
                updatedProducts.push(updatedProduct);
            }
    
            return res.status(200).json({
                success: true,
                message: "Stock actualizado con exito",
                updatedProducts,
            });
        } catch (error) {
            console.error("Error updating product stocks:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
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

    async getProducts(req, res) {
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



            if (products) {
                return res.status(200).json({ message: "Productos", products: enhancedProducts })
            } else {
                return res.status(404).json({ message: "Productos no encontrados" })
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteProducts(req, res) {
        try {
            const deleteProducts = await productService.deleteProducts();
            return res.status(200).json({ message: "Productos eliminados", productos: deleteProducts });
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

            return res.status(200).json({ products: enhancedProducts });
        } catch (error) {
            console.error('Error al buscar productos:', error);
            return res.status(500).json({ message: 'Error en el servidor', error });
        }
    }

    async getProductById(req, res) {
        const { pid } = req.params;

        try {
            req.logger.info("Pid desde controller getProductById: " + pid);

            const product = await productService.getProductById(pid);
            req.logger.info("Product: " + product);

            return res.status(200).json({ product });
        } catch (error) {
            console.error('Error al buscar productos:', error);
            return res.status(500).json({ message: 'Error en el servidor', error });
        }
    }

    async getProductsWithLowStock(req, res) {
        const { stockThreshold, unitID } = req.body;
        req.logger.info("Stock bajo:", stockThreshold, "Unidad:", unitID);
    
        try {
            const lowStockProducts = await productService.getProductsWithLowStock(stockThreshold, unitID);
            console.log("Productos con bajo stock:", lowStockProducts);
    
            if (!lowStockProducts.length) {
                return res.status(404).json({ message: "No se encontraron productos con bajo stock para la unidad seleccionada" });
            }
    
            // Mejorar los datos agregando nombres de unidad y categoría
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
            console.error("Error al obtener productos con bajo stock:", error);
            return res.status(500).json({ message: "Error en el servidor", error });
        }
    }
    


}