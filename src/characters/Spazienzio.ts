import {AbstractCharacter} from "./AbstractCharacter";
import {Explosion} from "./Explosion";
import {Bottle} from "../characters/Bottle";

export class Spazienzio extends AbstractCharacter {

    preload(scene) {
        super.preload(scene);
        scene.load.image('fist', 'assets/fist.png');
        Bottle.preload(scene);
        Explosion.preload(scene);
    }

    create(scene) {
        super.create(scene);
        Explosion.create(scene);
    }

    update(scene, controls) {
        super.update(scene, controls);

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
        new Bottle(scene, this._ref.x, this._ref.y - 10, this._ref.anims.currentAnim.key, this.platformsRef, this.mobs);
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
