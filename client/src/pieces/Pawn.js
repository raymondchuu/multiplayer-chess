import Piece from './Piece';

export default class Pawn extends Piece {
    constructor(player) {
        super(player, player === 1 ? 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg' : 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg');
        this.initialPositions = {
            1: [48, 49, 50, 51, 52, 53, 54, 55],
            2: [8, 9, 10, 11, 12, 13, 14, 15]
        }

        this.name = "Pawn";
        this.hasMoved = false;
        this.doubleJump = false;
    }

    handleMoved() {
        this.hasMoved = true;
    }

    getName = () => {
        return this.name;
    }

    isMoveValid = (initialPos, endPos, endPosOccupied) => {
        if (this.player === 1) {
            if ((endPos === initialPos - 8 && !endPosOccupied) ) {
                return true;
            }
            else if (endPos === initialPos - 16 && this.initialPositions[1].indexOf(initialPos) >= 0 && !endPosOccupied) {
                this.doubleJump = true;
                return true;
            }
            else if ((endPos === initialPos - 7 || endPos === initialPos - 9) && endPosOccupied) {
                return true;
            }
        }

        else {
            if (endPos === initialPos + 8 && !endPosOccupied) {
                return true;
            }
            else if (endPos === initialPos + 16 && this.initialPositions[2].indexOf(initialPos) >= 0) {
                this.doubleJump = true;
                return true;
            }
            else if ((endPos === initialPos + 7 || endPos === initialPos + 9) && endPosOccupied) {
                return true;
            }
        }
    }

    getPathIndicies = (initialPos, endPos) => {
        var indicies = [];

        if (endPos - initialPos === 16) {
            indicies.push(initialPos + 8);
        }

        else if (initialPos - endPos === 16) {
            indicies.push(initialPos - 8);
        }
        
        return indicies;
    }
    
}