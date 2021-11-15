import {AbstractProjectile} from "../projectiles/AbstractProjectile";
import {Damageable} from "../gen/interfaces/Damageable";

export class Shuriken extends AbstractProjectile {

    constructor(scene: Phaser.Scene, x: number, y: number,
                speedX: number, speedY: number, lifeTimer: number,
                walls: Phaser.Physics.Arcade.StaticGroup,
                targets: Damageable[]) {
        super(scene, x, y, 'shuriken', speedX, speedY, lifeTimer, walls, targets);
        this.setAcceleration(0, -300); // this counters gravity
        this.body.mass = 0.25;

        scene.anims.create({
            key: 'rotate',
            frames: scene.anims.generateFrameNumbers('shuriken', {start: 0, end: 1}),
            frameRate: 12,
            repeat: -1
        });
        this.anims.play('rotate', true);
    }

    collideWithTarget(target: Damageable): void {
        target.sufferDamage(10, 50);
        this.destroy();
    }

    collideWithWalls(): void {
        this.destroy()
    }

}
