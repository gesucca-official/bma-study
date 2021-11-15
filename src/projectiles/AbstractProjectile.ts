import {Damageable} from "~/gen/interfaces/Damageable";

export abstract class AbstractProjectile extends Phaser.Physics.Arcade.Sprite {

    private lifeTimer: number;

    protected constructor(scene: Phaser.Scene, x: number, y: number, key: string,
                          speedX: number, speedY: number, lifeTimer: number,
                          walls: Phaser.Physics.Arcade.StaticGroup,
                          targets: Damageable[]) {
        super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setVelocity(speedX, speedY);
        this.lifeTimer = lifeTimer;

        scene.physics.add.collider(this, walls, () => this.collideWithWalls());
        targets.forEach(t => scene.physics.add.collider(this, t.getSprite(), () => this.collideWithTarget(t)));
    }

    update(): void {
        this.lifeTimer--;
        if (this.lifeTimer == 0)
            this.destroy();
    }

    abstract collideWithWalls(): void;

    abstract collideWithTarget(target: Damageable): void;


}
