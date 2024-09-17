// server.ts
import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { routes } from './routes';

const porta = process.env.PORT ? Number(process.env.PORT) : 3333
const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

const server = http.createServer(app);
const io = new Server(server);

//const chatRooms: Map<string, Socket[]> = new Map();

io.on('connection', (socket: Socket) => {
  
    socket.on('joinRoom', (chatID: string) => {
    socket.join(chatID);
  });
  
  socket.on('leaveRoom', (chatID: string) => {
    socket.leave(chatID);
  });
  
  socket.on('message', (message: string, chatID: string) => {
    io.to(chatID).emit('message', message); // Envia a mensagem para todos os sockets na sala
  });
});

server.listen(porta, () => {
  console.log('Servidor escutando na porta 3333');
});
