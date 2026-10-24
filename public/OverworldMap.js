import utils from './utils.js';

export default class OverworldMap {
    constructor(config) {
        this.items = config.items || {};
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

    addItem(id, x, y) {
        this.items[`${ x },${ y }`] = {
            id,
            exists: true
        };
    }
    removeItem(id) {
        const item = Object.values(this.items).find(item => item.id === id);
        const { x, y } = item;
        delete this.items[`${ x },${ y }`];
        delete this.gameObjects[this.items[`${ x },${ y }`].id];

    }
    collectItem(wasX, wasY, direction) {
        const { x, y } = utils.nextPosition(wasX, wasY, direction);
        const id = this.items[`${ x },${ y }`]?.id;
        delete this.items[`${ x },${ y }`];
        delete this.gameObjects[id];
        
        return id;
    }
    hasItem(currentX, currentY, direction) {
        const { x, y } = utils.nextPosition(currentX, currentY, direction);

        return this.items[`${ x },${ y }`]?.exists || false;
    }
}

export const OverworldMaps = {
    DemoRoom: {
        lowerSrc: 'images/maps/cefetlandia.png',
        upperSrc: '',
        gameObjects: {},
        items: {},
        walls: {
            [utils.asGridCoord(0, 3)]: true,
            [utils.asGridCoord(0, 4)]: true,
            [utils.asGridCoord(0, 5)]: true,
            [utils.asGridCoord(0, 6)]: true,
            [utils.asGridCoord(0, 7)]: true,
            [utils.asGridCoord(0, 8)]: true,
            [utils.asGridCoord(0, 9)]: true,
            [utils.asGridCoord(0, 10)]: true,
            [utils.asGridCoord(0, 11)]: true,
            [utils.asGridCoord(0, 12)]: true,
            [utils.asGridCoord(0, 13)]: true,
            [utils.asGridCoord(0, 14)]: true,
            [utils.asGridCoord(0, 15)]: true,

            [utils.asGridCoord(1, 3)]: true,
            [utils.asGridCoord(1, 4)]: true,
            [utils.asGridCoord(1, 5)]: true,
            [utils.asGridCoord(1, 6)]: true,
            [utils.asGridCoord(1, 7)]: true,
            [utils.asGridCoord(1, 8)]: true,
            [utils.asGridCoord(1, 9)]: true,
            [utils.asGridCoord(1, 10)]: true,
            [utils.asGridCoord(1, 11)]: true,
            [utils.asGridCoord(1, 12)]: true,
            [utils.asGridCoord(1, 13)]: true,
            [utils.asGridCoord(1, 14)]: true,
            [utils.asGridCoord(1, 15)]: true,

            [utils.asGridCoord(2, 3)]: true,
            [utils.asGridCoord(2, 4)]: true,
            [utils.asGridCoord(2, 5)]: true,
            [utils.asGridCoord(2, 6)]: true,
            [utils.asGridCoord(2, 7)]: true,
            [utils.asGridCoord(2, 15)]: true,

            [utils.asGridCoord(3, 3)]: true,
            [utils.asGridCoord(3, 4)]: true,
            [utils.asGridCoord(3, 5)]: true,
            [utils.asGridCoord(3, 6)]: true,
            [utils.asGridCoord(3, 7)]: true,
            [utils.asGridCoord(3, 15)]: true,

            [utils.asGridCoord(4, 1)]: true,
            [utils.asGridCoord(4, 2)]: true,
            [utils.asGridCoord(4, 3)]: true,
            [utils.asGridCoord(4, 4)]: true,
            [utils.asGridCoord(4, 5)]: true,
            [utils.asGridCoord(4, 15)]: true,
            
            [utils.asGridCoord(5, 1)]: true,
            [utils.asGridCoord(5, 2)]: true,
            [utils.asGridCoord(5, 3)]: true,
            [utils.asGridCoord(5, 4)]: true,
            [utils.asGridCoord(5, 5)]: true,
            [utils.asGridCoord(5, 15)]: true,
            
            [utils.asGridCoord(5, 1)]: true,
            [utils.asGridCoord(5, 2)]: true,
            [utils.asGridCoord(5, 3)]: true,
            [utils.asGridCoord(5, 4)]: true,
            [utils.asGridCoord(5, 5)]: true,
            [utils.asGridCoord(5, 15)]: true,
            
            [utils.asGridCoord(6, 1)]: true,
            [utils.asGridCoord(6, 2)]: true,
            [utils.asGridCoord(6, 3)]: true,
            [utils.asGridCoord(6, 4)]: true,
            [utils.asGridCoord(6, 5)]: true,
            [utils.asGridCoord(6, 15)]: true,
            
            [utils.asGridCoord(7, 1)]: true,
            [utils.asGridCoord(7, 2)]: true,
            [utils.asGridCoord(7, 3)]: true,
            [utils.asGridCoord(7, 4)]: true,
            [utils.asGridCoord(7, 5)]: true,
            [utils.asGridCoord(7, 8)]: true,
            [utils.asGridCoord(7, 9)]: true,
            [utils.asGridCoord(7, 10)]: true,
            [utils.asGridCoord(7, 15)]: true,

            [utils.asGridCoord(8, 1)]: true,
            [utils.asGridCoord(8, 2)]: true,
            [utils.asGridCoord(8, 3)]: true,
            [utils.asGridCoord(8, 4)]: true,
            [utils.asGridCoord(8, 5)]: true,
            [utils.asGridCoord(8, 8)]: true,
            [utils.asGridCoord(8, 9)]: true,
            [utils.asGridCoord(8, 10)]: true,
            [utils.asGridCoord(8, 15)]: true,

            [utils.asGridCoord(9, 1)]: true,
            [utils.asGridCoord(9, 2)]: true,
            [utils.asGridCoord(9, 3)]: true,
            [utils.asGridCoord(9, 4)]: true,
            [utils.asGridCoord(9, 5)]: true,
            [utils.asGridCoord(9, 15)]: true,
            
            [utils.asGridCoord(10, 1)]: true,
            [utils.asGridCoord(10, 2)]: true,
            [utils.asGridCoord(10, 3)]: true,
            [utils.asGridCoord(10, 4)]: true,
            [utils.asGridCoord(10, 5)]: true,
            [utils.asGridCoord(10, 15)]: true,

            [utils.asGridCoord(11, 2)]: true,
            [utils.asGridCoord(11, 3)]: true,
            [utils.asGridCoord(11, 4)]: true,
            [utils.asGridCoord(11, 5)]: true,
            [utils.asGridCoord(11, 6)]: true,
            [utils.asGridCoord(11, 15)]: true,

            [utils.asGridCoord(12, 2)]: true,
            [utils.asGridCoord(12, 3)]: true,
            [utils.asGridCoord(12, 4)]: true,
            [utils.asGridCoord(12, 5)]: true,
            [utils.asGridCoord(12, 6)]: true,
            [utils.asGridCoord(12, 15)]: true,

            [utils.asGridCoord(13, 2)]: true,
            [utils.asGridCoord(13, 3)]: true,
            [utils.asGridCoord(13, 4)]: true,
            [utils.asGridCoord(13, 5)]: true,
            [utils.asGridCoord(13, 6)]: true,
            [utils.asGridCoord(13, 15)]: true,

            [utils.asGridCoord(14, 2)]: true,
            [utils.asGridCoord(15, 3)]: true,
            [utils.asGridCoord(15, 4)]: true,
            [utils.asGridCoord(15, 5)]: true,
            [utils.asGridCoord(15, 6)]: true,
            [utils.asGridCoord(15, 7)]: true,
            [utils.asGridCoord(15, 8)]: true,
            [utils.asGridCoord(15, 9)]: true,
            [utils.asGridCoord(15, 10)]: true,
            [utils.asGridCoord(15, 11)]: true,
            [utils.asGridCoord(15, 12)]: true,
            [utils.asGridCoord(15, 13)]: true,
            [utils.asGridCoord(15, 14)]: true,
            [utils.asGridCoord(15, 15)]: true,

            [utils.asGridCoord(14, 2)]: true,
            [utils.asGridCoord(14, 3)]: true,
            [utils.asGridCoord(14, 4)]: true,
            [utils.asGridCoord(14, 5)]: true,
            [utils.asGridCoord(14, 6)]: true,
            [utils.asGridCoord(14, 7)]: true,
            [utils.asGridCoord(14, 8)]: true,
            [utils.asGridCoord(14, 9)]: true,
            [utils.asGridCoord(14, 10)]: true,
            [utils.asGridCoord(14, 11)]: true,
            [utils.asGridCoord(14, 12)]: true,
            [utils.asGridCoord(14, 13)]: true,
            [utils.asGridCoord(14, 14)]: true,
            [utils.asGridCoord(14, 15)]: true,
        
        },
        
    }
}