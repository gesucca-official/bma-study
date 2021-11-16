import {Ninja} from "../mobs/Ninja";
import {AbstractCharacter} from "../characters/AbstractCharacter";
import {Shuriken} from "../projectiles/Shuriken";

export class Jonin extends Ninja {

    private readonly isClone: boolean;

    private shadowCloneTechniqueTimer = 1000;
    private clones: Jonin[] = [];
    private clonesLifeSpan = 500;

    constructor(scene, spawnX: number, spawnY: number, player: AbstractCharacter, walls: Phaser.Physics.Arcade.StaticGroup, isClone?: boolean) {
        super(scene, spawnX, spawnY, player, walls, 'jonin');
        if (isClone)
            this.isClone = isClone;
        else this.isClone = false;
    }

    static preload(scene: Phaser.Scene): void {
        scene.load.spritesheet('jonin', 'assets/mobs/jonin.png', {frameWidth: 64, frameHeight: 64});
        Shuriken.preload(scene);
    }

    create(scene: Phaser.Scene) {
        super.create(scene);
        scene.anims.create({
            key: this.key + '-clones',
            frames: scene.anims.generateFrameNumbers(this.key, {start: 6, end: 7}),
            frameRate: 15,
            repeat: -1,
        });
        scene.anims.create({
            key: this.key + '-puff',
            frames: [{key: this.key, frame: 8}],
            frameRate: 20,
            repeat: -1
        });
    }

    update(scene) {
        super.update(scene);

        if (this.isClone)
            return;

        if (this.shadowCloneTechniqueTimer > 0)
            this.shadowCloneTechniqueTimer--;
        else this.shadowClones(scene);

        this.clonesLifeSpan--;
        if (this.clonesLifeSpan == 0) {
            this.clones.forEach(c => c.puffClone());
            this.clones = [];
        }

        this.clones.forEach(c => {
            if (c.body)
                c.update(scene)
        });
    }

    private shadowClones(scene) {
        this.aiInterruptTimer = 100;
        this.setVelocityX(0);
        this.anims.play(this.key + '-clones', true);

        this.clones.push(
            new Jonin(scene, this.x + 100, this.y - 10, this.player, this.walls, true)
                .setTint(0xff0000)
        );
        this.clones.push(
            new Jonin(scene, this.x - 100, this.y - 10, this.player, this.walls, true)
                .setTint(0xff0000)
        );
        this.clones.forEach(c => c.create(scene));
        this.clones.forEach(c => scene.physics.add.collider(c, this.walls))
        this.clones.forEach(c => scene.physics.add.collider(c, this.player.getReference(), () => c.puffClone()))
        this.clones.forEach(c => c.anims.play(this.key + '-puff', true));

        this.shadowCloneTechniqueTimer = 1000;
        this.clonesLifeSpan = 500;
    }

    private puffClone() {
        if (!this.body)
            return;
        this.aiInterruptTimer = 1000;
        this.anims.play(this.key + '-puff', true);
        this.setVelocity(0, 0);
        this.setTint();
        setTimeout(() => this.destroy(), 200)
    }
}
