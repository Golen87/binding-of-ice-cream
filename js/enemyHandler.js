var EnemyHandler = {};

////////////////////////////////////////////////////
//  A single enemy is spawned in front of the ship //
////////////////////////////////////////////////////

EnemyHandler.IceCream = function (game) {

    Phaser.Group.call(this, game, game.world, 'Single Enemy', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.enemySpeed = 100;

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

    this.getFirstExists(false).spawn(x, y, 0, this.enemySpeed, 0, 0);
};
