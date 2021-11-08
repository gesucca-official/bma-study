import {Spazienzio} from "../characters/Spazienzio";
import Phaser from "phaser";

export default class AlphaArenaScene extends Phaser.Scene {

    private player: Spazienzio;

    private platforms: Phaser.Physics.Arcade.StaticGroup | undefined;

    private health: Phaser.GameObjects.Text | undefined;
    private mana: Phaser.GameObjects.Text | undefined;
    private stamina: Phaser.GameObjects.Text | undefined;

    private controls: object | undefined;

    constructor() {
        super('alpha-arena')
        this.player = new Spazienzio();
    }

    preload(): void {
        this.load.image('bg', 'assets/background.jpg');
        this.load.image('ground', 'assets/ground.png');
        this.player.preload(this);
    }

    create(): void {
        this.initControls();

        this.add.image(0, 0, 'bg').setOrigin(0, 0);

        this.createPlatforms();
        if (this.platforms == undefined)
            return;
        this.player.setPlatforms(this.platforms);
        this.player.create(this);
        this.player.getReference().x = 20;
        this.player.getReference().y = 1000;

        this.createPlayerResourcesText();

        this.physics.add.collider(this.player.getReference(), this.platforms);

        this.cameras.main.setBounds(0, 0, 2560, 1440);
        this.physics.world.setBounds(0, 0, 2560, 1440);
        this.cameras.main.startFollow(this.player.getReference(), true, 0.5, 0.5)

    }

    update(): void {
        this.player.update(this, this.controls);
        this.updatePlayerResourcesText();
    }

    private initControls() {
        this.controls = this.input.keyboard.addKeys({
            up: 'W',
            left: 'A',
            down: 'S',
            right: 'D',
            skill1: 'O',
            skill2: 'P',
            skill3: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
    }

    private createPlayerResourcesText() {
        this.health = this.add.text(16, 10, 'health', {fontSize: '32px'});
        this.health.setScrollFactor(0);
        this.mana = this.add.text(16, 40, 'mana', {fontSize: '32px'});
        this.mana.setScrollFactor(0);
        this.stamina = this.add.text(16, 70, 'stamina', {fontSize: '32px'});
        this.stamina.setScrollFactor(0);
    }

    private updatePlayerResourcesText() {
        if (this.health != undefined)
            this.health.setText('health:' + Math.round(this.player.health * 100) / 100);
        if (this.mana != undefined)
            this.mana.setText('mana:' + Math.round(this.player.mana * 100) / 100);
        if (this.stamina != undefined)
            this.stamina.setText('stamina:' + Math.round(this.player.stamina * 100) / 100);
    }

    private createPlatforms(): void {
        this.platforms = this.physics.add.staticGroup();
        for (let x = 0; x < 2560; x += 200) {
            this.platforms.create(x, 1400, 'ground').setOrigin(0, 0).refreshBody();
        }
        this.platforms.create(100, 1280, 'ground').setOrigin(0, 0).refreshBody();
        this.platforms.create(250, 1150, 'ground').setOrigin(0, 0).refreshBody();
    }
}
