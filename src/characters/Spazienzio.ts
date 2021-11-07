import {AbstractCharacter} from "./AbstractCharacter";

export class Spazienzio extends AbstractCharacter {

    preloadCharacter(load) {
        super.preloadCharacter(load);

        load.image('bottle', 'assets/bottle.png');
        load.spritesheet('explosion', 'assets/explosion.png', {frameWidth: 100, frameHeight: 100});
    }

    createCharacter(game) {
        super.createCharacter(game);

        game.anims.create({
            key: 'boom',
            frames: game.anims.generateFrameNumbers('explosion', {start: 0, end: 64}),
            frameRate: 60,
            repeat: 0
        });
    }

    updateCharacter(game, controls) {
        super.updateCharacter(game, controls);

        if (controls.skill1.isDown) {
            const bottle = game.physics.add.sprite(this.ref.x, this.ref.y, 'bottle');
            bottle.setCollideWorldBounds(true);
            bottle.setVelocityY(-330);
            bottle.setVelocityX(330);
            console.log(this.ref);

            game.tweens.add({
                targets: bottle,
                angle: 360.0,
                duration: 750,
                repeat: -1
            });

            game.physics.add.collider(bottle, this.platformsRef,
                (bottle) => {
                    const explosion = game.physics.add.sprite(bottle.x, bottle.y, 'explosion');
                    explosion.anims.play('boom', false);
                    explosion.once('animationcomplete', () => {
                        explosion.destroy();
                    });
                    game.physics.add.collider(explosion, this.platformsRef);

                    bottle.destroy();
                }, null, game);
        }
    }

}
