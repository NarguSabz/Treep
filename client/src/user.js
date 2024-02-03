import Player from "./player"

class User {
    constructor(username, lastAccess, player) {
        this.username = username;
        this.lastAccess = Date.parse(lastAccess);
        this.player = new Player(player);
    }
}
export default User;
