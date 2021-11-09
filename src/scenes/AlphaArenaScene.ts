import Phaser from "phaser";
import {Spazienzio} from "../characters/Spazienzio";
import {AbstractMob} from "../mobs/AbstractMob";
import {Skeleton} from "../mobs/Skeleton";
import {AbstractCharacter} from "../characters/AbstractCharacter";

export default class AlphaArenaScene extends Phaser.Scene {

    private player: AbstractCharacter;

    private platforms: Phaser.Physics.Arcade.StaticGroup | undefined;
    private mobs: AbstractMob[] = [];

    private health: Phaser.GameObjects.Text | undefined;
    private mana: Phaser.GameObjects.Text | undefined;
    private stamina: Phaser.GameObjects.Text | undefined;

    private controls: any;

    constructor() {
        super('alpha-arena')
        this.player = new Spazienzio();
        this.mobs.push(new Skeleton(450, 200));
        this.mobs.push(new Skeleton(550, 1200));
        this.mobs.push(new Skeleton(750, 1200));
        this.mobs.push(new Skeleton(950, 600));
        this.mobs.push(new Skeleton(1200, 600));
        this.mobs.push(new Skeleton(1400, 400));
        this.mobs.push(new Skeleton(1600, 400));
        this.mobs.push(new Skeleton(2000, 1000));
    }

    preload(): void {
        this.load.image('bg', 'assets/background.jpg');
        this.load.image('ground', 'assets/ground.png');
        this.player.preload(this);
        this.mobs.forEach(m => m.preload(this));
    }

    create(): void {
        this.initControls();

        this.add.image(0, 0, 'bg').setOrigin(0, 0);

        this.createPlatforms();
        this.player.setPlatforms(this.platforms);
        this.player.create(this);
        this.player.getReference().x = 20;
        this.player.getReference().y = 1000;
        // @ts-ignore
        this.physics.add.collider(this.player.getReference(), this.platforms);

        this.mobs.forEach(m => m.create(this));
        // @ts-ignore
        this.mobs.forEach(m => this.physics.add.collider(m.getReference(), this.platforms));
        this.mobs.forEach(m => this.physics.add.collider(m.getReference(), this.player.getReference()));

        this.createPlayerResourcesText();

        this.cameras.main.setBounds(0, 0, 2560, 1440);
        this.physics.world.setBounds(0, 0, 2560, 1440);
        this.cameras.main.startFollow(this.player.getReference(), true, 0.5, 0.5)
    }

    update(): void {
        this.player.update(this, this.controls);
        this.mobs.forEach(m => m.update(this));
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
        for (let x = 0; x < 2560; x += 189) {
            this.platforms.create(x, 1405, 'ground').setOrigin(0, 0).refreshBody();
        }
        for (let x = 250; x < 2560; x += 450) {
            this.platforms.create(x, 1280, 'ground').setOrigin(0, 0).refreshBody();
        }
        for (let x = 450; x < 2560; x += 450) {
            this.platforms.create(x, 1150, 'ground').setOrigin(0, 0).refreshBody();
        }
        for (let x = 250; x < 2560; x += 450) {
            this.platforms.create(x, 1050, 'ground').setOrigin(0, 0).refreshBody();
        }
        for (let x = 450; x < 2560; x += 450) {
            this.platforms.create(x, 920, 'ground').setOrigin(0, 0).refreshBody();
        }
        for (let x = 50; x < 2560; x += 750) {
            this.platforms.create(x, 750, 'ground').setOrigin(0, 0).refreshBody();
        }
    }

}
