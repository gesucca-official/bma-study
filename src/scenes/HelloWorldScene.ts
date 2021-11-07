import Phaser from 'phaser'
import {Spazienzio} from "../characters/Spazienzio";

export default class HelloWorldScene extends Phaser.Scene {

    player1: Spazienzio;

    controls;
    stars;
    bombs;
    platforms;
    score = 0;
    gameOver = false;
    scoreText;
    p1health;
    p1mana;
    p1stamina;

    constructor() {
        super('hello-world')
        this.player1 = new Spazienzio();
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.player1.preload(this);
    }

    create() {
        //  A simple background for our game
        this.add.image(400, 300, 'sky');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.physics.add.staticGroup();

        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        //  Now let's create some ledges
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.player1.setPlatforms(this.platforms);
        this.player1.create(this);

        this.p1health = this.add.text(16, 16, 'health:' + this.player1.health, {fontSize: '32px'});
        this.p1mana = this.add.text(16, 32, 'mana:' + this.player1.mana, {fontSize: '32px'});
        this.p1stamina = this.add.text(16, 48, 'stamina:' + this.player1.stamina, {fontSize: '32px'});

        //  Input Events
        this.controls = this.input.keyboard.addKeys({
            up: 'W',
            left: 'A',
            down: 'S',
            right: 'D',
            skill1: 'O',
            skill2: 'P',
            skill3: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: {x: 12, y: 0, stepX: 70}
        });

        this.stars.children.iterate(function (child) {
            //  Give each star a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.bombs = this.physics.add.group();

        //  The score
        this.scoreText = this.add.text(16, 600, 'score: 0', {fontSize: '32px'});

        //  Collide the player and the stars with the platforms
        this.physics.add.collider(this.player1.getReference(), this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(this.player1.getReference(), this.stars,
            (player, star) => {
                star.destroy();

                //  Add and update the score
                this.score += 10;
                this.scoreText.setText('Score: ' + this.score);

                if (this.stars.countActive(true) === 0) {
                    //  A new batch of stars to collect
                    this.stars.children.iterate(function (child) {
                        child.enableBody(true, child.x, 0, true, true);
                    });
                    const x = (player.body.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
                    const bomb = this.bombs.create(x, 16, 'bomb');
                    bomb.setBounce(1);
                    bomb.setCollideWorldBounds(true);
                    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
                    bomb.allowGravity = false;
                }
            }, undefined, this);
        this.physics.add.collider(this.player1.getReference(), this.bombs, (player, bomb) => {
            this.physics.pause();
            this.player1.getReference().setTint(0xff0000);
            this.player1.getReference().anims.play('turn');
            this.gameOver = true;
        }, undefined, this);
    }

    update() {
        if (this.gameOver) {
            return;
        }
        this.player1.update(this, this.controls);

        this.p1health.setText('health:' + this.player1.health);
        this.p1mana.setText('mana:' + Math.round(this.player1.mana * 100) / 100);
        this.p1stamina.setText('stamina:' + this.player1.stamina);
    }

}
