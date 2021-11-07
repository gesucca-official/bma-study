export abstract class AbstractCharacter {

    protected ref;

    getReference() {
        return this.ref;
    }

    platformsRef;

    setPlatforms(platforms): void {
        this.platformsRef = platforms;
    }

    preloadCharacter(load): void {
        load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48});
    }

    createCharacter(game): void {
        // The player and its settings
        this.ref = game.physics.add.sprite(100, 450, 'dude');
        //  Player physics properties. Give the little guy a slight bounce.
        this.ref.setBounce(0.2);
        this.ref.setCollideWorldBounds(true);

        //  Our player animations, turning, walking left and walking right.
        game.anims.create({
            key: 'left',
            frames: game.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
        game.anims.create({
            key: 'turn',
            frames: [{key: 'dude', frame: 4}],
            frameRate: 20
        });
        game.anims.create({
            key: 'right',
            frames: game.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        });
    }

    updateCharacter(game, controls): void {
        // movement
        if (controls.left.isDown) {
            this.ref.setVelocityX(-160);
            this.ref.anims.play('left', true);
        } else if (controls.right.isDown) {
            this.ref.setVelocityX(160);
            this.ref.anims.play('right', true);
        } else {
            this.ref.setVelocityX(0);
            this.ref.anims.play('turn');
        }

        // jump
        if (controls.up.isDown && this.ref.body.touching.down) {
            this.ref.setVelocityY(-330);
        }

        // dive
        if (controls.down.isDown) {
            this.ref.setVelocityX(0);
            this.ref.setVelocityY(350);
        }
    }
}
