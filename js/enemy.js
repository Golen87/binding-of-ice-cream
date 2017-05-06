
var Enemy = function (game, key) {

    Phaser.Sprite.call(this, game, 0, 0, key);

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

    this.anchor.set(0.5);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;

    this.tracking = false;
    this.scaleSpeed = 0;

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.spawn = function (x, y, angle, speed) {

    this.reset(x, y);
    this.scale.set(1);

    this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);

    this.angle = angle;
    this.speed = speed;

};

Enemy.prototype.update = function () {

};

Enemy.prototype.playerUpdate = function (player) {

    var angle = pointAngle(this.x, this.y, player.x, player.y);

    this.game.physics.arcade.velocityFromAngle(angle, this.speed, this.body.velocity);

};
