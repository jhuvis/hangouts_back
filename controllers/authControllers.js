import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import mongo from '../db/db.js';

let db = await mongo();


export async function signIn (req, res){
    try {
        const user = req.body;
        const userDB = await db.collection('users').findOne({ email: user.email });
        if(userDB && bcrypt.compareSync(user.password, userDB.password)) {
            const token = uuid();
            db.collection('sessions').insertOne(
                { 
                    token: token,
                    userId: userDB._id
                }
            );
            return res.status(201).send({
                token: token,
                name: userDB.name,
                lastStatus: Date.now()
            });
        } else { 
            return res.status(401).send('Login não autorizado!'); 
        };
    }
    catch (error) {
        console.log(error);
        return res.status(500).send('Não foi possível conectar ao servidor!');
    }
};

export async function signUp(req, res) {
    try {
        const user = req.body;
        const userDB = await db.collection("users").findOne({ email: user.email });
            if(!userDB){
                const passwordHash = bcrypt.hashSync(user.password, 10);
                db.collection("users").insertOne({
                    name: user.name,
                    email: user.email,
                    password: passwordHash
                });
                return res.status(201).send('Registro completo!'); 
            }else{
                return res.status(409).send('Esse email já está sendo utilizado, tente novamente!'); 
            }; 
    } catch (error) {
        return res.status(500).send('Não foi possível conectar ao servidor!');
    }  
};



