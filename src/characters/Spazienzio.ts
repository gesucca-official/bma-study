import {AbstractCharacter} from "./AbstractCharacter";

export class Spazienzio extends AbstractCharacter {

    skillTimer = 0;

    preload(scene) {
        super.preload(scene);

        scene.load.image('bottle', 'assets/bottle.png');
        scene.load.spritesheet('explosion', 'assets/explosion.png', {frameWidth: 100, frameHeight: 100});
    }

    create(scene) {
        super.create(scene);

        scene.anims.create({
            key: 'boom',
            frames: scene.anims.generateFrameNumbers('explosion', {start: 0, end: 64}),
            frameRate: 60,
            repeat: 0
        });
    }

    update(scene, controls) {
        super.update(scene, controls);

        if (this.skillTimer > 0)
            this.skillTimer--;

        if (controls.skill1.isDown && this.mana > 0 && this.skillTimer == 0) {
            this.skillTimer = 50;
            this.mana -= 10;
            const bottle = scene.physics.add.sprite(this._ref.x, this._ref.y, 'bottle');
            bottle.setCollideWorldBounds(true);
            bottle.setVelocityY(-330);
            bottle.setVelocityX(330);

            scene.tweens.add({
                targets: bottle,
                angle: 360.0,
                duration: 750,
                repeat: -1
            });

            scene.physics.add.collider(bottle, this.platformsRef,
                (bottle) => {
                    const explosion = scene.physics.add.sprite(bottle.x, bottle.y, 'explosion');
                    explosion.anims.play('boom', false);
                    explosion.once('animationcomplete', () => {
                        explosion.destroy();
                    });
                    scene.physics.add.collider(explosion, this.platformsRef);

                    bottle.destroy();
                }, null, scene);
        }
    }

}
