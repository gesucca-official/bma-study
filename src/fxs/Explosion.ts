import {Damageable} from "../gen/interfaces/Damageable";

export class Explosion extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, walls: Phaser.Physics.Arcade.StaticGroup, targets: Damageable[]) {
        super(scene, x, y, 'explosion');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.anims.play('boom', false);
        this.once('animationcomplete', () => {
            this.destroy();
        });
        scene.physics.add.collider(this, walls);
        targets.forEach(t => scene.physics.add.overlap(this, t, () => this.doDamage(t)));
    }

    doDamage(v: any): void {
        v.sufferDamage(2.5);
    }

    static preload(scene: Phaser.Scene) {
        scene.load.spritesheet('explosion', 'assets/explosion.png', {frameWidth: 100, frameHeight: 100});
    }

    static create(scene: Phaser.Scene) {
        scene.anims.create({
            key: 'boom',
            frames: scene.anims.generateFrameNumbers('explosion', {start: 0, end: 64}),
            frameRate: 60,
            repeat: 0
        });
    }

}
