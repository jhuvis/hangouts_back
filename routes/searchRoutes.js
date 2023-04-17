import express from 'express';
import { getPlaces, getPlaceById } from '../controllers/searchController.js';
import searchMid from '../middlewares/searchMiddleware.js';
import searchByIdMid from '../middlewares/searchByIdMiddleware.js';

const searchRoutes = express.Router();
searchRoutes.get("/search", searchMid, getPlaces);
searchRoutes.get("/searchById/:placeId", searchByIdMid, getPlaceById);

export default searchRoutes;