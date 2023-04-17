import express from 'express';
import cors from 'cors';
import { ObjectId } from 'mongodb';
import authRoutes from './routes/authRoutes.js';
import sessionsRouter from './routes/sessionsRouters.js';
import searchRoutes from './routes/searchRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import mongo from './db/db.js';

let db = {};
try {
    db = await mongo();
} catch (error) {
    console.log(error);
}


const app = express();
app.use(cors());
app.use(express.json());

const router = express.Router();
router.use(authRoutes);
router.use(sessionsRouter);
router.use(searchRoutes);
router.use(categoriesRoutes);
app.use(router);

// setInterval(async () => {
//     const limit = 10000;
//     const now = Date.now();
//     try {
//       const p = await db.collection('sessions').find().toArray();
//       for(let i = 0; i < p.length; i++)
//       {
//         if(p[i].lastStatus + limit < now )
//         {
//           await db.collection('sessions').deleteOne({ _id: new ObjectId(p[i]._id) });  
//         }
//       }
//     } catch (error) {
//       console.error(error);
//     }
    
//   }, 15000);






app.listen(process.env.PORT, () => console.log(`App running in port: 5000`));