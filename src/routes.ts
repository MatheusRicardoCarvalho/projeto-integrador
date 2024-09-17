import { Router } from "express";
import { UserController } from "./controller/UserController";
import { AuthController } from "./controller/AuthController";
import { AuthMiddleware } from "./middlewares/auth";
import {LikeController} from "./controller/LikeController";
import { TagController } from "./controller/TagController";
import { addAbortSignal } from "stream";

export const routes = Router();

const userController = new UserController()
const authController = new AuthController()
const likeController = new LikeController()
const tagController = new TagController()

routes.get('/users', userController.index)
routes.get('/likes', likeController.index)
routes.get('/chats', userController.listChats)
//routes.get('/photo_profile/:userId', userController.getProfilePhoto)

routes.post('/matches', likeController.match)
routes.post('/like', likeController.store)
routes.post('/liked', likeController.indexUnique)
routes.post('/countLikes', userController.countLikes)
routes.post('/findMatchs', userController.getMatches)
routes.post("/users/find", userController.filterUsers)
routes.post('/user', userController.show)
routes.post('/users/create', userController.store)
routes.post('/users/update', userController.update)
//routes.post('/photo_profile/:userId', userController.uploadProfilePhoto)
routes.post('/auth', authController.authenticate)
routes.post('/createTags', tagController.createTags)
routes.delete('/like', likeController.delete)
routes.get('/tags', tagController.index)
routes.post('/user/addTags', userController.associateTags)
routes.post('/user/clearTags', userController.clearAllTags)
routes.post('/user/tags', userController.getTagsByUser)
routes.post('/getChat', userController.getChatIdByUserIds)
routes.post('/chat', userController.createChat)
routes.post('/message', userController.createMessage)

routes.delete('/user/tag', userController.removeTag)

// testando push