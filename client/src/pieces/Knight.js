import Piece from './Piece';

export default class Knight extends Piece {
    constructor(player) {
        super(player, player === 1 ? 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg' : 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg');
        this.name = "Knight";
        this.hasMoved = false;

    }

    handleMoved() {
        this.hasMoved = true;
    }

    getName = () => {
        return this.name;
    }

    isMoveValid = (initialPos, endPos) => {
        return (
            initialPos + 17 === endPos ||
            initialPos + 10 === endPos ||
            initialPos + 15 === endPos ||
            initialPos + 6 === endPos ||
            initialPos - 6 === endPos ||
            initialPos - 15 === endPos ||
            initialPos - 10 === endPos || 
            initialPos - 17 === endPos
        )
    }

    getPathIndicies = (initialPos, endPos) => {
        return [];
    }
}