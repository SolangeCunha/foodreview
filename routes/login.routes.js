import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import  jwt  from 'jsonwebtoken';

const login = express.Router();

login.post('/', async (req,res) => {

    //recebe as informaçôes de LOGIN
    const {email, password} = req.body;

    // buscar o email no banco de dados, se existente, e armazenar
    const registeredUser = await User.findOne(
        {where: {email}}
    ).catch(
        (err)=>{
            console.log("Error: ", err);
        }
    )

    //caso email inexistente, informar o usuário
    if(!registeredUser)
        return res
            .status(400)
            .json({message: "Email ou Senha Inválidos."})

    //caso email existente, verificar a senha do usuário
    if (!bcrypt.compareSync(password, registeredUser.password)) {
        return res
        .status(400)
        .json({message: "Email ou Senha Inválidos."})

    }

    //caso senha correta, gerar token de acesso
    const token = jwt.sign(
        //Payload: o que será armzenado no token
        {
            id: registeredUser.id,
            name: registeredUser.name,
            admin: registeredUser.admin
        },
        // Secret or Private Key
        process.env.JWT_SECRET,
        // Options
    {
        expiresIn: '1h'
    }
    );
    
    // enviar confirmação de login eo token para uso
    res.json(
        {
            message: "Bem VIndo!",
            token: token
        }
    )

});

export default login;