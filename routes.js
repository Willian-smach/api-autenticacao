import mongoose from 'mongoose';
import { Router } from 'express';
import { User } from './src/app/models/User.js';
import dotenv from 'dotenv';
dotenv.config();
import { userRegister } from './src/app/use-cases/user/userRegister.js';
import { userLogin } from './src/app/use-cases/user/userLogin.js';
import { checkToken } from './src/app/middlewares/checkToken.js';

export const router = Router();

// Open route
router.get('/', (req, res) => {
    res.status(200).json({msg: 'Bem vindo!!'});
})

// Rota privada
router.get('/user/:id', checkToken, async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id, '-password');
    
    if(!user) {
        return res.status(404).json({msg: "usuario não encontrado"});
    }

    res.status(200).json({msg: `Acesso permitido ao usuário: ${user.name}`});
})

// Rota de registro
router.post('/auth/register', userRegister);

// Rota de login
router.post('/auth/user', userLogin);

router.get('/users', async (req, res) => {
    const users = await User.find();

    res.json(users);
});

