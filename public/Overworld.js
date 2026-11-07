import OverworldMap, { OverworldMaps } from './OverworldMap.js';
import DirectionInput from './DirectionInput.js';
import Person from './Person.js';
import GameObject from './GameObject.js';

export default class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.map = null;
        this.socket = null;
        this.localPlayerId = null;
        this.score = 0;
        this.scorePanelImg = new Image();
        this.scorePanelImg.src = 'images/points/score.png';
        this.gameOverState = null;
        this.winImg = new Image();
        this.winImg.src = 'images/endgame/ganhador.png';
        this.loseImg = new Image();
        this.loseImg.src = 'images/endgame/perdedor.png';
        this.btnYesImg = new Image();
        this.btnYesImg.src = 'images/buttons/yes.png';
        this.btnNoImg = new Image();
        this.btnNoImg.src = 'images/buttons/no.png';
        this.gameOverTimer = null;
        this.timeLeft = 10;
        this.hasChoosen = false;
        this.goodbyeMessage = false;
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
                    map: this.map,
                    overworld: this
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

            this.ctx.save();
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.imageSmoothingEnabled = false;

            const posX = 5;
            const posY = 5;

            const drawWidth = 64;
            const drawHeight = 32;

            if (this.scorePanelImg.complete && this.scorePanelImg.naturalWidth !== 0) {
                this.ctx.drawImage(this.scorePanelImg, posX, posY, drawWidth, drawHeight);
            }

            this.ctx.restore();

            if (this.gameOverState) {
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                const imgToDraw = this.gameOverState === 'won' ? this.winImg : this.loseImg;

                if (imgToDraw.complete && imgToDraw.naturalWidth !== 0) {
                    const imgWidth = 192;
                    const imgHeight = 192;
                    const x = (this.canvas.width - imgWidth) / 2;
                    const y = (this.canvas.height - imgHeight) / 2;

                    this.ctx.save();
                    this.ctx.imageSmoothingEnabled = false;

                    this.ctx.drawImage(imgToDraw, x, y, imgWidth, imgHeight);

                    this.ctx.textAlign = 'center';

                    if (this.goodbyeMessage) {
                        this.ctx.fillStyle = '#FFFFFF';
                        this.ctx.font = 'bold 10px sans-serif';
                        this.ctx.fillText("Você será removido do jogo.", this.canvas.width / 2, y + 110);
                    } else if (!this.hasChoosen) {
                        this.ctx.fillStyle = '#FFFFFF';
                        this.ctx.font = 'bold 10px sans-serif';
                        this.ctx.fillText("Deseja jogar de novo?", this.canvas.width / 2, y + 90);

                        const btnWidth = 36;
                        const btnHeight = 36;
                        const btnY = y + 93;

                        const btnYesX = x + 50;
                        const btnNoX = x + 106;

                        if (this.btnYesImg.complete && this.btnYesImg.naturalWidth !== 0) {
                            this.ctx.drawImage(this.btnYesImg, btnYesX, btnY, btnWidth, btnHeight);
                        }
                        if (this.btnNoImg.complete && this.btnNoImg.naturalWidth !== 0) {
                            this.ctx.drawImage(this.btnNoImg, btnNoX, btnY, btnWidth, btnHeight);
                        }

                        this.ctx.fillStyle = '#FFFFFF';
                        this.ctx.font = '9px sans-serif';
                        this.ctx.fillText(`Começa em: ${this.timeLeft}s`, this.canvas.width / 2, y + 136);
                    } else {
                        this.ctx.fillStyle = '#FFFFFF';
                        this.ctx.font = 'bold 11px sans-serif';
                        let msgTempo = `Começando em ${this.timeLeft}s...`;
                        this.ctx.fillText(msgTempo, this.canvas.width / 2, y + 110);
                    }

                    this.ctx.restore();
                }
                
                requestAnimationFrame(stepFn);
                return;
            }

            requestAnimationFrame(stepFn);
        };

        stepFn();
    }

    addPlayer(playerInfo, isLocal) {
        this.map.gameObjects[playerInfo.id] = new Person({
            isPlayerControlled: isLocal,
            x: playerInfo.x,
            y: playerInfo.y,
            src: isLocal ? 'images/characters/good_ball.png' : 'images/characters/bad_ball.png'
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

    addItem(itemInfo) {
        this.map.gameObjects[itemInfo.id] = new GameObject({
            isItem: true,
            x: itemInfo.x,
            y: itemInfo.y,
            src: 'images/hearts/pink_heart.png'
        });
        this.map.gameObjects[itemInfo.id].mount(this.map);

        this.map.addItem(itemInfo.id, itemInfo.x, itemInfo.y);
    }

    removeItem(itemId) {
        this.map.removeItem(itemId);
    }

    winner() {
        if (this.hasWon) return;
        this.hasWon = true;
        this.score = 0;
        const scoreEl = document.getElementById('score-value');
        if (scoreEl) scoreEl.innerText = "0";
        this.gameOverState = 'won';
        
        this.gameOverTimer = setInterval(() => {
            this.timeLeft--;
            if (this.timeLeft <= 0) {
                clearInterval(this.gameOverTimer);
                window.location.reload();
            }
        }, 1000);
    }

    loser() {
        if (this.hasLost) return;
        this.hasLost = true;
        this.score = 0;
        const scoreEl = document.getElementById('score-value');
        if (scoreEl) scoreEl.innerText = "0";
        this.gameOverState = 'lost';
        
        this.gameOverTimer = setInterval(() => {
            this.timeLeft--;
            if (this.timeLeft <= 0) {
                clearInterval(this.gameOverTimer);
                window.location.reload();
            }
        }, 1000);
    }

    init() {
        this.map = new OverworldMap(OverworldMaps.DemoRoom);

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.socket = io();

        this.socket.on('setup', info => {
            const { players, items } = info;

            Object.keys(players).forEach(id => {
                this.addPlayer(players[id], id === this.socket.id);
            });
            this.map.mountObjects();

            Object.keys(items).forEach(id => {
                this.addItem(items[id]);
            });

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

        this.socket.on('item-added', itemInfo => {
            this.addItem(itemInfo);
        });

        this.socket.on('game-over', () => {
            this.loser();
        });

        const getButtonBounds = () => {
            const imgWidth = 192;
            const imgHeight = 192;
            const startX = (this.canvas.width - imgWidth) / 2;
            const startY = (this.canvas.height - imgHeight) / 2;
            
            const btnWidth = 36;
            const btnHeight = 36;
            const btnY = startY + 84;

            return {
                yes: { x: startX + 50, y: btnY, w: btnWidth, h: btnHeight },
                no: { x: startX + 106, y: btnY, w: btnWidth, h: btnHeight }
            };
        };

        this.canvas.addEventListener('mousemove', (event) => {
            if (!this.gameOverState || this.hasChoosen) {
                this.canvas.style.cursor = 'default';
                return;
            }

            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const mouseX = (event.clientX - rect.left) * scaleX;
            const mouseY = (event.clientY - rect.top) * scaleY;

            const bounds = getButtonBounds();
            const overYes = mouseX >= bounds.yes.x && mouseX <= bounds.yes.x + bounds.yes.w &&
                            mouseY >= bounds.yes.y && mouseY <= bounds.yes.y + bounds.yes.h;
            const overNo = mouseX >= bounds.no.x && mouseX <= bounds.no.x + bounds.no.w &&
                           mouseY >= bounds.no.y && mouseY <= bounds.no.y + bounds.no.h;

            if (overYes || overNo) {
                this.canvas.style.cursor = 'pointer';
            } else {
                this.canvas.style.cursor = 'default';
            }
        });

        this.canvas.addEventListener('click', (event) => {
            if (!this.gameOverState || this.hasChoosen) return;

            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const clickX = (event.clientX - rect.left) * scaleX;
            const clickY = (event.clientY - rect.top) * scaleY;

            const bounds = getButtonBounds();

            if (clickX >= bounds.yes.x && clickX <= bounds.yes.x + bounds.yes.w && 
                clickY >= bounds.yes.y && clickY <= bounds.yes.y + bounds.yes.h) {
                this.hasChoosen = true;
                this.canvas.style.cursor = 'default';
            }

            if (clickX >= bounds.no.x && clickX <= bounds.no.x + bounds.no.w && 
                clickY >= bounds.no.y && clickY <= bounds.no.y + bounds.no.h) {
                this.hasChoosen = true;
                this.canvas.style.cursor = 'default';
                clearInterval(this.gameOverTimer);
                
                if (this.socket) {
                    this.socket.disconnect();
                }

                window.close();
                this.goodbyeMessage = true; 
                setTimeout(() => {
                    window.location.href = "about:blank";
                }, 1500);
            }
        });
    }
}