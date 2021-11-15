import {Visitable} from "../gen/interfaces/Visitable";
import {AbstractCharacter} from "../characters/AbstractCharacter";
import {AbstractMob} from "./AbstractMob";
import {Shuriken} from "../projectiles/Shuriken";
import {GeneralMath2D} from "../gen/GeneralMath2D";

export class Ninja extends AbstractMob {

    private walkTimer = 0;
    private standStillTimer = 200;
    private walkDirection = -1;

    private shurikens: Shuriken[] = [];
    private shurikenTimer = 500;

    private aiInterruptTimer = 0;

    constructor(scene, spawnX: number, spawnY: number, player: AbstractCharacter, walls: Phaser.Physics.Arcade.StaticGroup) {
        super(scene, 'ninja', 100, spawnX, spawnY, player, walls);
    }

    static preload(scene: Phaser.Scene): void {
        scene.load.spritesheet('ninja', 'assets/mobs/ninja.png', {frameWidth: 64, frameHeight: 64});
        scene.load.spritesheet('shuriken', 'assets/projectiles/shuriken.png', {frameWidth: 16, frameHeight: 16});
    }

    create(scene: Phaser.Scene): void {
        this.setCollideWorldBounds(true);
        this.setBounce(0.2);
        this.body.mass = 1.5;

        scene.anims.create({
            key: 'stand',
            frames: scene.anims.generateFrameNumbers('ninja', {start: 0, end: 1}),
            frameRate: 10,
            repeat: -1,
        });
        scene.anims.create({
            key: 'run',
            frames: scene.anims.generateFrameNumbers('ninja', {start: 2, end: 3}),
            frameRate: 10
        });
        scene.anims.create({
            key: 'shuriken',
            frames: [{key: 'ninja', frame: 4}],
            frameRate: 20,
            repeat: -1
        });
        scene.anims.create({
            key: 'kunai',
            frames: [{key: 'ninja', frame: 5}],
            frameRate: 20,
            repeat: -1
        });
    }

    update(scene): void {
        this.shurikens.forEach(s => s.update());
        if (this.aiInterruptTimer > 0) {
            this.aiInterruptTimer--;
            return;
        }
        if (this.body.touching.down)
            this.walkAndStand();
        if (this.shurikenTimer > 0)
            this.shurikenTimer--;
        else this.shuriken(scene);
    }

    visit(v: Visitable): void {
        super.visit(v);
        this.aiInterruptTimer = 50;
        this.setVelocityX(0);
        if (v instanceof AbstractCharacter) {
            const direction = this.x - v.getReference().x;
            this.flipX = direction > 0;
        }
        this.anims.play('kunai');
    }

    private walkAndStand() {
        if (this.standStillTimer > 0) {
            this.setVelocityX(0);
            this.anims.play('stand', true);
            this.standStillTimer--;
            if (this.standStillTimer == 0)
                this.walkTimer = 200;
        } else if (this.walkTimer > 0) {
            this.setVelocityX(100 * this.walkDirection);
            this.anims.play('run', true);
            this.flipX = this.walkDirection < 0;
            this.walkTimer--;
            if (this.walkTimer == 0) {
                this.walkDirection = -this.walkDirection;
                this.standStillTimer = 200;
            }
        }
    }

    private shuriken(scene) {
        this.aiInterruptTimer = 50;
        this.setVelocityX(0);
        this.anims.play('shuriken', true);
        this.flipX = this.x - this.player.getReference().x > 0;
        const xDir = GeneralMath2D.direction(this.x, this.player.getSprite().x);
        this.shurikens.push(
            new Shuriken(scene, this.x, this.y, 400 * xDir, 0, 100, this.walls, [this.player])
        );
        this.shurikenTimer = 500;
    }
}
