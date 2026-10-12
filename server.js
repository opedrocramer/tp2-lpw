import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import utils from './public/utils.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static('public'));

const players = {};
const walls = {};

io.on('connection', (socket) => {
    console.log(`> New player connected with id ${socket.id}`);

    players[socket.id] = {
        id: socket.id,
        x: utils.withGrid(5),
        y: utils.withGrid(6)
    };

    socket.emit('setup', players);

    socket.broadcast.emit('player-joined', players[socket.id]);

    socket.on('player-movement', data => {
        const player = players[socket.id];
        if (player) {
            player.x = data.x;
            player.y = data.y;
            player.direction = data.direction;

            socket.broadcast.emit('player-moved', {
                id: socket.id,
                ...data
            });
        }
    });

    socket.on('disconnect', () => {
        console.log(`> Player disconnected with id ${socket.id}`);

        delete players[socket.id];
        io.emit('player-disconnected', socket.id);
    });
});

httpServer.listen(3000);