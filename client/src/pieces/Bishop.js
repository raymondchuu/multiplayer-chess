import Piece from './Piece';

export default class Bishop extends Piece {
    constructor(player) {
        super(player, player === 1 ? 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg' : 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg');
        this.name = "Bishop";
        this.hasMoved = false;

    }

    handleMoved() {
        this.hasMoved = true;
    }

    getName = () => {
        return this.name;
    }

    isMoveValid = (initialPos, endPos) => {
        const diff = Math.abs(endPos - initialPos);
        return (
            diff % 9 === 0 ||
            diff % 7 === 0
        );
    }

    getPathIndicies = (initialPos, endPos) => {
        var indicies = [];
        var increment;
        const diff = Math.abs(endPos - initialPos);

        if (diff % 9 === 0) {
            increment = 9
        }

        else if (diff % 7 === 0) {
            increment = 7
        }

        if (endPos > initialPos) {
            for (var i = initialPos + increment; i < endPos; i += increment) {
                indicies.push(i);
            }
        }

        else {
            for (var i = initialPos - increment; i > endPos; i -= increment) {
                indicies.push(i);
            }
        }

        return indicies;
    }
}