var EnemyHandler = {};

////////////////////////////////////////////////////
//  A single enemy is spawned in front of the ship //
////////////////////////////////////////////////////

EnemyHandler.IceCream = function (game) {

    Phaser.Group.call(this, game, game.world, 'Single Enemy', false, true, Phaser.Physics.ARCADE);

    this.enemySpeed = 100;

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

EnemyHandler.IceCream.prototype.playerUpdate = function (player) {
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].exists)
            this.children[i].playerUpdate(player);
    }

};
