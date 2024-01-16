import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: 'http//localhost:5173', // Frontend domain
    methods: ['GET', 'POST'],
  })
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('orderCreated', (order) => {
    io.emit('orderCreated', order);
  });

  socket.on('message', () => {
    console.log('message received from client');
    io.emit('message', 'message sent from socket server123');
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// httpServer.listen(3001, '0.0.0.0', () => {
httpServer.listen(3001, () => {
  console.log('listening on :3001');
});

app.post('/ordercreated', (req, res) => {
  const order = req.body.order;
  io.emit('orderCreated', 'message sent through socket emit');
  res.status(200).json('notification sent from socket server');
});
