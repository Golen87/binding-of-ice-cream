
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
        this.animations.add('idle', [0], 1, true);
        this.animations.add('prepare', [1], 1, true);
        this.animations.add('jump', [2], 1, true);
        this.animations.add('fall', [3], 1, true);
        this.animations.add('hurt', [4,5], 16, true);
        this.state = 'idle';
        this.timer = 0;
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
    this.speed = 50;

    if (this.body.sprite.key == "gluttony") {
        this.dx = 2;
        this.dy = 1;
        this.speed = 150;
    }
    else if (this.body.sprite.key == "pride") {
        this.timer = 20;
        this.speed = 150;
        this.state = 'idle';
        this.animations.play('idle');
        this.anchor.set(0.5);
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
        if (this.body.x > game.width - this.body.width * 1.2 && this.dx > 0)
            this.dx *= -1;
        if (this.body.x < this.body.width * 0.5 && this.dx < 0)
            this.dx *= -1;
        if (this.body.y > game.height - this.body.height * 1.8 && this.dy > 0)
            this.dy *= -1;
        if (this.body.y < this.body.height * 0.1 && this.dy < 0)
            this.dy *= -1;

        this.game.physics.arcade.velocityFromAngle(pointAngle(0, 0, this.dx, this.dy), this.speed, this.body.velocity);
        this.rotation += this.dx / 40;
    }
    else if (this.body.sprite.key == "pride") {
        this.timer -= 1;

        if (this.state == "idle") {
            if (this.timer <= 0) {
                this.state = 'prepare';
                this.animations.play('prepare');
                this.timer = 10;
            }
            this.game.physics.arcade.velocityFromAngle(0, 0, this.body.velocity);
        }
        else if (this.state == "prepare") {
            if (this.timer <= 0) {
                this.state = 'jump';
                this.animations.play('jump');
                this.timer = 20;
            }
            this.game.physics.arcade.velocityFromAngle(0, 0, this.body.velocity);
        }
        else if (this.state == "jump") {
            this.anchor.y = 0.5 + 0.4 * Math.pow((20 - this.timer) / 20, 0.5);
            console.log(this.anchor.y);
            if (this.timer <= 0) {
                this.state = 'fall';
                this.animations.play('fall');
                this.timer = 20;
                this.body.enableObstacleCollide = false;
            }
            this.game.physics.arcade.velocityFromAngle(angle, this.speed, this.body.velocity);
        }
        else if (this.state == "fall") {
            this.anchor.y = 0.5 + 0.4 * Math.pow((this.timer) / 20, 0.5);
            console.log(this.anchor.y);
            if (this.timer <= 0) {
                this.state = 'recover';
                this.animations.play('prepare');
                this.timer = 10;
                this.game.physics.arcade.velocityFromAngle(0, 0, this.body.velocity);
                this.anchor.y = 0.5;
            }
            this.game.physics.arcade.velocityFromAngle(angle, this.speed, this.body.velocity);
        }
        else if (this.state == "recover") {
            if (this.timer <= 0) {
                this.state = 'idle';
                this.animations.play('idle');
                this.timer = 30;
            }
            this.game.physics.arcade.velocityFromAngle(0, 0, this.body.velocity);
        }
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
