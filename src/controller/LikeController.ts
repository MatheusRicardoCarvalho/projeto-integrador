import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const erros = {
  erroAoBuscarLikes: "Ocorreu um erro ao buscar os likes.",
  erroAoBuscarLike: "Ocorreu um erro ao buscar o like.",
  erroAoCriarLike: "Ocorreu um erro ao criar o like.",
  erroAoDeletarLike: "Ocorreu um erro ao deletar o like."
};

export class LikeController {

  async index(req: Request, res: Response) {
    try {
      const likes = await prisma.like.findMany();
      res.status(200).json(likes);
    } catch (error) {
      res.status(500).json({ error: erros.erroAoBuscarLikes });
    }
  }

  async indexUnique(req: Request, res: Response) {
    const { likerId, likedUserId } = req.body;
    try {
      const like = await prisma.like.findUnique({
        where: {
          like_unique_constraint: {
            likerId: likerId,
            likedUserId: likedUserId,
          },
        },
      });
      res.status(200).json({ like });
    } catch (error) {
      res.status(500).json({ error: erros.erroAoBuscarLike });
    }
  }
  
  async store(req: Request, res: Response) {
    const { likerId, likedUserId } = req.body;
    try {
      const like = await prisma.like.create({
        data: {
          likerId: likerId,
          likedUserId: likedUserId,
        },
      });
      res.status(200).json({ like });
    } catch (error) {
      res.status(500).json({ error: erros.erroAoCriarLike + ": " + error });
    }
  }

  async delete(req: Request, res: Response) {
    const { likerId, likedUserId } = req.body;
    try {
      const like = await prisma.like.delete({
        where: {
          like_unique_constraint: {
            likerId: likerId,
            likedUserId: likedUserId,
          },
        },
      });
      res.status(200).json(like);
    } catch (error) {
      res.status(500).json({ error: erros.erroAoDeletarLike });
    }
  }

  async match(req: Request, res: Response) {
    const { userId } = req.body;
    try {
      const likesGiven = await prisma.like.findMany({
        where: {
          likerId: userId,
        },
      });

      const likesReceived = await prisma.like.findMany({
        where: {
          likedUserId: userId,
        },
      });

      const matches = likesGiven.filter((like) =>
        likesReceived.some(
          (likeReceived) => likeReceived.likerId === like.likedUserId
        )
      );

      res.status(200).json(matches);
    } catch (error) {
      res.status(500).json({ error: "Ocorreu um erro ao buscar os matches." });
    }
  }

  async countLikes(req: Request, res: Response) {
    const { userId } = req.body;
    try {
      const likes = await prisma.like.count({
        where: {
          likedUserId: userId,
        },
      });
      res.status(200).json({ qtdLikes: likes });
    } catch (error) {
      res.status(500).json({ error: "Ocorreu um erro ao contar os likes." });
    }
  }
}
