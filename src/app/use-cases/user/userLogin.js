import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import { User } from '../../models/User.js';
import bcrypt from 'bcrypt';

export async function userLogin(req = Request, res = Response) {
    const { email, password } = req.body;

    if(!email){
        return res.status(422).json({msg: "Email é obrigatório"});
    }
    if(!password){
        return res.status(422).json({msg: "Senha é obrigatória"});
    }

    // Checar se usuario existe
    const user = await User.findOne({email: email});
    if (!user){
        return res.status(404).json({msg: "Usuario não encontrado"});
    }

    // Checar senha
    const checkPass = await bcrypt.compare(password, user.password);
    if(!checkPass){
        return res.status(422).json({msg: "Senha inválida"});
    }

    try {

        const secret = process.env.SECRET;

        const token = jwt.sign(
            {
                id: user._id,
            },
            secret,
        );

        res.status(200).json({msg: 'Autenticação realizada com sucesso', token});
        
    } catch (error) {
        console.log(error);

        res.status(422).json({msg: "Aconteceu um erro no servidor!"});
    }
}
