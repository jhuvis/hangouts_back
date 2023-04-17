import mongo from '../db/db.js';
import { ObjectId } from 'mongodb';
import axios from 'axios';
import dotenv from 'dotenv';

let db = await mongo();
dotenv.config();

export async function getPlaces(req, res){
    try {
        const data = req.query;
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${data.lat},${data.lng}&radius=${data.radius}&types=${data.types}&key=${process.env.KEY}`;
        let response = {};
        try {
            response = await axios.get(url);
        } catch (error) {
            console.error(error);
            return res.status(500).send(error.message);
        }

        let places = {};
        try {
            places = await db.collection('places').find({
                "data.types": { $in: data.types.split("|")}
            }).toArray();
        } catch (error) {
            console.error(error);
            return res.status(500).send(error.message);
        }

        if(places.length > 0) 
        {
            places = places.filter(p => distance(p.data.geometry.location.lat, p.data.geometry.location.lng, data.lat, data.lng) <= data.radius);
        }
        console.log("places: ", places);
        const setResult = new Set();
        let result = {};
        if(places.length > 0)
        {
            result = response.data.results.concat(places.map(p => p.data) || []);
        }
        //console.log("result: ", result);
        result = result.filter((r) => {
            const duplicated = setResult.has(r.place_id);
            setResult.add(r.place_id);
            return !duplicated; 
          });

        res.status(200).send(result);
        return;
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
};

export async function getPlaceById(req, res){
    try {
        const { placeId } = req.params;
        console.log("req.params: ", placeId);
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.KEY}`;
        let response = {};
        try {
            response = await axios.get(url);
        } catch (error) {
            console.error(error);
            return res.status(500).send(error.message);
        }

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
        if(places && response.data.result) {
            response.data.result.types = places.data.types;
            console.log(places.data);
        }
        res.status(200).send(response.data.result);
        return;
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
};

function distance(lat1, lng1, lat2, lng2) {
    const earthRadius = 6371; // raio médio da Terra em km
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2))
      * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return distance;
  }

  function toRadians(degrees) {
    return degrees * Math.PI / 180;
  }