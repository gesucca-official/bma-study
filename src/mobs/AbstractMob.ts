import {Visitable} from "../gen/Visitable";
import {Visitor} from "../gen/Visitor";
import {AbstractCharacter} from "../characters/AbstractCharacter";

export abstract class AbstractMob implements Visitor, Visitable {

    // todo this should extends sprite

    private health;

    // @ts-ignore
    protected _ref: Phaser.Physics.Arcade.Sprite;

    protected readonly spawnX: number;
    protected readonly spawnY: number;

    protected constructor(health: number, spawnX: number, spawnY: number) {
        this.health = health;
        this.spawnX = spawnX;
        this.spawnY = spawnY;
    }

    public abstract preload(scene: Phaser.Scene): void;

    public abstract create(scene: Phaser.Scene): void;

    public abstract update(scene: Phaser.Scene): void;

    public getReference(): Phaser.Physics.Arcade.Sprite {
        return this._ref;
    }

    public sufferDamage(damage: number) {
        this.health -= damage;
    }

    public isDead(): boolean {
        return this.health <= 0;
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
