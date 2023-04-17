import { ObjectId } from 'mongodb';
import mongo from '../db/db.js';
import axios from 'axios';
import dotenv from 'dotenv';

let db = await mongo();
dotenv.config();

export async function getAllCategories(req, res){
    let categories = [];
        try {
            categories = await db.collection('categories').find({}).toArray();
        } catch (error) {
            console.error(error);
            return res.status(500).send(error.message);
        }

        res.status(200).send(categories[0]);
        return;
};

export async function putCategories(req, res){
    const value = req.body.value;
    const label = req.body.label;
    const placeId = req.body.placeId;

    let categories = [];
        try {
            categories = await db.collection('categories').find({}).toArray();
        } catch (error) {
            console.error(error);
            return res.status(500).send(error.message);
        }

        console.log("categories[0].categories: ", categories[0]);
        let upCat = {};
        if(!categories[0].categories.find(c => c.value === value)) {
            try {
                upCat = await db.collection('categories').updateOne({
                    _id: ObjectId(categories[0]._id)}, 
                    {$push: { categories: {
                        value: value,
                        label: label 
                        } 
                    }
                });
            } catch (error) {
                console.error(error);
                return res.status(500).send(error.message);
            }
        }
        
        console.log("upCat: ", upCat);
        let places = {};
        try {
            places = await db.collection('places').findOne({
                "data.place_id": placeId
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send(error.message);
        }
        console.log("place: ", places);
        if(places)
        {
            if(places.data.types.find(c => c === value))
            {
                return res.status(403).send("type ja adicionado");
            }
            try {
                await db.collection('places').updateOne(
                    {"data.place_id": placeId},
                    {
                        $push: { 
                            "data.types" : value
                        }
                    }
                );
            } catch (error) {
                console.error(error);
                return res.status(500).send(error.message);
            }
        }
        else
        {
            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.KEY}`;
            let response = {};
            try {
                response = await axios.get(url);
            } catch (error) {
                console.error(error);
                return res.status(500).send(error.message);
            }
            if(!response.data.result)
            {
                return res.status(404).send("not found");
            }
            if(response.data.result.types.find(c => c.value === value))
            {
                return res.status(403).send("type ja adicionado");
            }
            response.data.result.types.push(value);
            try {
                const data = response.data.result;
                await db.collection('places').insertOne({data});
            } catch (error) {
                console.error(error);
                return res.status(500).send(error.message);
            }
        }

        res.status(200).send(categories[0].categories);
        return;
};
