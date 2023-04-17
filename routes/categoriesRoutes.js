import express from 'express';
import { getAllCategories, putCategories } from '../controllers/categoriesController.js';
import auth from '../middlewares/authorizationMiddleware.js';
import putCategoriesMid from '../middlewares/putCategoriesMiddleware.js';

const categoriesRoutes = express.Router();
categoriesRoutes.get("/allCategories", getAllCategories);
categoriesRoutes.put("/categories", auth, putCategoriesMid, putCategories);


export default categoriesRoutes;