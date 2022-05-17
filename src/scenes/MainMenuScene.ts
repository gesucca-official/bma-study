import Phaser from 'phaser'

export default class MainMenuScene extends Phaser.Scene {

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private buttonSelector!: Phaser.GameObjects.Image
    private buttons: Phaser.GameObjects.Image[] = []
    private selectedButtonIndex = 0

    constructor() {
        super('main-menu')
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    preload() {
        this.load.image('glass-panel', 'assets/glassPanel.png')
        this.load.image('cursor-hand', 'assets/cursor_hand.png')
    }

    create() {
        const {width, height} = this.scale

        // Play button
        const alphaSceneButton = this.add.image(width * 0.5, height * 0.6, 'glass-panel').setDisplaySize(150, 50)
        this.add.text(alphaSceneButton.x, alphaSceneButton.y, 'Play AlphaArena').setOrigin(0.5)

        // Credits button
        const helloWorldSceneButton = this.add.image(alphaSceneButton.x, alphaSceneButton.y + alphaSceneButton.displayHeight + 10, 'glass-panel')
            .setDisplaySize(150, 50)
        this.add.text(helloWorldSceneButton.x, helloWorldSceneButton.y, 'Play HelloWorld').setOrigin(0.5)

        // Settings button
        const settingsButton = this.add.image(helloWorldSceneButton.x, helloWorldSceneButton.y + helloWorldSceneButton.displayHeight + 10, 'glass-panel')
            .setDisplaySize(150, 50)
        this.add.text(settingsButton.x, settingsButton.y, 'Settings').setOrigin(0.5)

        this.buttons.push(alphaSceneButton)
        this.buttons.push(helloWorldSceneButton)
        this.buttons.push(settingsButton)

        this.buttonSelector = this.add.image(0, 0, 'cursor-hand')

        this.selectButton(0)

        alphaSceneButton.on('selected', () => {
            this.scene.start('alpha-arena')
        })

        helloWorldSceneButton.on('selected', () => {
            this.scene.start('hello-world')
        })

        settingsButton.on('selected', () => {
            console.log('settings')
        })

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            alphaSceneButton.off('selected')
            // ...
        })
    }

    selectButton(index: number) {
        const currentButton = this.buttons[this.selectedButtonIndex]

        // set the current selected button to a white tint
        currentButton.setTint(0xffffff)

        const button = this.buttons[index]

        // set the newly selected button to a green tint
        button.setTint(0x66ff7f)

        // move the hand cursor to the right edge
        this.buttonSelector.x = button.x + button.displayWidth * 0.5
        this.buttonSelector.y = button.y + 10

        // store the new selected index
        this.selectedButtonIndex = index
    }

    selectNextButton(change = 1) {
        let index = this.selectedButtonIndex + change

        // wrap the index to the front or end of array
        if (index >= this.buttons.length) {
            index = 0
        } else if (index < 0) {
            index = this.buttons.length - 1
        }

        this.selectButton(index)
    }

    confirmSelection() {
        // get the currently selected button
        const button = this.buttons[this.selectedButtonIndex]

        // emit the 'selected' event
        button.emit('selected')
    }

    update() {
        const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up!)
        const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down!)
        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space!)

        if (upJustPressed) {
            this.selectNextButton(-1)
        } else if (downJustPressed) {
            this.selectNextButton(1)
        } else if (spaceJustPressed) {
            this.confirmSelection()
        }
    }
}
