var EnemyHandler = {};

////////////////////////////////////////////////////
//  A single enemy is spawned in front of the ship //
////////////////////////////////////////////////////

EnemyHandler.IceCream = function (game) {

    Phaser.Group.call(this, game, game.world, 'Single Enemy', false, true, Phaser.Physics.ARCADE);

    this.enemySpeed = 50;

    // Max limit of 64 enemies
    for (var i = 0; i < 64; i++)
    {
        this.add(new Enemy(game, 'enemy'), true);
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

EnemyHandler.IceCream.prototype.damage = function (game) {
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].exists)
            this.children[i].damage(game);
    }
};

function playerCollide(player, enemy) {
  console.log('enemyHandler->playerCollide: OUCH');
  enemy.kill();
};

function bulletsCollide(bullet, enemy) {
  console.log('enemyHandler->bulletsCollide: PEW PEW PEW');
  bullet.kill();

  //enemy.damage(); <-- not working, wtf?
  if (! enemy.damageAnimation) {
    enemy.health -= 1;
    enemy.damageAnimation = true;
    enemy.animations.play('hurt');
    game.time.events.add(Phaser.Timer.SECOND * 0.5, enemy.recover, enemy);
  }

  if (enemy.health < 0) {
    enemy.kill();
  }
};
