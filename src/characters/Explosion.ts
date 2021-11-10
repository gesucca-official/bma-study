import {Visitable} from "../gen/Visitable";
import {Visitor} from "../gen/Visitor";
import {AbstractMob} from "../mobs/AbstractMob";

export class Explosion extends Phaser.Physics.Arcade.Sprite implements Visitor {

    constructor(scene, x, y, platforms: Phaser.Physics.Arcade.StaticGroup, mobs: AbstractMob[]) {
        super(scene, x, y, 'explosion');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.anims.play('boom', false);
        this.once('animationcomplete', () => {
            this.destroy();
        });
        scene.physics.add.collider(this, platforms);
        mobs.forEach(m => scene.physics.add.overlap(this, m.getReference(), () => this.visit(m)));
    }

    visit(v: Visitable): void {
        if (v instanceof AbstractMob)
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
