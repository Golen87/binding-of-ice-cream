
var Player = function (game, x, y) {

    Phaser.Sprite.call(this, game, x, y, "player");

    this.anchor.set(0.5);
    console.log("Hello", this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function () {
    console.log("Test");
};

Player.prototype.playerUpdate = function (player) {

    var angle = pointAngle(this.x, this.y, player.x, player.y);

    this.game.physics.arcade.velocityFromAngle(angle, this.speed, this.body.velocity);

};
