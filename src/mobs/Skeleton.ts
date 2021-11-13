import {AbstractMob} from "./AbstractMob";

export class Skeleton extends AbstractMob {

    private walkDistance = 200;
    private walkDirection = -1;

    constructor(spawnX: number, spawnY: number) {
        super(100, spawnX, spawnY);
    }

    public preload(scene: Phaser.Scene): void {
        scene.load.spritesheet('skeleton', 'assets/skeleton.png', {frameWidth: 60, frameHeight: 60});
    }

    public create(scene: Phaser.Scene): void {
        this._ref = scene.physics.add.sprite(this.spawnX, this.spawnY, 'skeleton');
        this._ref.setCollideWorldBounds(true);
        this._ref.setBounce(0.2);
        this._ref.body.mass = 2;
    }

    public update(scene: Phaser.Scene): void {
        if (this.getReference().body.touching.down)
            this.walk();
        else this.getReference().setVelocityX(0);
    }

    private walk() {
        if (this.walkDistance == 0) {
            this.walkDistance = 200;
            this.walkDirection = -this.walkDirection;
        }
        this.getReference().setVelocityX(100 * this.walkDirection);
        this.walkDistance--;
    }
}
