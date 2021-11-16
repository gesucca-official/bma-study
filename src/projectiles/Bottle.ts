import {Explosion} from "../fxs/Explosion";
import {AbstractProjectile} from "../projectiles/AbstractProjectile";
import {Damageable} from "../gen/interfaces/Damageable";

export class Bottle extends AbstractProjectile {

    private readonly _walls: Phaser.Physics.Arcade.StaticGroup;
    private readonly _targets: Damageable[];

    constructor(scene, x, y, direction: string, walls: Phaser.Physics.Arcade.StaticGroup, targets: Damageable[]) {
        super(scene, x, y, 'bottle', direction == 'right' ? 330 : -330, -330, 9999, walls, targets);

        this._walls = walls;
        this._targets = targets;

        scene.tweens.add({
            targets: this,
            angle: 360.0,
            duration: 750,
            repeat: -1
        });
    }

    static preload(scene: Phaser.Scene) {
        scene.load.image('bottle', 'assets/bottle.png');
    }

    collideWithTarget(target: Damageable): void {
        this.explode(this.scene, this._walls, this._targets);
    }

    collideWithWalls(): void {
        this.explode(this.scene, this._walls, this._targets);
    }

    private explode(scene, walls, targets) {
        new Explosion(scene, this.x, this.y, walls, targets);
        this.destroy();
    }
}
