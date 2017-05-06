var EnemyHandler = {};

////////////////////////////////////////////////////
//  A single enemy is spawned in front of the ship //
////////////////////////////////////////////////////

EnemyHandler.IceCream = function (game) {

    Phaser.Group.call(this, game, game.world, 'Single Enemy', false, true, Phaser.Physics.ARCADE);

    this.enemySpeed = 50;

    // Max limit of 64 enemies
    for (var i = 0; i < 16; i++)
    {
        this.add(new Enemy(game, 'gluttony'), true);
        this.add(new Enemy(game, 'wrath'), true);
        this.add(new Enemy(game, 'greed'), true);
    }

    return this;

};

EnemyHandler.IceCream.prototype = Object.create(Phaser.Group.prototype);
EnemyHandler.IceCream.prototype.constructor = EnemyHandler.IceCream;

EnemyHandler.IceCream.prototype.spawn = function (sx, sy) {
    var x = sx;
    var y = sy;

    // Find unused enemy and replace with new
    var newEnemy = this.getFirstExists(false);
    if (newEnemy)
        newEnemy.spawn(x, y, 0, this.enemySpeed);
};

EnemyHandler.IceCream.prototype.playerUpdate = function (player, game, bullets) {
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].exists)
            this.children[i].playerUpdate(player);
    }

    game.physics.arcade.collide(player, this.children, playerCollide);

    game.physics.arcade.collide(bullets, this.children, bulletsCollide);
};

function playerCollide(player, enemy) {
  console.log('enemyHandler->playerCollide: OUCH');
  enemy.kill();
};

function bulletsCollide(bullet, enemy) {
    bullet.kill();

    enemy.damage();
};
