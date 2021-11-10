import {Visitable} from "../gen/Visitable";
import {Visitor} from "../gen/Visitor";
import {AbstractCharacter} from "../characters/AbstractCharacter";

export abstract class AbstractMob implements Visitor, Visitable {

    // @ts-ignore
    private _ref: Phaser.Physics.Arcade.Sprite;

    private readonly spawnX: number;
    private readonly spawnY: number;

    protected constructor(spawnX: number, spawnY: number) {
        this.spawnX = spawnX;
        this.spawnY = spawnY;
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
        // AI stuff
    }

    public getReference(): Phaser.Physics.Arcade.Sprite {
        return this._ref;
    }

    accept(v: Visitor): void {
        v.visit(this);
    }

    visit(v: Visitable): void {
        // rough skin damage and recoil
        if (v instanceof AbstractCharacter) {
            v.sufferDamage(10, 100);
            const recoilX = this._ref.x - v.getReference().x;
            const recoilY = this._ref.y - v.getReference().y;
            v.getReference().setVelocity(-recoilX * 5, -recoilY * 5);
        }
    }
}
