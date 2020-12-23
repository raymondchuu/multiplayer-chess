import Piece from './Piece';

export default class Queen extends Piece {
    constructor(player) {
        super(player, player === 1 ? 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg' : 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg');
        this.name = "Queen";
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
            diff % 8 === 0 ||
            diff % 7 === 0 ||
            diff < 8
        );
    }

    getPathIndicies = (initialPos, endPos) => {
        var indicies = [];
        var increment;
        const diff = Math.abs(endPos - initialPos);

        if (diff % 9 === 0) {
            increment = 9;
        }

        else if (diff % 8 === 0) {
            increment = 8;
        }

        else if (diff % 7 === 0) {
            increment = 7;
        }

        else {
            increment = 1;
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