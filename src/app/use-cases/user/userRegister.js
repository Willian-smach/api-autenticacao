import { User } from "../../models/User.js";
import bcrypt from 'bcrypt';

export async function userRegister(req = Request, res = Response) {
    const { username, email, password, confirmPassword } = req.body;

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
    const passHash = await bcrypt.hash(password, passalt);
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
}