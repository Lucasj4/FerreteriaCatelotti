import express from 'express'
import { ProductController } from './product-controller.js'
import { validateProduct } from './product-validator.js';

export const productRouter = express.Router();
const productController = new ProductController();

productRouter.post("/addproduct", validateProduct, productController.addProduct);
productRouter.get("/", productController.getProducts);
productRouter.get("/:pid", productController.getProductById);
productRouter.put("/", productController.updateProduct);
productRouter.delete("/:pid", productController.deleteProduct);
productRouter.put("/:pid", productController.updateProduct);
productRouter.get("/search", productController.getProductsByFilter);
// productRouter.use(errorHandler)
