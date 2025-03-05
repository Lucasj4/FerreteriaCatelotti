import express from 'express';
import { ProductController } from './product-controller.js';
import { validateProduct } from './product-validator.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';
import { checkUserRole } from '../middlewares/checkrole.js';

export const productRouter = express.Router();
const productController = new ProductController();

productRouter.get('/count', authMiddleware, checkUserRole(["Admin", "Dueño", "Empleado"]), productController.getProductsCount);
productRouter.post("/addproduct", validateProduct, authMiddleware, checkUserRole(["Admin", "Dueño"]), productController.addProduct);
productRouter.post("/lowstock", authMiddleware, checkUserRole(["Admin", "Dueño"]), productController.getProductsWithLowStock);
productRouter.put("/updateproductstock", authMiddleware, checkUserRole(["Admin", "Dueño"]), productController.updateProductStocks);
productRouter.put("/:pid", validateProduct, authMiddleware, checkUserRole(["Admin", "Dueño"]), productController.updateProduct);
productRouter.delete("/:pid", authMiddleware, checkUserRole(["Admin", "Dueño"]), productController.deleteProduct);
productRouter.get("/", authMiddleware, checkUserRole(["Admin", "Dueño", "Empleado"]), productController.getProducts);
productRouter.get("/search", authMiddleware, checkUserRole(["Admin", "Dueño"]), productController.getProductsByFilter);
productRouter.get("/:pid", authMiddleware, checkUserRole(["Admin", "Dueño"]), productController.getProductById);
