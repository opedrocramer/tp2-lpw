export default class DirectionInput {
    constructor() {
        this.heldDirections = [];

        this.map = {
            'ArrowUp': 'up',
            'KeyW': 'up',
            'ArrowDown': 'down',
            'KeyS': 'down',
            'ArrowLeft': 'left',
            'KeyA': 'left',
            'ArrowRight': 'right',
            'KeyD': 'right'
        }
    }

    get direction() {
        return this.heldDirections[0];
    }

    init() {
        addEventListener('keydown', e => {
            const dir = this.map[e.code];
            const index = this.heldDirections.indexOf(dir);

            if (dir && index === -1) {
                this.heldDirections.unshift(dir);
                return;
            }

            if (e.code === 'KeyF') {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
            }
        });

        addEventListener('keyup', e => {
            const dir = this.map[e.code];
            const index = this.heldDirections.indexOf(dir);

            if (dir && index != -1) {
                this.heldDirections.splice(index, 1);
            }
        });
    }
}