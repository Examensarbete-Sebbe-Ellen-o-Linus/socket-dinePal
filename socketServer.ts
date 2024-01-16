import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: 'https://dine-pal.vercel.app', // Frontend domain
  })
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'https://dine-pal.vercel.app',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('orderCreated', (order) => {
    io.emit('orderCreated', order);
  });
});

// httpServer.listen(3001, '0.0.0.0', () => {
httpServer.listen(3001, () => {
  console.log('listening on :3001');
});

app.post('/ordercreated', (req, res) => {
  const order = req.body.order;
  io.emit('orderCreated', 'message sent thourgh socket emit');
  res.status(200).json('notification sent from socket server');
});
