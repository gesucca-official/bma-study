import {AbstractMob} from "../mobs/AbstractMob";
import {Visitable} from "../gen/Visitable";
import {AbstractCharacter} from "../characters/AbstractCharacter";

export class Ninja extends AbstractMob {

    private walkTimer = 0;
    private standStillTimer = 200;
    private walkDirection = -1;

    private shurikenTimer = 500;

    private aiInterruptTimer = 0;

    constructor(spawnX: number, spawnY: number) {
        super(100, spawnX, spawnY);
    }

    public preload(scene: Phaser.Scene): void {
        scene.load.spritesheet('ninja', 'assets/mobs/ninja.png', {frameWidth: 64, frameHeight: 64});
    }

    create(scene: Phaser.Scene): void {
        this._ref = scene.physics.add.sprite(this.spawnX, this.spawnY, 'ninja');
        this._ref.setCollideWorldBounds(true);
        this._ref.setBounce(0.2);
        this._ref.body.mass = 1.5;

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

    update(scene: Phaser.Scene): void {
        if (this.aiInterruptTimer > 0) {
            this.aiInterruptTimer--;
            return;
        }
        if (this.shurikenTimer > 0)
            this.shurikenTimer--;
        else this.shuriken();
        if (this.getReference().body.touching.down)
            this.walkAndStand();
    }

    visit(v: Visitable): void {
        super.visit(v);
        this.aiInterruptTimer = 50;
        this.getReference().setVelocityX(0);
        if (v instanceof AbstractCharacter) {
            const direction = this._ref.x - v.getReference().x;
            this._ref.flipX = direction > 0;
        }
        this._ref.anims.play('kunai');
    }

    private walkAndStand() {
        if (this.standStillTimer > 0) {
            this.getReference().setVelocityX(0);
            this._ref.anims.play('stand', true);
            this.standStillTimer--;
            if (this.standStillTimer == 0)
                this.walkTimer = 200;
        } else if (this.walkTimer > 0) {
            this.getReference().setVelocityX(100 * this.walkDirection);
            this._ref.anims.play('run', true);
            this._ref.flipX = this.walkDirection < 0;
            this.walkTimer--;
            if (this.walkTimer == 0) {
                this.walkDirection = -this.walkDirection;
                this.standStillTimer = 200;
            }
        }
    }

    private shuriken() {
        this.aiInterruptTimer = 50;
        this.getReference().setVelocityX(0);
        // TODO create shuriken sprite...
    }
}
