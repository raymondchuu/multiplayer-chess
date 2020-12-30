export default class Piece {
    constructor(player, imageURL) {
        this.player = player;
        this.style = { 
            backgroundImage: `url(${imageURL})`, 
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
        };
    }

    testFunction() {
        
    }
}