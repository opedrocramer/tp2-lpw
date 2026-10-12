import utils from './utils.js';

export default class OverworldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;

        this.walls = config.walls || {};

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;
    }

    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.lowerImage,
            utils.withGrid(10.5) - cameraPerson.x,
            utils.withGrid(6) - cameraPerson.y
        );
    }

    drawUpperImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.upperImage,
            utils.withGrid(10.5) - cameraPerson.x,
            utils.withGrid(6) - cameraPerson.y
        );
        // Object.keys(this.walls).forEach(key => {
        //     const [x, y] = key.split(',').map(Number);
        //     const offsetX = utils.withGrid(10.5) - cameraPerson.x;
        //     const offsetY = utils.withGrid(6) - cameraPerson.y;

        //     ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        //     ctx.fillRect(x + offsetX, y + offsetY, 16, 16);
        // });
    }

    mountObjects() {
        Object.values(this.gameObjects).forEach(object => {
            object.mount(this);
        })
    }

    isSpaceTaken(currentX, currentY, direction) {
        const { x, y } = utils.nextPosition(currentX, currentY, direction);

        return this.walls[`${ x },${ y }`] || false;
    }

    addWall(x, y) {
        this.walls[`${ x },${ y }`] = true;
    }
    removeWall(x, y) {
        delete this.walls[`${ x },${ y }`];
    }
    moveWall(wasX, wasY, direction) {
        this.removeWall(wasX, wasY);
        const { x, y } = utils.nextPosition(wasX, wasY, direction);
        this.walls[`${ x },${ y }`] = true;
    }
}

export const OverworldMaps = {
    DemoRoom: {
        lowerSrc: 'images/maps/DemoLower.png',
        upperSrc: 'images/maps/DemoUpper.png',
        gameObjects: {},
        walls: {
            [utils.asGridCoord(7, 6)]: true,
            [utils.asGridCoord(8, 6)]: true,
            [utils.asGridCoord(7, 7)]: true,
            [utils.asGridCoord(8, 7)]: true
        }
    },
    Kitchen: {
        lowerSrc: 'images/maps/KitchenLower.png',
        upperSrc: 'images/maps/KitchenUpper.png',
        gameObjects: {}
    }
}