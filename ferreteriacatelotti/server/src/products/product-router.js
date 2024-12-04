import express from 'express'
import { ProductController } from './product-controller.js'
import { validateProduct } from './product-validator.js';

export const productRouter = express.Router();
const productController = new ProductController();

productRouter.post("/addproduct", validateProduct, productController.addProduct);
productRouter.put("/:pid", validateProduct,  productController.updateProduct);
productRouter.put("/updateproductstock/:pid", productController.updateProductStock);
productRouter.delete("/:pid", productController.deleteProduct);

productRouter.get("/", productController.getProducts);
productRouter.get("/lowstock", productController.getProductsWithLowStock);
productRouter.get("/search", productController.getProductsByFilter);
productRouter.get("/:pid", productController.getProductById);

