import {Controls} from "~/settings/Controls";

export abstract class AbstractCharacter {

    private _health: number;
    private _mana: number;
    private _stamina: number;

    // @ts-ignore
    protected _ref: Phaser.Physics.Arcade.Sprite;
    // @ts-ignore
    protected platformsRef: Phaser.Physics.Arcade.StaticGroup;

    constructor() {
        this._health = 100;
        this._mana = 100;
        this._stamina = 100;
    }

    // SCENE METHODS
    public preload(scene: Phaser.Scene): void {
        scene.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48});
    }

    public create(scene: Phaser.Scene): void {
        this._ref = scene.physics.add.sprite(100, 450, 'dude');
        this._ref.setBounce(0.2);
        this._ref.setCollideWorldBounds(true);

        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: 'turn',
            frames: [{key: 'dude', frame: 4}],
            frameRate: 20
        });
        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        });
    }

    public update(scene: Phaser.Scene, controls: Controls): void {
        // movement
        if (controls.left.isDown) {
            this._ref.setVelocityX(-160);
            this._ref.anims.play('left', true);
        } else if (controls.right.isDown) {
            this._ref.setVelocityX(160);
            this._ref.anims.play('right', true);
        } else {
            this._ref.setVelocityX(0);
            this._ref.anims.play('turn');
        }

        // jump
        if (controls.up.isDown && this._ref.body.touching.down) {
            this._ref.setVelocityY(-330);
        }

        // dive
        if (controls.down.isDown) {
            this._ref.setVelocityX(0);
            this._ref.setVelocityY(350);
        }
    }

    public getReference(): Phaser.Physics.Arcade.Sprite {
        return this._ref;
    }

    public setPlatforms(platforms: Phaser.Physics.Arcade.StaticGroup): void {
        this.platformsRef = platforms;
    }

    get health(): number {
        return this._health;
    }

    set health(value: number) {
        this._health = value;
    }

    get mana(): number {
        return this._mana;
    }

    set mana(value: number) {
        this._mana = value;
    }

    get stamina(): number {
        return this._stamina;
    }

    set stamina(value: number) {
        this._stamina = value;
    }
}
