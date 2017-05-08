var Weapon = {};

////////////////////////////////////////////////////
//  A single bullet is fired in front of the ship //
////////////////////////////////////////////////////

Weapon.SingleBullet = function (game) {

    Phaser.Group.call(this, game, game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 400;
    this.fireRate = 200;

    for (var i = 0; i < 64; i++)
    {
        this.add(new Bullet(game, 'eraser1'), true);
    }

    return this;

};

Weapon.SingleBullet.prototype = Object.create(Phaser.Group.prototype);
Weapon.SingleBullet.prototype.constructor = Weapon.SingleBullet;

Weapon.SingleBullet.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return false; }

    var x = source.x;
    var y = source.y;
    var angle = pointAngle(source.x, source.y, this.game.input.mousePointer.x, this.game.input.mousePointer.y);

    var didShoot = false;
    var b = this.getFirstExists(false);
    if (b) {
        didShoot = true;
        b.fire(x, y, angle, this.bulletSpeed, 0, 0);
    }

    this.nextFire = this.game.time.time + this.fireRate;

    return didShoot;
};

/////////////////////////////////////////////////////////
//  A bullet is shot both in front and behind the ship //
/////////////////////////////////////////////////////////

Weapon.FrontAndBack = function (game) {

    Phaser.Group.call(this, game, game.world, 'Front And Back', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 250;

    for (var i = 0; i < 64; i++)
    {
        this.add(new Bullet(game, 'eraser2'), true);
    }

    return this;

};

Weapon.FrontAndBack.prototype = Object.create(Phaser.Group.prototype);
Weapon.FrontAndBack.prototype.constructor = Weapon.FrontAndBack;

Weapon.FrontAndBack.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x;
    var y = source.y;
    var angle = pointAngle(source.x, source.y, this.game.input.mousePointer.x, this.game.input.mousePointer.y);

    var didShoot = false;
    for (var i = 0; i <= 180; i+=180) {
        var b = this.getFirstExists(false);
        if (b) {
            didShoot = true;
            b.fire(x, y, angle+i, this.bulletSpeed, 0, 0);
        }
    }

    this.nextFire = this.game.time.time + this.fireRate;

    return didShoot;

};

//////////////////////////////////////////////////////
//  3-way Fire (directly above, below and in front) //
//////////////////////////////////////////////////////

Weapon.ThreeWay = function (game) {

    Phaser.Group.call(this, game, game.world, 'Three Way', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 300;

    for (var i = 0; i < 96; i++)
    {
        this.add(new Bullet(game, 'eraser3'), true);
    }

    return this;

};

Weapon.ThreeWay.prototype = Object.create(Phaser.Group.prototype);
Weapon.ThreeWay.prototype.constructor = Weapon.ThreeWay;

Weapon.ThreeWay.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return false; }

    var x = source.x;
    var y = source.y;
    var angle = pointAngle(source.x, source.y, this.game.input.mousePointer.x, this.game.input.mousePointer.y);

    var didShoot = false;
    for (var i = -30; i <= 30; i+=30) {
        var b = this.getFirstExists(false);
        if (b) {
            didShoot = true;
            b.fire(x, y, angle+i, this.bulletSpeed, 0, 0);
        }
    }

    this.nextFire = this.game.time.time + this.fireRate;

    return didShoot;

};

/////////////////////////////////////////////
//  8-way fire, from all sides of the ship //
/////////////////////////////////////////////

Weapon.EightWay = function (game) {

    Phaser.Group.call(this, game, game.world, 'Eight Way', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 350;

    for (var i = 0; i < 96; i++)
    {
        this.add(new Bullet(game, 'eraser1'), true);
    }

    return this;

};

Weapon.EightWay.prototype = Object.create(Phaser.Group.prototype);
Weapon.EightWay.prototype.constructor = Weapon.EightWay;

Weapon.EightWay.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return false; }

    var x = source.x;
    var y = source.y;
    var angle = pointAngle(source.x, source.y, this.game.input.mousePointer.x, this.game.input.mousePointer.y);

    var didShoot = false;
    for (var i = 0; i < 360; i+=45) {
        var b = this.getFirstExists(false);
        if (b) {
            didShoot = true;
            b.fire(x, y, angle+i, this.bulletSpeed, 0, 0);
        }
    }

    this.nextFire = this.game.time.time + this.fireRate;

    return didShoot;

};

////////////////////////////////////////////////////
//  Bullets are fired out scattered on the y axis //
////////////////////////////////////////////////////

