/*
import { hash } from "bcrypt";
import prisma from "../utils/prisma";
import { Request, Response } from "express";
import { ImovelController } from "./ImovelController";

export class AnuncioController {

    async index(req: Request, res: Response) {
        const anuncios = await prisma.anuncio.findMany();
        return res.json({ anuncios })
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
    }
}*/