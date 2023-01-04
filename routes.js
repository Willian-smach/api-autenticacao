import mongoose from 'mongoose';
import { Router } from 'express';
import { User } from './src/app/models/User.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

export const router = Router();

// Open route
router.get('/', (req, res) => {
    res.status(200).json({msg: 'Bem vindo!!'});
})

// Rota privada
router.get('/user/:id', async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id, '-password');
    
    if(!user) {
        return res.status(404).json({msg: "usuario não encontrado"});
    }

    try {
        
    } catch (error) {
        console.log(error);

        res.status(422).json({msg: "Aconteceu um erro no servidor!"});
    }
})

// Rota de registro
router.post('/auth/register', async (req, res) => {
    
    const { email, username, password, confirmPassword } = req.body;

    if(!email){
        return res.status(422).json({msg: "Email é obrigatório"});
    }
    if(!username){
        return res.status(422).json({msg: "Nome de usuário é obrigatório"});
    }
    if(!password){
        return res.status(422).json({msg: "Senha é obrigatória"});
    }
    if(password !== confirmPassword){
        return res.status(422).json({msg: "Senhas diferentes!!"});
    }
    // Checar se usuario existe (transformar em function depois)
    const userExists = await User.findOne({email: email});
    if (userExists){
        return res.status(422).json({msg: "Email já Existe"});
    }
    // Criar senha
    const passalt = await bcrypt.genSalt(12);
    const passHash = await bcrypt.hash(password, salt);
    // Criar usuario
    const user = new User({
        name: username,
        email,
        password: passHash,
    });

    try {

        await user.save();

        res.status(201).json({msg: 'Usuario inserido com sucesso!'});
        
    } catch (error) {
        console.log(error);

        res.status(422).json({msg: "Aconteceu um erro no servidor!"});
    }
});

// Rota de login
router.post('/auth/user', async (req, res) => {
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
});