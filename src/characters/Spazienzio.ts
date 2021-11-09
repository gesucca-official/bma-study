import {AbstractCharacter} from "./AbstractCharacter";

export class Spazienzio extends AbstractCharacter {

    preload(scene) {
        super.preload(scene);

        scene.load.image('bottle', 'assets/bottle.png');
        scene.load.image('fist', 'assets/fist.png');
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

        Object.keys(this.cooldowns).forEach(key => {
            if (this.cooldowns[key] > 0)
                this.cooldowns[key]--;
        });

        if (controls.skill1.isDown && this.mana > 0 && this.cooldowns.skill1 == 0)
            this.molotov(scene);

        if (controls.skill2.isDown && this.mana > 0 && this.cooldowns.skill2 == 0) {
            this.fist(scene);
        }

        if (controls.skill3.isDown) {
            this._ref.setVelocityX(0);
            this._ref.setVelocityY(0);
            this.changeMana(+0.5);
            this.changeStamina(+0.5);
            this._ref.anims.play('turn');
        }
    }

    private molotov(scene): void {
        this.cooldowns.skill1 = 50;
        this.changeMana(-10);

        let velocityX = 0;
        if (this.getReference().anims.currentAnim.key == 'right')
            velocityX = 330;
        if (this.getReference().anims.currentAnim.key == 'left')
            velocityX = -330;

        const bottle = scene.physics.add.sprite(this._ref.x, this._ref.y - 10, 'bottle');
        bottle.setCollideWorldBounds(true);
        bottle.setVelocityY(-330);
        bottle.setVelocityX(velocityX);

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

    private fist(scene): void {
        this.cooldowns.skill2 = 20;
        this.changeMana(-5);

        const fist = scene.physics.add.image(this._ref.x, this._ref.y, 'fist');
        setTimeout(() => fist.destroy(), 200);

        if (this.getReference().anims.currentAnim.key == 'right') {
            fist.setVelocityX(500);
            fist.setAngle(90);
        }
        if (this.getReference().anims.currentAnim.key == 'left') {
            fist.setVelocityX(-500);
            fist.setAngle(-90);
        }
        if (this.getReference().anims.currentAnim.key == 'turn') {
            fist.setVelocityY(-500);
        }
        this.getReference().setVelocity(0, 0);
    }

}
