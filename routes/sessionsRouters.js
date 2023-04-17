import express from 'express';
import * as sessionsController from '../controllers/sessionsControllers.js';

const sessionsRouter = express.Router();

sessionsRouter.post('/status', sessionsController.status);

export default sessionsRouter;
