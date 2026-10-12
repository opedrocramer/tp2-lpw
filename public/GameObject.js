import Sprite from './Sprite.js';

export default class GameObject {
    constructor(config) {
        this.isMounted = config.isMounted || false;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || 'down';
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || 'images/characters/people/hero.png'
        });
    }

    mount(map) {
        this.isMounted = true;
        map.addWall(this.x, this.y);
    }

    unmount(map) {
        this.isMounted = false;
        map.removeWall(this.x, this.y);
    }

    update() {}
}