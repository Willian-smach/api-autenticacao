import { jwt } from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export function checkToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({msg: 'Acesso negado'});
    }

    try {
        const secret = process.env.SECRET;
        jwt.verify(token, secret);

        next();
    } catch (error) {
        console.log(error);

        res.status(422).json({msg: "Token inválido"});
    }
}