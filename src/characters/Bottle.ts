import {AbstractMob} from "../mobs/AbstractMob";
import {Explosion} from "../characters/Explosion";

export class Bottle extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, direction: string, platforms: Phaser.Physics.Arcade.StaticGroup, mobs: AbstractMob[]) {
        super(scene, x, y, 'bottle');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        let velocityX = 0;
        if (direction == 'right')
            velocityX = 330;
        if (direction == 'left')
            velocityX = -330;
        this.setVelocityY(-330);
        this.setVelocityX(velocityX);

        scene.tweens.add({
            targets: this,
            angle: 360.0,
            duration: 750,
            repeat: -1
        });

        scene.physics.add.collider(this, platforms, () => this.explode(scene, platforms, mobs), null, scene);
        mobs.forEach(m => scene.physics.add.collider(this, m.getReference(), () => this.explode(scene, platforms, mobs), null, scene));
    }

    private explode(scene, platforms, mobs) {
        new Explosion(scene, this.x, this.y, platforms, mobs);
        this.destroy();
    }
}
