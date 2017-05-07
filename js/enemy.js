
var Enemy = function (game, key) {

    Phaser.Sprite.call(this, game, 0, 0, key);

    //this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

    this.anchor.set(0.5);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;

    this.tracking = false;
    this.scaleSpeed = 0;

    if (key == "pride") {
        this.animations.add('idle', [0,1,2,3], 6, true);
        this.animations.add('hurt', [4,5], 16, true);
    }
    else {
        this.animations.add('idle', [0,1], 4, true);
        this.animations.add('hurt', [2,3], 16, true);
    }

    this.animations.play('idle');

    this.hp = 10;
    this.damageAnimation = false;

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.spawn = function (x, y, angle, speed) {

    this.hp = 10;

    this.reset(x, y);
    this.scale.set(0.6);
    if (this.key == "sloth" || this.key == "wrath" || this.key == "gluttony")
        this.scale.set(0.5);

    this.angle = angle;
    this.speed = speed;

    if (this.body.sprite.key == "gluttony") {
        this.dx = 2;
        this.dy = 1;
        //this.game.physics.arcade.velocityFromAngle(pointAngle(0,0,2,1), speed, this.body.velocity);
    }
    else {
        this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);
    }

    PhaserGame.prototype.particleBurst(this);

};

Enemy.prototype.recover = function () {
    this.damageAnimation = false;
    this.animations.play('idle');
};

Enemy.prototype.playerUpdate = function (player) {

    var angle = pointAngle(this.x, this.y, player.x, player.y);

    if (this.body.sprite.key == "gluttony") {
        this.body.x += this.dx;
        this.body.y += this.dy;
        if (this.body.x > game.width - this.body.width * 1.2 && this.dx > 0)
            this.dx *= -1;
        if (this.body.x < this.body.width * 0.5 && this.dx < 0)
            this.dx *= -1;
        if (this.body.y > game.height - this.body.height * 1.8 && this.dy > 0)
            this.dy *= -1;
        if (this.body.y < this.body.height * 0.1 && this.dy < 0)
            this.dy *= -1;

        this.rotation += this.dx / 40;
    }
    else {
        this.game.physics.arcade.velocityFromAngle(angle, this.speed, this.body.velocity);
    }

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
        PhaserGame.prototype.particleBurst(this);
    }

};
