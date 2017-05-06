
var Enemy = function (game, key) {

    Phaser.Sprite.call(this, game, 0, 0, key);

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

    this.anchor.set(0.5);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;

    this.tracking = false;
    this.scaleSpeed = 0;

    this.animations.add('idle', [0,1], 4, true);
    this.animations.add('hurt', [2,3], 16, true);

    this.animations.play('idle');

    this.hp = 10;
    this.damageAnimation = false;

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.spawn = function (x, y, angle, speed) {

    this.hp = 10;

    this.reset(x, y);
    this.scale.set(0.5);

    this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);

    this.angle = angle;
    this.speed = speed;

};

Enemy.prototype.recover = function () {
    this.damageAnimation = false;
    this.animations.play('idle');
};

Enemy.prototype.update = function () {
    //this.rotation += 0.03;
};

Enemy.prototype.playerUpdate = function (player) {

    var angle = pointAngle(this.x, this.y, player.x, player.y);

    this.game.physics.arcade.velocityFromAngle(angle, this.speed, this.body.velocity);

};

Enemy.prototype.damage = function () {

    this.hp -= 1;

    if (! this.damageAnimation) {
        this.damageAnimation = true;

        this.animations.play('hurt');

        game.time.events.add(Phaser.Timer.SECOND * 0.5, this.recover, this);
    }

    if (this.hp < 0) {
        this.kill();
    }

};
