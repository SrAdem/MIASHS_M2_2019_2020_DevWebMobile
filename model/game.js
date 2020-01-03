class Game {
    constructor(room, player) {
        this.room = room;
        this.firstPlayer = player;
    }

    setfirstPlayer(player) {
        this.firstPlayer = player;
    }

    setSecondPlayer(player) {
        this.secondPlayer = player;
    }
}

module.exports = Game;
