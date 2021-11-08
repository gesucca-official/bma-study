export abstract class AbstractMob {

    // @ts-ignore
    private _ref: Phaser.Physics.Arcade.Sprite;

    public preload(scene: Phaser.Scene): void {
        scene.load.spritesheet('skeleton', 'assets/skeleton.png', {frameWidth: 60, frameHeight: 60});
    }

    public create(scene: Phaser.Scene): void {
        this._ref = scene.physics.add.sprite(200, 1000, 'skeleton');
        this._ref.setCollideWorldBounds(true);
    }

    public update(scene: Phaser.Scene): void {
        // AI stuff
    }

    public getReference(): Phaser.Physics.Arcade.Sprite {
        return this._ref;
    }
}
