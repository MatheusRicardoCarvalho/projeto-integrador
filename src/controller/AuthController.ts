import { Request, Response } from "express"
import prisma from "../utils/prisma"
import { compare } from "bcrypt"
import { sign } from "jsonwebtoken"

export class AuthController{

    async authenticate(req: Request, res: Response){
        const {email, password} = req.body
        
        const user = await prisma.user.findUnique({where: {email} })

        if(!user){
            return res.status(404).json({ error: "User Not Found" });
        }
    
        const isValuePassword = await compare(password, user.password)
    
        if(!isValuePassword){
            return res.status(401).json({ error: "Invalid Password" });
        }
    
        const token = sign({ id: user.id }, ""+process.env.KEY_SECRET_TOKEN, { expiresIn: "1d" });
    
        const {id, name, gender, birthday, city, photo, phone} = user
        return res.json({user: {id, name, email, gender, birthday, city, photo, phone}, token})
    }
}
