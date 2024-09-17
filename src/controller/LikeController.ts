import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export class LikeController {

  async index(req: Request, res: Response) {
    try {
      const likes = await prisma.like.findMany();
      res.status(200).json(likes);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching the likes." });
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
      res.status(200).json({like});
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching the like." });
    }
  }
  

  // Função para registrar um like de um usuário para outro
  async store(req: Request, res: Response) {
    const { likerId, likedUserId } = req.body;
    try {
      const like = await prisma.like.create({
        data: {
          likerId: likerId,
          likedUserId: likedUserId,
        },
      });
      res.status(200).json({like});
    } catch (error) {
      res.status(500).json({ error: "Houve o seguinte erro: " + error });
    }
  }

  // Função para deletar um like gerado anteriormente
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
      res.status(500).json({ error: "An error occurred while deleting the like." });
    }
  }

  // Função para retornar uma lista de todos os matches de like de um determinado usuário
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
      res.status(500).json({ error: "An error occurred while fetching the matches." });
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
      res.status(500).json({ error: "An error occurred while counting the likes." });
    }
  }
}