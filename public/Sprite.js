import utils from './utils.js';

export default class Sprite {
    constructor(config) {
        // Set up the image
        this.image = new Image();
        this.image.onload = () => {
            this.isLoaded = true;
        };
        this.image.src = config.src;

        // Set up the shadow
        this.shadow = new Image();
        this.useShadow = true;
        if (this.useShadow) {
            this.shadow.onload = () => {
                this.isShadowLoaded = true;
            };
            this.shadow.src = 'images/characters/shadow.png';
        }

        // Configure animation & initial state
        this.animations = config.animations || {
            'idle-down': [0, 0],
            'idle-right': [0, 1],
            'idle-up': [0, 2],
            'idle-left': [0, 3]
        };

        this.currentAnimation = config.currentAnimation || 'idle-down';

        // Reference the game object
        this.gameObject = config.gameObject;
    }

    get frame() {
        return this.animations[this.currentAnimation];
    }

    setAnimation(key) {
        if (this.currentAnimation !== key) {
            this.currentAnimation = key;
        }
    }

    draw(ctx, cameraPerson) {
        const x = this.gameObject.x - 8 + (utils.withGrid(10.5) - cameraPerson.x);
        const y = this.gameObject.y - 18 + (utils.withGrid(6) - cameraPerson.y);

        const [frameX, frameY] = this.frame;

        this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

        this.isLoaded && ctx.drawImage(
            this.image,
            frameX * 32, frameY * 32,
            32, 32,
            x, y,
            32, 32
        );
    }
}