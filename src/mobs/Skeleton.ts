import {AbstractMob} from "./AbstractMob";

export class Skeleton extends AbstractMob {

    private walkDistance = 200;
    private walkDirection = -1;

    constructor(spawnX: number, spawnY: number) {
        super(spawnX, spawnY);
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
