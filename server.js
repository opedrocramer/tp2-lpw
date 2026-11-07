import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import utils from './public/utils.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static('public'));

const columns = 13;
const lines = 14;

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

function chooseCell() {
    const freeCells = [];

    for (let y = 6; y <= lines; y++) {
        for (let x = 2; x <= columns; x++) {
            const key = `${x},${y}`;

            if (!blockedCells.has(key)) {
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

let itemsInterval = null;

const startItemsInterval = () => {
    itemsInterval = setInterval(() => {
        const id = Math.floor(Math.random() * 10000000);
        let { x, y } = chooseCell() || {x: null, y: null};
        if (x && y) {
            blockedCells.add(`${x},${y}`);
            x = utils.withGrid(x);
            y = utils.withGrid(y);
            items[id] = {
                id,
                isRare: Math.random() < 1/5,
                x,
                y
            };

            io.emit('item-added', items[id]);
        }
    }, 1500)
};

startItemsInterval();

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
        const { x, y } = items[id];
        blockedCells.delete(`${x / 16},${y / 16}`);
        delete items[id];
        socket.broadcast.emit('item-collected', id);
    });

    socket.on('game-won', () => {
        clearInterval(itemsInterval);
        setTimeout(() => {
            startItemsInterval();
        }, 10000)
        for (const key in items) {
            delete items[key];
        }
        socket.broadcast.emit('game-over');
    });
});

httpServer.listen(3000);