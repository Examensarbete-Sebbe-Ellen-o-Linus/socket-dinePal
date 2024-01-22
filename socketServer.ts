import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ['https://dine-pal.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  })
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['https://dine-pal.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('orderCreated', () => {
    io.emit('orderCreated', 'a new order has been created');
  });

  socket.on('message', () => {
    console.log('message received from client');
    io.emit('message', 'message sent from socket server123');
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`);
});

app.post('/ordercreated', (req, res) => {
  const order = req.body.order;
  io.emit('orderCreated', 'message sent through socket emit');
  res.status(200).json('notification sent from socket server');
});
