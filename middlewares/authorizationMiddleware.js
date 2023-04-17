import mongo from "../db/db.js";
import { ObjectId } from 'mongodb';

let db = await mongo();

export default async function authorizationMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if(!token) return res.status(401).send('Login não autorizado!');
    const session = await db.collection("sessions").findOne({ token : token });       
    if (!session) {
        return res.status(401).send('Login não autorizado!'); 
    }
    const user = await db.collection("users").findOne({ _id: new ObjectId(session.userId )});

    delete user.password;
    res.locals.user = user;
  
    next();
  }