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

server.listen(porta, () => {
  console.log('Servidor escutando na porta 3333');
});