Weapon.ScatterShot = function (game) {

    Phaser.Group.call(this, game, game.world, 'Scatter Shot', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 80;

    for (var i = 0; i < 32; i++)
    {
        this.add(new Bullet(game, 'eraser2'), true);
    }

    return this;

};

Weapon.ScatterShot.prototype = Object.create(Phaser.Group.prototype);
Weapon.ScatterShot.prototype.constructor = Weapon.ScatterShot;

Weapon.ScatterShot.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return false; }

    var x = source.x + this.game.rnd.between(-20, 20);
    var y = source.y + this.game.rnd.between(-20, 20);
    var angle = pointAngle(source.x, source.y, this.game.input.mousePointer.x, this.game.input.mousePointer.y);

    var didShoot = false;
    var b = this.getFirstExists(false);
    if (b) {
        didShoot = true;
        b.fire(x, y, angle, this.bulletSpeed, 0, 0);
    }

    this.nextFire = this.game.time.time + this.fireRate;

    return didShoot;

};

//////////////////////////////////////////////////////////////////////////
//  Fires a streaming beam of lazers, very fast, in front of the player //
//////////////////////////////////////////////////////////////////////////

Weapon.Beam = function (game) {

    Phaser.Group.call(this, game, game.world, 'Beam', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 1000;
    this.fireRate = 70;

    for (var i = 0; i < 64; i++)
    {
        this.add(new Bullet(game, 'eraser3'), true);
    }

    return this;

};

Weapon.Beam.prototype = Object.create(Phaser.Group.prototype);
Weapon.Beam.prototype.constructor = Weapon.Beam;

Weapon.Beam.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return false; }

    var x = source.x;
    var y = source.y;
    var angle = pointAngle(source.x, source.y, this.game.input.mousePointer.x, this.game.input.mousePointer.y);

    var didShoot = false;
    var b = this.getFirstExists(false);
    if (b) {
        didShoot = true;
        b.fire(x, y, angle, this.bulletSpeed, 0, 0);
    }

    this.nextFire = this.game.time.time + this.fireRate;

    return didShoot;

};

///////////////////////////////////////////////////////////////////////
//  A three-way fire where the top and bottom bullets bend on a path //
///////////////////////////////////////////////////////////////////////

Weapon.SplitShot = function (game) {

    Phaser.Group.call(this, game, game.world, 'Split Shot', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 700;
    this.fireRate = 150;

    for (var i = 0; i < 64; i++)
    {
        this.add(new Bullet(game, 'eraser1'), true);
    }

    return this;

};

Weapon.SplitShot.prototype = Object.create(Phaser.Group.prototype);
Weapon.SplitShot.prototype.constructor = Weapon.SplitShot;

Weapon.SplitShot.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return false; }

    var x = source.x;
    var y = source.y;
    var angle = pointAngle(source.x, source.y, this.game.input.mousePointer.x, this.game.input.mousePointer.y);

    var didShoot = false;
    for (var i = -500; i <= 500; i+=500) {
        var b = this.getFirstExists(false);
        if (b) {
            didShoot = true;
            b.fire(x, y, angle, this.bulletSpeed, -4*i*Math.sin(angle/180*Math.PI), 4*i*Math.cos(angle/180*Math.PI));
        }
    }

    this.nextFire = this.game.time.time + this.fireRate;

    return didShoot;

};

///////////////////////////////////////////////////////////////////////
//  Bullets have Gravity.y set on a repeating pre-calculated pattern //
///////////////////////////////////////////////////////////////////////

Weapon.Pattern = function (game) {

    Phaser.Group.call(this, game, game.world, 'Pattern', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 60;

    this.pattern = Phaser.ArrayUtils.numberArrayStep(-800, 800, 200);
    this.pattern = this.pattern.concat(Phaser.ArrayUtils.numberArrayStep(800, -800, -200));

    this.patternIndex = 0;

    for (var i = 0; i < 64; i++)
    {
        this.add(new Bullet(game, 'eraser2'), true);
    }

    return this;

};

Weapon.Pattern.prototype = Object.create(Phaser.Group.prototype);
Weapon.Pattern.prototype.constructor = Weapon.Pattern;

Weapon.Pattern.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return false; }

    var x = source.x;
    var y = source.y;
    var angle = pointAngle(source.x, source.y, this.game.input.mousePointer.x, this.game.input.mousePointer.y);

    var didShoot = false;
    var b = this.getFirstExists(false);
    if (b) {
        didShoot = true;
        this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed, -2*this.pattern[this.patternIndex]*Math.sin(angle/180*Math.PI), 2*this.pattern[this.patternIndex]*Math.cos(angle/180*Math.PI));
    }

    this.patternIndex++;

    if (this.patternIndex === this.pattern.length)
    {
        this.patternIndex = 0;
    }

    this.nextFire = this.game.time.time + this.fireRate;

    return didShoot;

};

