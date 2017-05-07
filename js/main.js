//  The core game loop

var START_TEXT = "Binding Of Ice-Ac";
var GAMEOVER_TEXT = "Game Over - [Space] to restart";

var PhaserGame = function () {

    this.background = null;
    this.foreground = null;

    this.high_score = 0;

    this.player = null;
    this.cursors = null;
    this.speed = 40;

    this.weapons = [];
    this.currentWeapon = 0;
    this.weaponName = null;
    this.scoreInfo = null;
    this.highScoreInfo = null;

    this.enemyHandler = null;

    this.sounds = {};

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
        this.load.spritesheet('envy', 'img/envy.png', 180, 160);


        // Particles

        for (var i = 1; i <= 5; i++)
        {
            this.game.load.image('cloud' + i, 'img/cloud' + i + '.png');
        }

        this.game.load.image('bubble', 'img/particles/bubble.png')
        this.game.load.image('cherry', 'img/particles/cherry.png')
        this.game.load.image('cone', 'img/particles/cone.png')
        this.game.load.image('dorito', 'img/particles/dorito.png')
        this.game.load.image('ice', 'img/particles/ice.png')
        this.game.load.image('sprinkle1', 'img/particles/sprinkle1.png')
        this.game.load.image('sprinkle2', 'img/particles/sprinkle2.png')
        this.game.load.image('sprinkle3', 'img/particles/sprinkle3.png')
        this.game.load.image('sprinkle4', 'img/particles/sprinkle4.png')
        this.game.load.image('sprinkle5', 'img/particles/sprinkle5.png')
        this.game.load.image('sprinkle6', 'img/particles/sprinkle6.png')
        this.game.load.image('stick', 'img/particles/stick.png')


        // google web font loader
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

        // sounds
        game.load.audio('pew', 'sounds/pew.ogg');
        game.load.audio('octave', 'sounds/octave.ogg');
        game.load.audio('lazer', 'sounds/lazer.ogg');
        game.load.audio('select', 'sounds/select.ogg');
        game.load.audio('nu', 'sounds/nu.ogg');

        // music theme
        game.load.audio('music', ['sounds/music.ogg', 'sounds/music.ogg']);

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

        this.player = this.add.sprite(400, 300, 'player');
        this.player.hp = 3;
        this.player.score = 0;

        for (var i = -1; i < 2; i++) {
            var heart = game.make.sprite(60*i, -110, 'heart1');
            heart.anchor.set(0.5, 0.5);
            heart.scale.set(0.375);
            this.player.addChild(heart);
        }
        this.hideHealth();

        this.physics.arcade.enable(this.player);

        this.player.body.collideWorldBounds = true;
        this.player.anchor.set(0.5);
        this.player.yScale = 0.4;
        this.player.scale.set(this.player.yScale);

        this.player.animations.add('idle', [0], 1, true);
        this.player.animations.add('left', [1,2,3,4,5,0], 10, true);
        this.player.animations.add('right', [10,11,12,13,14,0], 10, true);
        this.player.animations.add('down', [6,7,6,0,8,9,8,0], 10, true);
        this.player.animations.add('up', [8,9,8,0,6,7,6,0], 10, true);
        //this.player.reset(400, 300);
        //this.player.scale.set(1);

        this.weaponName = this.add.bitmapText(8, 564, 'font', START_TEXT, 24);

        this.enemyHandler = new EnemyHandler.IceCream(this.game);
        this.enemyHandler.visible = true;

        // spawn enemies regularly
        //game.time.events.loop(Phaser.Timer.SECOND * 5, this.spawnEnemy, this);

        // Span only ten enemies
        //game.time.events.repeat(Phaser.Timer.SECOND * 3, 10, this.spawnEnemy, this);

        this.spawnTimer = 0;
        this.spawnCount = 0.9;

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

        // restart the game when the player health is = 0
        var spacebarKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spacebarKey.onDown.add(this.conditional_restart, this);

        // restart the game oavsett av spelare health
        var restartKey = this.input.keyboard.addKey(Phaser.Keyboard.N);
        restartKey.onDown.add(this.restart, this);

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

        var particles = [
            ['sloth', 'bubble'],
            ['envy', 'cherry'],
            ['greed', 'cone'],
            ['gluttony', 'dorito'],
            ['pride', 'ice'],
            ['wrath', ['sprinkle1', 'sprinkle2', 'sprinkle3', 'sprinkle4', 'sprinkle5', 'sprinkle6']],
            ['lust', 'stick'],
            ['player', ['eraser1', 'eraser2', 'eraser3']]
        ];
        enemyEmitter = {};
        for (var i = 0; i < particles.length; i++) {
            enemyEmitter[particles[i][0]] = game.add.emitter(0, 0, 100);
            enemyEmitter[particles[i][0]].makeParticles(particles[i][1]);
            enemyEmitter[particles[i][0]].gravity = 500;
            enemyEmitter[particles[i][0]].width = 70;
            enemyEmitter[particles[i][0]].height = 70;
            enemyEmitter[particles[i][0]].minRotation = -180;
            enemyEmitter[particles[i][0]].maxRotation = 180;
            enemyEmitter[particles[i][0]].maxParticleScale = 2.0;
            enemyEmitter[particles[i][0]].minParticleScale = 1.4;
            enemyEmitter[particles[i][0]].setXSpeed(-150, 150);
            enemyEmitter[particles[i][0]].setYSpeed(-100, -300);
            enemyEmitter[particles[i][0]].setScale(1, 0.5, 1, 0.5, 2000);
            enemyEmitter[particles[i][0]].setAlpha(1, 0, 2000);
            if (particles[i][0] == 'player') {
                enemyEmitter[particles[i][0]].setScale(0.4, 0.2, 0.4, 0.2, 2000);
            }
        }

        // Sounds
        this.sounds.pew = game.add.audio('pew');
        this.sounds.gameover = game.add.audio('octave');
        this.sounds.player_was_hit = game.add.audio('nu');
        this.sounds.enemy_hit = game.add.audio('lazer');
        this.sounds.player_reborn = game.add.audio('select');

        // Background music -- won't loop for some reason :(
        //this.sounds.music = game.add.audio('music'); // new Phaser.Sound(game, 'music', 1, true);
        //this.sounds.music.loop = true;
        //this.sounds.music.play();

        //var background_music = this.game.add.audio('music'); //new Phaser.Sound(this.game, 'music', 1, true);
        //background_music.volume = 0.6;
        //background_music.loop = true;
        //setTimeout(function(){background_music.play()},100);

    },

    //start_music: function() {
        //this.sounds.music.loopFull(0.6);
    //},

    cloudBurst: function(pointer) {

        //  Position the emitter where the mouse/touch event was
        emitter.x = pointer.x;
        emitter.y = pointer.y;

        emitter.start(true, 2000, null, 15);

    },

    enemyBurst: function(pointer, key) {

        //  Position the emitter where the mouse/touch event was
        enemyEmitter[key].x = pointer.x;
        enemyEmitter[key].y = pointer.y;

        var count = 10;
        //if (key == 'gluttony') count = 1;
        //if (key == 'pride') count = 1;
        //if (key == 'wrath') count = 1;
        if (key == 'greed') count = 3;
        if (key == 'lust') count = 1;
        //if (key == 'sloth') count = 5;
        if (key == 'envy') count = 1;
        if (key == 'player') count = 5;

        enemyEmitter[key].start(true, 2000, null, count);

    },

    testCallback: function() {
        this.showHighScore(this.high_score);
    },

    showScore: function(score) {
        if (this.scoreInfo == null) {
           this.scoreInfo = this.game.add.text(8, 8, "Score: 0");
           this.scoreInfo.font = 'Fontdiner Swanky';
           this.scoreInfo.fill = '#eeee00';
           this.scoreInfo.stroke = '#000000';
           this.scoreInfo.strokeThickness = 2;
        }
        this.scoreInfo.text = "Score: " + score;
        if (score > this.high_score) {
           this.high_score = score;
           this.showHighScore();
        }
    },

    showHighScore: function(highscore) {
        if (this.highScoreInfo == null) {
           this.highScoreInfo = this.game.add.text(8, 58, "HighScore: 0");
           this.highScoreInfo.font = 'Fontdiner Swanky';
           this.highScoreInfo.fill = '#ee0000';
           this.highScoreInfo.stroke = '#000000';
           this.highScoreInfo.strokeThickness = 2;
        }
        this.highScoreInfo.text = "HighScore: " + this.high_score;
    },

    spawnEnemy: function () {
        // One more enemy per 500 points!

        for (var i = 0; i < Math.round(this.spawnCount); i++) {
            var x = this.player.x;
            var y = this.player.y;

            while (pointDistance(x, y, this.player.x, this.player.y) < 200) {
                x = this.game.rnd.between(50, 750);
                y = this.game.rnd.between(50, 500);
            }

            this.enemyHandler.spawn(x, y);
        }

        this.spawnCount += 0.5;
    },

    showHealth: function () {
        for (var i = 0; i < this.player.children.length; i++) {
            this.player.children[i].visible = true;
            if (i > this.player.hp - 1)
                this.player.children[i].loadTexture('heart2', 0);
            else
                this.player.children[i].loadTexture('heart1', 0);
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
            this.player.animations.play('idle');

        // Fire and bouncing animations
        if (game.input.activePointer.isDown && this.player.visible) {
            if (this.weapons[this.currentWeapon].fire(this.player)) {
              this.player.scale.y *= 0.8;
              this.sounds.pew.play();
            }
        }
        this.player.scale.y = this.player.yScale - (this.player.yScale - this.player.scale.y) * 0.8;
        this.player.anchor.y = (this.player.scale.y / this.player.yScale) * 0.5;

        interactions_info = this.enemyHandler.playerUpdate(this.player, game, this.weapons[this.currentWeapon].children);

        if (this.enemyHandler.checkAllDead()) {
            if (this.spawnTimer < 0) {
                this.spawnEnemy();
                this.spawnTimer = 100;
            }
            this.spawnTimer -= 1;
        }

        this.shake_required = interactions_info.shake_required
        this.player.score = interactions_info.points

        if (interactions_info.enemy_hit) {
            this.sounds.enemy_hit.play();
        }

        if (this.player.score > 0) {
            this.showScore(this.player.score);
        }

        if (this.shake_required) {
            this.sounds.player_was_hit.play();
            this.shake();

            this.player.hp -= 1;

            if (this.player.hp <= 0) {
                this.weaponName.text = GAMEOVER_TEXT;
                this.player.visible = false;
                this.sounds.gameover.play();
                this.cloudBurst(this.player);
                this.enemyBurst(this.player, 'player');
            }
            else {
                this.showHealth();
                game.time.events.add(Phaser.Timer.SECOND * 1.5, this.hideHealth, this);
            }
        }


    },

    restart: function() {
      this.player.x = 400;
      this.player.y = 300;
      this.cloudBurst(this.player);
      this.sounds.player_reborn.play();

      this.player.hp = 3;
      this.player.score = 0;
      this.spawnTimer = 0;
      this.spawnCount = 0.9;
      this.enemyHandler.award_points = 0;
      this.showScore(0);
      this.player.visible = true;
      this.weaponName.text = START_TEXT;

      for(var  i = 0; i < this.enemyHandler.children.length; i++) {
         this.enemyHandler.children[i].kill();
      }
    },

    conditional_restart: function() {
      if (this.player.hp <= 0) {
         this.restart();
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
       //game.debug.text(game.time.fps, 0, 12, '#ff0000');
       //game.debug.soundInfo(this.sounds.music, 20, 32);
    }
};
