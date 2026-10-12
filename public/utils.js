export default {
    withGrid(n) {
        return n * 16;
    },

    asGridCoord(x, y) {
        return `${ x * 16 },${ y * 16 }`;
    },

    nextPosition(initialX, initialY, direction) {
        const position = { x: initialX, y: initialY }
        const tileSize = 16;
        
        const directionUpdate = {
            'up': ['y', -1],
            'down': ['y', 1],
            'left': ['x', -1],
            'right': ['x', 1]
        };

        const [axis, change] = directionUpdate[direction];
        position[axis] += tileSize * change;

        return position;
    }
}