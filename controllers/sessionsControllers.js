
import mongo from '../db/db.js';


let db = await mongo();

const status = async (req, res) => {

  const token = req.headers.authorization?.replace('Bearer ', '');
    const lastStatus = Date.now();
    try {
      const u = await db.collection('sessions').findOne({token : token });
      if(!u)
      {
        return res.sendStatus(404);
      }
      else
      {
        await db.collection('sessions').updateOne({ token: token }, { $set: {lastStatus} });
        res.sendStatus(200);
      }
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
     }
};



export { status };