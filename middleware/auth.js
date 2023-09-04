import jwt from "jsonwebtoken";
const { sign, verify } = jwt;
import config from 'config';


export default function(req,res,next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access Denied.No token provided');

    try{
        const decodedPayload = jwt.verify(token, config.get("jwtprivatekey"));//process.env.TOKEN_SECRET) 
        req.user = decodedPayload;
        next();
    }
    catch(err){
        res.status(400).send('Invalid token');
    }

}
