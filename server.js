import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import utils from './public/utils.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static('public'));

const colunas = 13;
const linhas = 14;

function chooseCell() {
    const blockedCells = new Set([
        "2,6",
        "2,7",
        "3,6",
        "3,7",
        "7,8",
        "7,9",
        "7,10",
        "8,8",
        "8,9",
        "8,10",
        "11,6",
        "12,6",
        "13,6",
    ]);
    const freeCells = [];

    for (let y = 6; y <= linhas; y++) {
        for (let x = 2; x <= colunas; x++) {
            const chave = `${x},${y}`;

            if (!blockedCells.has(chave)) {
                freeCells.push({ x, y });
            }
        }
    }

    if (freeCells.length === 0) {
        return null;
    }

    const idx = Math.floor(Math.random() * freeCells.length);
    return freeCells[idx];
}

const players = {};
const items = {};

setInterval(() => {
    const id = Math.floor(Math.random() * 10000000);
    let { x, y } = chooseCell();
    x = utils.withGrid(x);
    y = utils.withGrid(y);
    items[id] = {
        id,
        x,
        y
    };

    io.emit('item-added', items[id]);
}, 5000)

io.on('connection', (socket) => {
    console.log(`> New player connected with id ${socket.id}`);
    let { x, y } = chooseCell();
    x = utils.withGrid(x);
    y = utils.withGrid(y);

    players[socket.id] = {
        id: socket.id,
        x,
        y
    };

    socket.emit('setup', { players, items });

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

    socket.on('item-collected', id => {
        delete items[id];
        socket.broadcast.emit('item-collected', id);
    });
});

httpServer.listen(3000);