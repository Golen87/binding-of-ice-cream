//  The core game loop

var PhaserGame = function () {

    this.background = null;
    this.foreground = null;

    this.player = null;
    this.cursors = null;
    this.speed = 300;

    this.weapons = [];
    this.currentWeapon = 0;
    this.weaponName = null;

    this.enemyHandler = null;

};

PhaserGame.prototype = {

    init: function () {

        this.game.renderer.renderSession.roundPixels = true;

        this.physics.startSystem(Phaser.Physics.ARCADE);

    },

    preload: function () {

        //  We need this because the steal_like_an_artist/assets are on Amazon S3
        //  Remove the next 2 lines if running locally
        // this.load.baseURL = 'http://files.phaser.io.s3.amazonaws.com/codingtips/issue007/';
        this.load.crossOrigin = 'anonymous';

        this.load.image('background', 'img/background.png');
        this.load.image('foreground', 'steal_like_an_artist/assets/fore.png');
        this.load.spritesheet('player', 'img/front.png', 133, 160);
        this.load.bitmapFont('shmupfont', 'steal_like_an_artist/assets/shmupfont.png', 'steal_like_an_artist/assets/shmupfont.xml');

        for (var i = 1; i <= 11; i++)
        {
            this.load.image('bullet' + i, 'steal_like_an_artist/assets/bullet' + i + '.png');
        }

        this.load.image('enemy', 'img/enemy.png');

        //  Note: Graphics are not for use in any commercial project

    },

    create: function () {

        this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');

        this.weapons.push(new Weapon.SingleBullet(this.game));
        this.weapons.push(new Weapon.FrontAndBack(this.game));
        this.weapons.push(new Weapon.ThreeWay(this.game));
        this.weapons.push(new Weapon.EightWay(this.game));
        this.weapons.push(new Weapon.ScatterShot(this.game));
        this.weapons.push(new Weapon.Beam(this.game));
        this.weapons.push(new Weapon.SplitShot(this.game));
        this.weapons.push(new Weapon.Pattern(this.game));
        this.weapons.push(new Weapon.Rockets(this.game));
        this.weapons.push(new Weapon.ScaleBullet(this.game));
        this.weapons.push(new Weapon.Combo1(this.game));
        this.weapons.push(new Weapon.Combo2(this.game));

        this.currentWeapon = 0;

        for (var i = 1; i < this.weapons.length; i++)
        {
            this.weapons[i].visible = false;
        }

        //this.player = new Player(this.game, 400, 300);

        this.player = this.add.sprite(400, 300, 'player');

        this.physics.arcade.enable(this.player);

        this.player.body.collideWorldBounds = true;
        //this.player.anchor.set(0.5);
        this.player.scale.x = 0.6;
        this.player.scale.y = 0.6;

        this.player.animations.add('left', [0, 1, 2, 3, 4, 5]);
        //this.player.reset(400, 300);
        //this.player.scale.set(1);

        this.weaponName = this.add.bitmapText(8, 564, 'shmupfont', "Binding of ice-ac", 24);

        this.enemyHandler = new EnemyHandler.IceCream(this.game);
        this.enemyHandler.visible = true;

        //  Cursor keys to fly + space to fire
        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

        var changeKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        changeKey.onDown.add(this.nextWeapon, this);

        var spawnKey = this.input.keyboard.addKey(Phaser.Keyboard.C);
        spawnKey.onDown.add(this.spawnEnemy, this);

    },

    spawnEnemy: function () {
        this.enemyHandler.spawn(100, 100);
    },

    nextWeapon: function () {

        //  Tidy-up the current weapon
        if (this.currentWeapon > 9)
        {
            this.weapons[this.currentWeapon].reset();
        }
        else
        {
            this.weapons[this.currentWeapon].visible = false;
            this.weapons[this.currentWeapon].callAll('reset', null, 0, 0);
            this.weapons[this.currentWeapon].setAll('exists', false);
        }

        //  Activate the new one
        this.currentWeapon++;

        if (this.currentWeapon === this.weapons.length)
        {
            this.currentWeapon = 0;
        }

        this.weapons[this.currentWeapon].visible = true;

        this.weaponName.text = this.weapons[this.currentWeapon].name;

    },

    update: function () {

        this.player.body.velocity.set(0);
        //this.player.rotation = this.physics.arcade.angleToPointer(this.player);

        if (this.cursors.left.isDown || this.input.keyboard.isDown(Phaser.Keyboard.A)) {
            this.player.body.velocity.x -= this.speed;
            this.player.animations.play('left', 10, true);
        }
        if (this.cursors.right.isDown || this.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.player.body.velocity.x += this.speed;
            this.player.animations.play('left', 10, true);
        }
        if (this.cursors.up.isDown || this.input.keyboard.isDown(Phaser.Keyboard.W)) {
            this.player.body.velocity.y -= this.speed;
            this.player.animations.play('left', 10, true);
        }
        if (this.cursors.down.isDown || this.input.keyboard.isDown(Phaser.Keyboard.S)) {
            this.player.body.velocity.y += this.speed;
            this.player.animations.play('left', 10, true);
        }

        if (this.player.body.velocity.x == 0 && this.player.body.velocity.y == 0)
            this.player.animations.stop(null, true);

        if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || game.input.activePointer.isDown)
            this.weapons[this.currentWeapon].fire(this.player);

        this.enemyHandler.playerUpdate(this.player, game);

    }
};