///////////////////////////////////////////////////////////////////
//  Rockets that visually track the direction they're heading in //
///////////////////////////////////////////////////////////////////

Weapon.Rockets = function (game) {

    Phaser.Group.call(this, game, game.world, 'Rockets', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 400;
    this.fireRate = 250;

    for (var i = 0; i < 32; i++)
    {
        this.add(new Bullet(game, 'eraser3'), true);
    }

    this.setAll('tracking', true);

    return this;

};

Weapon.Rockets.prototype = Object.create(Phaser.Group.prototype);
Weapon.Rockets.prototype.constructor = Weapon.Rockets;

Weapon.Rockets.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return false; }

    var x = source.x;
    var y = source.y;
    var angle = pointAngle(source.x, source.y, this.game.input.mousePointer.x, this.game.input.mousePointer.y);

    var didShoot = false;
    for (var i = -800; i <= 800; i+=400) {
        var b = this.getFirstExists(false);
        if (b) {
            didShoot = true;
            b.fire(x, y, angle, this.bulletSpeed, -i*Math.sin(angle/180*Math.PI), i*Math.cos(angle/180*Math.PI));
        }
    }

    this.nextFire = this.game.time.time + this.fireRate;

    return didShoot;

};

////////////////////////////////////////////////////////////////////////
//  A single bullet that scales in size as it moves across the screen //
////////////////////////////////////////////////////////////////////////

Weapon.ScaleBullet = function (game) {

    Phaser.Group.call(this, game, game.world, 'Scale Bullet', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 800;
    this.fireRate = 100;

    for (var i = 0; i < 32; i++)
    {
        this.add(new Bullet(game, 'eraser1'), true);
    }

    this.setAll('scaleSpeed', 0.05);

    return this;

};

Weapon.ScaleBullet.prototype = Object.create(Phaser.Group.prototype);
Weapon.ScaleBullet.prototype.constructor = Weapon.ScaleBullet;

Weapon.ScaleBullet.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return false; }

    var x = source.x;
    var y = source.y;
    var angle = pointAngle(source.x, source.y, this.game.input.mousePointer.x, this.game.input.mousePointer.y);

    var didShoot = false;
    var b = this.getFirstExists(false);
    if (b) {
        didShoot = true;
        b.fire(x, y, angle, this.bulletSpeed, 0, 0);
    }

    this.nextFire = this.game.time.time + this.fireRate;

    return didShoot;

};

/////////////////////////////////////////////
//  A Weapon Combo - Single Shot + Rockets //
/////////////////////////////////////////////

Weapon.Combo1 = function (game) {

    this.name = "Combo One";
    this.weapon1 = new Weapon.SingleBullet(game);
    this.weapon2 = new Weapon.Rockets(game);

};

Weapon.Combo1.prototype.reset = function () {

    this.weapon1.visible = false;
    this.weapon1.callAll('reset', null, 0, 0);
    this.weapon1.setAll('exists', false);

    this.weapon2.visible = false;
    this.weapon2.callAll('reset', null, 0, 0);
    this.weapon2.setAll('exists', false);

};

Weapon.Combo1.prototype.fire = function (source) {

    var didShoot = false;

    if (this.weapon1.fire(source))
        didShoot = true;
    if (this.weapon2.fire(source))
        didShoot = true;

    return didShoot;
};

/////////////////////////////////////////////////////
//  A Weapon Combo - ThreeWay, Pattern and Rockets //
/////////////////////////////////////////////////////

Weapon.Combo2 = function (game) {

    this.name = "Combo Two";
    this.weapon1 = new Weapon.Pattern(game);
    this.weapon2 = new Weapon.ThreeWay(game);
    this.weapon3 = new Weapon.Rockets(game);

};

Weapon.Combo2.prototype.reset = function () {

    this.weapon1.visible = false;
    this.weapon1.callAll('reset', null, 0, 0);
    this.weapon1.setAll('exists', false);

    this.weapon2.visible = false;
    this.weapon2.callAll('reset', null, 0, 0);
    this.weapon2.setAll('exists', false);

    this.weapon3.visible = false;
    this.weapon3.callAll('reset', null, 0, 0);
    this.weapon3.setAll('exists', false);

};

Weapon.Combo2.prototype.fire = function (source) {

    var didShoot = false;

    if (this.weapon1.fire(source))
        didShoot = true;
    if (this.weapon2.fire(source))
        didShoot = true;
    if (this.weapon3.fire(source))
        didShoot = true;

    return didShoot;

};

