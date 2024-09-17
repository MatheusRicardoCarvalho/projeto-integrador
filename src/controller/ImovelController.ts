/*

import { hash } from "bcrypt";
import prisma from "../utils/prisma";
import { Request, Response } from "express";

export class ImovelController {

    async index(req: Request, res: Response) {
        const imoveis = await prisma.imovel.findMany();
        return res.json( imoveis )
    }
    async indexUnique(req: Request, res: Response){
        const {titulo} = req.body
        const imovel = await prisma.imovel.findUnique({where: {titulo}});
        return res.json({ imovel })
    }

    async store(req: Request, res: Response) {
        const { titulo, desc, preco, endereco, locadorId } = req.body
        //const imovelController = new ImovelController()

        const imovelExists = await prisma.imovel.findUnique({ where: {titulo} })

        if (imovelExists) {
            return res.status(409).json({ error: "Imovel Already Exists" });
        }

        try {


            const imovel = await prisma.imovel.create({
                data: {
                    titulo, desc, preco, endereco, locadorId
                }
            })

            const anuncio = await prisma.anuncio.create({
                data: {
                    imovelId: imovel.id,
                    locadorId: locadorId
                }
            })
            return res.json({ imovel })
        } catch (error) {
            return res.status(400).send(error)
        }

        //FIM DO IF

        /*const userExists = await prisma.locador.findUnique({ where: { email } })

        if (userExists) {
            return res.status(409).json({ error: "User Already Exists" });
        }

        const hashPassword = await hash(password, 8)

        const userLocador = await prisma.locador.create({
            data: {
                name,
                email,
                password: hashPassword,
                userType,
            }
        })
        return res.json({ userLocador })

        /*const userExists = await prisma.user.findUnique({where: {email}})

        if(userExists){
            return res.status(409).json({ error: "User Already Exists" });
        }

        const hashPassword = await hash(password,8)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword
            }
        })
        return res.json({ user })
    }
}

*/