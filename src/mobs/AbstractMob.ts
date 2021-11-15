import {Damageable} from "../gen/interfaces/Damageable";
import {Visitable} from "../gen/interfaces/Visitable";
import {Visitor} from "../gen/interfaces/Visitor";
import {AbstractCharacter} from "../characters/AbstractCharacter";

export abstract class AbstractMob extends Phaser.Physics.Arcade.Sprite implements Damageable, Visitable, Visitor {

    private health;
    protected player: AbstractCharacter;
    protected walls: Phaser.Physics.Arcade.StaticGroup;

    protected constructor(scene: Phaser.Scene, key: string, health: number, spawnX: number, spawnY: number,
                          player: AbstractCharacter, walls: Phaser.Physics.Arcade.StaticGroup) {
        super(scene, spawnX, spawnY, key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.health = health;
        this.player = player;
        this.walls = walls;
    }

    abstract create(scene?: Phaser.Scene): void;

    abstract update(scene?: Phaser.Scene): void;

    isDead(): boolean {
        return this.health <= 0;
    }

    accept(v: Visitor): void {
        v.visit(this);
    }

    visit(v: Visitable): void {
        // rough skin damage and recoil
        if (v instanceof AbstractCharacter) {
            v.sufferDamage(10, 100);
            const recoilX = this.x - v.getReference().x;
            const recoilY = this.y - v.getReference().y;
            v.getReference().setVelocity(-recoilX * 5, -recoilY * 5);
        }
    }

    sufferDamage(damage: number, cooldown?: number): void {
        this.health -= damage;
    }

    getSprite(): Phaser.Physics.Arcade.Sprite {
        return this;
    }
}
