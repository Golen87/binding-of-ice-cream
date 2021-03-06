var EnemyHandler = {};

EnemyHandler.IceCream = function (game) {

    Phaser.Group.call(this, game, game.world, 'Single Enemy', false, true, Phaser.Physics.ARCADE);

    this.shake_required = false;
    this.enemy_hit = false;
    this.award_points = 0;

    // Max limit of 64 enemies
    for (var i = 0; i < 16; i++)
    {
        this.add(new Enemy(game, 'envy'), true);
        this.add(new Enemy(game, 'gluttony'), true);
        this.add(new Enemy(game, 'pride'), true);
        this.add(new Enemy(game, 'wrath'), true);
        this.add(new Enemy(game, 'greed'), true);
        this.add(new Enemy(game, 'lust'), true);
        this.add(new Enemy(game, 'sloth'), true);
    }

    return this;

};

EnemyHandler.IceCream.prototype = Object.create(Phaser.Group.prototype);
EnemyHandler.IceCream.prototype.constructor = EnemyHandler.IceCream;

EnemyHandler.IceCream.prototype.checkAllDead = function () {
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].exists)
            return false;
    }
    return true;
}

EnemyHandler.IceCream.prototype.checkAllAlive = function () {
    for (var i = 0; i < this.children.length; i++) {
        if (!this.children[i].exists)
            return false;
    }
    return true;
}

EnemyHandler.IceCream.prototype.spawn = function (sx, sy) {
    var x = sx;
    var y = sy;

    if (this.checkAllAlive()) return;

    // Find unused enemy and replace with new
    var index = Math.floor(Math.random() * this.children.length);

    while (this.children[index].visible)
        index = Math.floor(Math.random() * this.children.length);

    var newEnemy = this.children[index];
    if (newEnemy)
        newEnemy.spawn(x, y, 0);
};

EnemyHandler.IceCream.prototype.playerUpdate = function (player, game, bullets) {
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].exists)
            this.children[i].playerUpdate(player);
    }

    this.shake_required = false;
    this.enemy_hit = false;
    game.physics.arcade.collide(player, this.children, this.playerCollide, null, this);

    game.physics.arcade.collide(bullets, this.children, this.bulletsCollide, null, this);

    var response = {};
    response.shake_required = this.shake_required;
    response.points = this.award_points
    response.enemy_hit = this.enemy_hit;

    return response
};

EnemyHandler.IceCream.prototype.playerCollide = function (player, enemy) {
  if (player.hp > 0) {
    enemy.kill();
    PhaserGame.prototype.cloudBurst(enemy);
    PhaserGame.prototype.enemyBurst(enemy, enemy.body.sprite.key);
    this.shake_required = true;
  }
};

EnemyHandler.IceCream.prototype.bulletsCollide = function(bullet, enemy) {
    bullet.kill();
    this.award_points += 5;
    this.enemy_hit = true;

    // Always 1, but not for scaling bullet
    var power = bullet.scale.multiply(1/0.4, 1/0.4).x;

    enemy.damage(power);
    if (enemy.hp <= 0) {
        this.award_points += 50;
    }
};
