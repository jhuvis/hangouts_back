import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

export default async function mongo() {
    try {
        dotenv.config();
        const mongoClient = new MongoClient(process.env.MONGO_URI);
        let db;
        db = await mongoClient.db(process.env.DB_NAME);
        return db;
    } catch (error) {
        console.log(error);
    }
}