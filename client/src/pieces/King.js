import Piece from './Piece';

export default class King extends Piece {
    constructor(player) {
        super(player, (player === 1 ? 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg' : 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg'));
        this.hasMoved = false;
        this.name = "King";
    }

    handleMoved() {
        this.hasMoved = true;
    }

    moved() {
        return this.hasMoved;
    }

    isMoveValid = (initialPos, endPos) => {
        if (initialPos + 1 === endPos || 
            initialPos - 1 === endPos || 
            initialPos + 7 === endPos || 
            initialPos + 8 === endPos || 
            initialPos + 9 === endPos || 
            initialPos - 9 === endPos || 
            initialPos - 8 === endPos || 
            initialPos - 7 === endPos ) {
            
                return true;
        }
    }

    getPathIndicies = (initialPos, endPos) => {
        return[];
    }

    getName = () => {
        return this.name;
    }
}