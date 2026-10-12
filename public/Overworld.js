import OverworldMap, { OverworldMaps } from './OverworldMap.js';
import DirectionInput from './DirectionInput.js';
import Person from './Person.js';

export default class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.map = null;
        this.socket = null;
        this.localPlayerId = null;
    }

    startGameLoop() {
        const stepFn = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.fillStyle = 'wheat';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Establish the camera person
            const cameraPerson = this.map.gameObjects[this.localPlayerId];
            if (!cameraPerson) {
                return;
            }

            // Update objects
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    socket: this.socket,
                    arrow: this.directionInput.direction,
                    map: this.map
                });
            });

            // Draw lower image
            this.map.drawLowerImage(this.ctx, cameraPerson);

            // Draw objects
            Object.values(this.map.gameObjects).forEach(object => {
                object.sprite.draw(this.ctx, cameraPerson);
            });

            // Draw upper image
            this.map.drawUpperImage(this.ctx, cameraPerson);

            requestAnimationFrame(stepFn);
        }

        stepFn();
    }

    addPlayer(playerInfo, isLocal) {
        this.map.gameObjects[playerInfo.id] = new Person({
            isPlayerControlled: isLocal,
            x: playerInfo.x,
            y: playerInfo.y,
            src: isLocal ? 'images/characters/people/hero.png' : 'images/characters/people/npc1.png'
        });

        this.map.gameObjects[playerInfo.id].mount(this.map);

        if (isLocal) {
            this.localPlayerId = playerInfo.id;
        }
    }

    removePlayer(playerId) {
        if (this.map.gameObjects[playerId]) {
            this.map.gameObjects[playerId].unmount(this.map);
            delete this.map.gameObjects[playerId];
        }
    }

    init() {
        this.map = new OverworldMap(OverworldMaps.DemoRoom);

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.socket = io();

        this.socket.on('setup', players => {
            Object.keys(players).forEach(id => {
                this.addPlayer(players[id], id === this.socket.id);
            });
            this.map.mountObjects();

            this.startGameLoop();
        });

        this.socket.on('player-joined', playerInfo => {
            this.addPlayer(playerInfo, false);
        });

        this.socket.on('player-moved', playerInfo => {
            const player = this.map.gameObjects[playerInfo.id];

            if (player && !player.isPlayerControlled) {
                player.unmount(this.map);
                player.x = playerInfo.x;
                player.y = playerInfo.y;
                player.direction = playerInfo.direction;
                player.mount(this.map);

                player.startBehaviour({ map: this.map }, {
                    type: 'walk',
                    direction: player.direction
                });
            }
        });

        this.socket.on('player-disconnected', playerId => {
            this.removePlayer(playerId);
        });
    }
}