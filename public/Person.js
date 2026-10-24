import GameObject from './GameObject.js';
import utils from './utils.js';

export default class Person extends GameObject {
    constructor(config) {
        super(config);

        this.isPlayerControlled = config.isPlayerControlled || false;
        this.socket = config.socket;

        this.movingProgressRemaining = 0;
        this.directionUpdate = {
            'up': ['y', -1],
            'down': ['y', 1],
            'left': ['x', -1],
            'right': ['x', 1]
        }
    }

    update(state) {
        if (this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {
            // Case: we're keyboard ready and have an arrow pressed
            if (this.isPlayerControlled && state.arrow) {
                this.startBehaviour(state, {
                    type: 'walk',
                    direction: state.arrow,
                    socket: state.socket
                });

                if (state.socket) {
                    state.socket.emit('player-movement', {
                        x: this.x,
                        y: this.y,
                        direction: this.direction
                    });
                }
            }
        }

        this.updateAnimation(state);
    }

    startBehaviour(state, behaviour) {
        this.direction = behaviour.direction;

        if (behaviour.type === 'walk') {
            if (!state.map.isSpaceTaken(this.x, this.y, this.direction)) {
                state.map.moveWall(this.x, this.y, this.direction);
                this.movingProgressRemaining = utils.withGrid(1);

                if (state.map.hasItem(this.x, this.y, this.direction)) {
                    const itemId = state.map.collectItem(this.x, this.y, this.direction);
                    if (state.socket) {
                        state.socket.emit('item-collected', itemId);
                    }
                }
            }
        }
    }

    updatePosition() {
        const [property, change] = this.directionUpdate[this.direction];
        this[property] += change;
        this.movingProgressRemaining--;
    }

    updateAnimation(state) {
        this.sprite.setAnimation(`idle-${this.direction}`);
    }
}