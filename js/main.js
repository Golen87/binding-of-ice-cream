//  The core game loop

var PhaserGame = function () {

    this.background = null;
    this.foreground = null;

    this.player = null;
    this.cursors = null;
    this.speed = 40;

    this.weapons = [];
    this.currentWeapon = 0;
    this.weaponName = null;

    this.enemyHandler = null;

};

PhaserGame.prototype = {

    init: function () {

        this.game.renderer.renderSession.roundPixels = true;

        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.time.advancedTiming = true;

        this._boundsCache = Phaser.Utils.extend(false, {}, this.game.world.bounds);

    },

    preload: function () {

        this.load.crossOrigin = 'anonymous';

        this.load.image('background', 'img/background.png');
        this.load.spritesheet('player', 'img/front.png', 133, 160);
        this.load.image('heart1', 'img/heart1.png');
        this.load.image('heart2', 'img/heart2.png');

        this.load.bitmapFont('font', 'img/font.png', 'img/font.xml');

        for (var i = 1; i <= 3; i++)
        {
            this.load.image('eraser' + i, 'img/eraser' + i + '.png');
        }

        this.load.spritesheet('greed', 'img/greed.png', 117, 189);
        this.load.spritesheet('gluttony', 'img/gluttony.png', 200, 200);
        this.load.spritesheet('wrath', 'img/wrath.png', 200, 200);
        this.load.spritesheet('lust', 'img/lust.png', 160, 200);
        this.load.spritesheet('sloth', 'img/sloth.png', 195, 125);
        this.load.spritesheet('pride', 'img/pride.png', 160, 160);


        // Particles

        for (var i = 1; i <= 5; i++)
        {
            this.game.load.image('cloud' + i, 'img/cloud' + i + '.png');
        }

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

        //this.player_1 = new Player(this.game, 400, 300);

        this.player = this.add.sprite(400, 300, 'player');
        this.player.hp = 5;

        for (var i = -2; i < 3; i++) {
            var heart = game.make.sprite(40*i, -100, 'heart1');
            heart.anchor.set(0.5, 0.5);
            heart.scale.set(0.25);
            this.player.addChild(heart);
        }
        this.hideHealth();

        this.physics.arcade.enable(this.player);

        this.player.body.collideWorldBounds = true;
        this.player.anchor.set(0.5);
        this.player.yScale = 0.4;
        this.player.scale.set(this.player.yScale);

        this.player.animations.add('left', [1,2,3,4,5,0], 10, true);
        this.player.animations.add('right', [10,11,12,13,14,0], 10, true);
        this.player.animations.add('down', [6,7,6,0,8,9,8,0], 10, true);
        this.player.animations.add('up', [8,9,8,0,6,7,6,0], 10, true);
        //this.player.reset(400, 300);
        //this.player.scale.set(1);

        this.weaponName = this.add.bitmapText(8, 564, 'font', "Binding Of Ice-Ac", 24);

        this.enemyHandler = new EnemyHandler.IceCream(this.game);
        this.enemyHandler.visible = true;

        // spawn enemies regularly
        game.time.events.loop(Phaser.Timer.SECOND * 5, this.spawnEnemy, this);

        // Span only ten enemies
        //game.time.events.repeat(Phaser.Timer.SECOND * 3, 10, this.spawnEnemy, this);

        //  Cursor keys to move + space/mouse to fire
        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

        var changeKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        changeKey.onDown.add(this.nextWeapon, this);

        var spawnKey = this.input.keyboard.addKey(Phaser.Keyboard.C);
        spawnKey.onDown.add(this.spawnEnemy, this);

        // test new features
        var testKey = this.input.keyboard.addKey(Phaser.Keyboard.G);
        testKey.onDown.add(this.testCallback, this);


        // Particles

        emitter = game.add.emitter(0, 0, 100);

        emitter.makeParticles(['cloud1', 'cloud2', 'cloud3', 'cloud4', 'cloud5']);
        emitter.gravity = 0;
        emitter.width = 70;
        emitter.height = 70;
        emitter.minRotation = -20;
        emitter.maxRotation = 20;
        emitter.maxParticleScale = 2.0;
        emitter.minParticleScale = 1.4;
        emitter.setXSpeed(-50, 50);
        emitter.setYSpeed(-50, 50);
        emitter.setScale(1, 0.5, 1, 0.5, 2000);
        emitter.setAlpha(1, 0, 2000);

        //this.game.input.onDown.add(this.particleBurst, this);

    },

    particleBurst: function(pointer) {

        //  Position the emitter where the mouse/touch event was
        emitter.x = pointer.x;
        emitter.y = pointer.y;

        //  The first parameter sets the effect to "explode" which means all particles are emitted at once
        //  The second gives each particle a 2000ms lifespan
        //  The third is ignored when using burst/explode mode
        //  The final parameter (10) is how many particles will be emitted in this single burst
        emitter.start(true, 2000, null, 15);

    },

    testCallback: function() {
        this.hideHealth();
    },

    spawnEnemy: function () {
        this.enemyHandler.spawn(
          this.game.rnd.between(0, 800),
          this.game.rnd.between(0, 600)
        );
    },

    showHealth: function () {
        for (var i = 0; i < this.player.children.length; i++) {
            this.player.children[i].visible = true;
            if (i > this.player.hp - 1)
                this.player.children[i].loadTexture('heart2', 0);
        }
    },

    hideHealth: function () {
        for (var i = 0; i < this.player.children.length; i++) {
            this.player.children[i].visible = false;
        }
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
        if(this._shakeWorldTime > 0) {
          var magnitude = (this._shakeWorldTime / this._shakeWorldMax) * this._shakeWorldMax;
          var x = this.game.rnd.integerInRange(-magnitude, magnitude);
          var y = this.game.rnd.integerInRange(-magnitude, magnitude);

          this.game.camera.x = x;
          this.game.camera.y = y;
          this._shakeWorldTime--;

          if(this._shakeWorldTime <= 0) {
             this.game.world.setBounds(this._boundsCache.x, this._boundsCache.x, this._boundsCache.width, this._boundsCache.height);
          }
          this.shake_required = false;
        }

        var v = this.player.body.velocity;
        this.player.body.velocity.set( v.x/1.2, v.y/1.2 );

        var dv = new Phaser.Point(0,0);
        if (this.cursors.left.isDown || this.input.keyboard.isDown(Phaser.Keyboard.A))
            dv.x -= this.speed;
        if (this.cursors.right.isDown || this.input.keyboard.isDown(Phaser.Keyboard.D))
            dv.x += this.speed;
        if (this.cursors.up.isDown || this.input.keyboard.isDown(Phaser.Keyboard.W))
            dv.y -= this.speed;
        if (this.cursors.down.isDown || this.input.keyboard.isDown(Phaser.Keyboard.S))
            dv.y += this.speed;

        this.player.body.velocity.set(this.player.body.velocity.x + dv.x, this.player.body.velocity.y + dv.y);

        if (dv.x > 0)
            this.player.animations.play('right');
        else if (dv.x < 0)
            this.player.animations.play('left');
        else if (dv.y > 0)
            this.player.animations.play('down');
        else if (dv.y < 0)
            this.player.animations.play('up');
        else
            this.player.animations.stop(null, true);

        // Fire and bouncing animations
        if (game.input.activePointer.isDown && this.player.visible)
            this.weapons[this.currentWeapon].fire(this.player);
        this.player.scale.y = this.player.yScale - (this.player.yScale - this.player.scale.y) * 0.8;
        this.player.anchor.y = (this.player.scale.y / this.player.yScale) * 0.5;

        this.shake_required = this.enemyHandler.playerUpdate(this.player, game, this.weapons[this.currentWeapon].children);
        if (this.shake_required) {
            this.shake();

            this.player.hp -= 1;

            if (this.player.hp <= 0) {
                this.weaponName.text = "Game Over - Space to restart";
                this.player.visible = false;
            }
            else {
                this.showHealth();
                game.time.events.add(Phaser.Timer.SECOND * 1.5, this.hideHealth, this);
            }
        }

    },

    shake: function() {
      this._shakeWorldTime = 20;
      this._shakeWorldMax = 10;
      this.game.world.setBounds(this._boundsCache.x - this._shakeWorldMax, this._boundsCache.y - this._shakeWorldMax, this._boundsCache.width + this._shakeWorldMax, this._boundsCache.height + this._shakeWorldMax);
    },

    render: function() {
       //game.debug.inputInfo(32, 32);
       //game.debug.pointer( game.input.activePointer );
       game.debug.text(game.time.fps, 0, 12, '#ff0000');
    }
};
