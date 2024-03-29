import Phaser from 'phaser'

import AlphaArenaScene from "./scenes/AlphaArenaScene";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            fps: 60,
            debug: true
        }
    },
    scene: [AlphaArenaScene]
}

export default new Phaser.Game(config)
