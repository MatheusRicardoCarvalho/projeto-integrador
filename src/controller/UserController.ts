import { hash } from "bcrypt";
import prisma from "../utils/prisma";
import { Request, Response } from "express";
import dayjs from "dayjs";

interface CustomRequest extends Request {
    user?: any;
}

export class UserController {

    constructor() {
    }

    async index(req: Request, res: Response) {
        try {
            const users = await prisma.user.findMany();
            return res.status(200).json({ users });
        } catch (err) {
            return res.status(500).json({ error: "Erro ao buscar usuários" });
        }
    }

    async indexUnique(req: Request, res: Response){
        try {
            const {email} = req.body;
            const user = await prisma.user.findUnique({where: {email}});
            return res.status(200).json({ user });
        } catch (err) {
            return res.status(500).json({ error: "Erro ao buscar usuário" });
        }
    }

    async store(req: Request, res: Response) {
        try {
            const { name, email, password, userType } = req.body;

            if (userType == 'tenantUser') {
                const userExists = await prisma.user.findUnique({ where:{ email } });

                if (userExists) {
                    return res.status(409).json({ error: "Usuário já existe" });
                }

                const hashPassword = await hash(password, 8);

                const user = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password: hashPassword,
                        userType
                    }
                });
                return res.status(200).json({ user });
            }
        } catch (err) {
            return res.status(500).json({ error: "Erro ao criar usuário" });
        }
    }

    async show(req: Request, res: Response) {
        try {
            const { id } = req.body;
            const user = await prisma.user.findUnique({
                where: { id: Number(id) },
                select: {
                    name: true,
                    email: true,
                    gender: true,
                    birthday: true,
                    city: true,
                    photo: true,
                    phone: true,
                    password: true,
                    likedBy: true,
                    likes: true
                }
            });
            return res.status(200).json({ user });
        } catch (err) {
            return res.status(500).json({ error: "Erro ao buscar usuário" });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id, name, email, gender, birthday, city, photo, phone, aboutMe } = req.body;
            
            

            const user = await prisma.user.update({
                where: { id: Number(id) },
                data: {
                    name,
                    email,
                    gender,
                    birthday,
                    city,
                    photo,
                    aboutMe,
                    phone,
                },
            });
            return res.status(200).json({ user });
        } catch (err) {
            return res.status(500).json({ error: "Erro ao atualizar usuário" });
        }
    }

    async countLikes(req: Request, res: Response) {
        const { userId } = req.body;
        try {
            const likesCount = await prisma.like.count({
                where: {
                    likedUserId: Number(userId)
                }
            });
            return res.status(200).json({ likesCount });
        } catch (err) {
            return res.status(500).json({ error: "Erro ao contar likes do usuário" });
        }
    }
    
    async getMatches(req: Request, res: Response) {
        const { userId } = req.body;

        try {
            const user = await prisma.user.findUnique({
                where: { id: Number(userId) },
                select: {
                    likedBy: true,
                    likes: true
                }
            });
    
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
    
            const likedByUserIds = user.likedBy.map(like => like.likerId);
            const userLikesIds = user.likes.map(like => like.likedUserId);
    
            const matches = likedByUserIds.filter(id => userLikesIds.includes(id));
    
            const matchedUsers = await prisma.user.findMany({
                where: {
                    id: {
                        in: matches
                    }
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    gender: true,
                    birthday: true,
                    city: true,
                    photo: true,
                    aboutMe: true,
                    phone: true
                }
            });
    
            return res.status(200).json({ matchedUsers });
        } catch (err) {
            return res.status(500).json({ error: "Erro ao buscar matches do usuário" });
        }
    }

    async associateTags(req: Request, res: Response) {
        try {
            const { userId, tagIds } = req.body;
    
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
    
            const existingTags = await prisma.tag.findMany({
                where: { id: { in: tagIds } },
            });
    
            await Promise.all(
                existingTags.map(async (tag) => {
                    const existingUserTag = await prisma.userTag.findFirst({
                        where: {
                            userId: userId,
                            tagId: tag.id,
                        },
                    });
    
                    if (!existingUserTag) {
                        await prisma.userTag.create({
                            data: {
                                userId,
                                tagId: tag.id,
                            },
                        });
                    }
                })
            );
    
            return res.status(200).json({ message: "Tags associadas com sucesso!" });
        } catch (err) {
            return res.status(500).json({ error: "Erro interno do servidor: " + err });
        }
    }

    async getTagsByUser(req: Request, res: Response) {
        try {
            const { userId } = req.body;
    
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
    
            const userTags = await prisma.userTag.findMany({
                where: {
                    userId: userId,
                },
                include: {
                    tag: true, 
                },
            });
    
            const onlyTags = userTags.map(userTag => userTag.tag);
    
            return res.status(200).json({ tags: onlyTags });
        } catch (err) {
            return res.status(500).json({ error: "Erro interno do servidor: " + err });
        }
    }
    
    async clearAllTags(req: Request, res: Response) {
        try {
            const { userId } = req.body;
    
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
    
            await prisma.userTag.deleteMany({
                where: {
                    userId: userId,
                },
            });
    
            return res.status(200).json({ message: "Todas as tags foram removidas do usuário" });
        } catch (err) {
            return res.status(500).json({ error: "Erro interno do servidor: " + err });
        }
    }
    
    async removeTag(req: Request, res: Response) {
        try {
            const { userId, tagId } = req.body;
    
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
    
            const tag = await prisma.tag.findUnique({ where: { id: tagId } });
            if (!tag) {
                return res.status(404).json({ error: "Tag não encontrada" });
            }
    
            await prisma.userTag.deleteMany({
                where: {
                    userId: userId,
                    tagId: tagId,
                },
            });
    
            return res.status(200).json({ message: "Tag removida do usuário com sucesso" });
        } catch (err) {
            return res.status(500).json({ error: "Erro interno do servidor: " + err });
        }
    }
    

    async getChatMessages(req: Request, res: Response) {
        try {
            const { chatId } = req.body;

            const chat = await prisma.chat.findUnique({
                where: { id: chatId },
                include: { messages: true },
            });

            if (!chat) {
                return res.status(404).json({ error: "Chat não encontrado" });
            }

            const messages = chat.messages;

            return res.status(200).json({ messages });
        } catch (err) {
            return res.status(500).json({ error: "Erro ao buscar mensagens do chat" });
        }
    }

    async listChats(req: Request, res: Response) {
        try {
            const chats = await prisma.chat.findMany({
                include: {
                    users: true,
                    messages: true,
                },
            });
            return res.status(200).json({ chats });
        } catch (err) {
            return res.status(500).json({ error: "Erro ao listar chats: " + err });
        }
    }
    

    async getChatIdByUserIds(req: Request, res: Response) {
        try {
            const { userId1, userId2 } = req.body;

            const chat = await prisma.chat.findFirst({
                where: {
                    users: {
                        every: {
                            id: {
                                in: [userId1, userId2],
                                
                            },
                        },
                    },
                },
                include: {messages: true}

            });

            if (!chat) {
                return res.status(404).json({ error: "Chat não encontrado" });
            }

            return res.status(200).json({ chat });
        } catch (err) {
            return res.status(500).json({ error: "Erro ao buscar ID do chat" });
        }
    }

    async createChat(req: Request, res: Response) {
        try {
            const { userIds } = req.body;
    
            const users = await prisma.user.findMany({
                where: {
                    id: {
                        in: userIds,
                    },
                },
                include: {
                    likedBy: true,
                    likes: true,
                },
            });
    
            if (users.length !== userIds.length) {
                return res.status(404).json({ error: "Usuário(s) não encontrado(s)" });
            }
    
            const matchedUsers = users.filter(user => {
                const likedByUserIds = user.likedBy.map(like => like.likerId);
                const userLikesIds = user.likes.map(like => like.likedUserId);
                return likedByUserIds.some(id => userLikesIds.includes(id));
            });
    
            if (matchedUsers.length !== users.length) {
                return res.status(403).json({ error: "Usuários precisam se curtir para criar um chat" });
            }
    
            const chat = await prisma.chat.create({
                data: {
                    users: {
                        connect: userIds.map((id: number) => ({ id })),
                    },
                },
            });
    
            return res.status(201).json({ chat });
        } catch (err) {
            return res.status(500).json({ error: "Erro ao criar chat: " + err });
        }
    }
    
    
    async createMessage(req: Request, res: Response) {
        try {
            const { chatId, senderId, content } = req.body;
    
            const chat = await prisma.chat.findUnique({
                where: { id: chatId },
                include: { users: true },
            });
    
            if (!chat) {
                return res.status(404).json({ error: "Chat não encontrado" });
            }
    
            const userInChat = chat.users.some((user) => user.id === senderId);
    
            if (!userInChat) {
                return res.status(403).json({ error: "Usuário não pertence ao chat" });
            }
    
            const message = await prisma.message.create({
                data: {
                    content,
                    chat: { connect: { id: chatId } },
                    sender: { connect: { id: senderId } },
                },
            });
    
            return res.status(201).json({ message });
        } catch (err) {
            return res.status(500).json({ error: "Erro ao criar mensagem: " + err });
        }
    }

    async filterUsers(req: CustomRequest, res: Response) {
        try {
            const { name, email, city, gender, rangeAge, Ilike, userId, tags } = req.body;
            const filters: any = {};
    
            if (name) {
                filters.name = { contains: name };
            }
    
            if (email) {
                filters.email = { contains: email };
            }
    
            if (city) {
                filters.city = { contains: city };
            }
    
            if (gender) {
                filters.gender = gender;
            }
    
            if (rangeAge) {
                const currentYear = new Date().getFullYear();
                const minBirthday = new Date();
                const maxBirthday = new Date();
                minBirthday.setFullYear(currentYear - rangeAge.idadeMax);
                maxBirthday.setFullYear(currentYear - rangeAge.idadeMin);
    
                filters.birthday = {
                    gte: minBirthday,
                    lte: maxBirthday,
                };
            }
    
            if (typeof Ilike === 'boolean') {
                if (Ilike) {
                    filters.likedBy = {
                        some: { likerId: userId },
                    };
                } 
            }
    
            if (tags && tags.length > 0) {
                filters.tags = {
                    some: {
                        tag: {
                            name: { in: tags },
                        },
                    },
                };
            }
    
            const users = await prisma.user.findMany({
                where: filters,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    gender: true,
                    birthday: true,
                    city: true,
                    photo: true,
                    aboutMe: true,
                    phone: true,
                    tags: {
                        select: {
                            tag: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });
    
            return res.status(200).json({ users });
        } catch (err) {
            return res.status(500).json({ error: "Erro ao filtrar usuários: " + err });
        }
    }
    
    
}
