const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let bird;
let pipes;
let cursors;
let score = 0;
let scoreText;
let gameOver = false;

function preload() {
    this.load.image('background', 'assets/background.png'); // Update path
    this.load.image('bird', 'assets/bird.png'); // Update path
    this.load.image('pipe', 'assets/pipe.png'); // Update path
}

function create() {
    // Add background and scale it down
    const bg = this.add.image(300, 300, 'background');
    const bgScale = 1; // Adjust the scale factor to your preference
    bg.setScale(bgScale);

    // Create bird and scale it down
    bird = this.physics.add.sprite(100, 300, 'bird');
    const birdScale = 0.5; // Adjust the scale factor to your preference
    bird.setScale(birdScale);
    bird.setCollideWorldBounds(true);

    // Create pipes group
    pipes = this.physics.add.group();
    this.time.addEvent({
        delay: 1500,
        callback: addPipe,
        callbackScope: this,
        loop: true
    });

    // Create cursor inputs
    cursors = this.input.keyboard.createCursorKeys();

    // Create score text
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    // Add collision detection between bird and pipes
    this.physics.add.collider(bird, pipes, hitPipe, null, this);
}


function update() {
    if (gameOver) {
        return;
    }

    // Make the bird jump when the space bar is pressed
    if (cursors.space.isDown) {
        bird.setVelocityY(-200);
    }

    // Update score when bird passes through pipes
    Phaser.Actions.Call(pipes.getChildren(), function(pipe) {
        if (pipe.x < bird.x && !pipe.passed) {
            pipe.passed = true;
            score += 1;
            scoreText.setText('Score: ' + score);
        }
    });

    // Remove off-screen pipes
    pipes.getChildren().forEach(function(pipe) {
        if (pipe.x < -50) {
            pipes.remove(pipe, true, true);
        }
    });
}

function addPipe() {
    const pipeX = 800;
    const pipeY = Phaser.Math.Between(100, 500);
    const scale = 0.5; // Adjust the scale factor to your preference

    const pipeTop = pipes.create(pipeX, pipeY - 400, 'pipe');
    const pipeBottom = pipes.create(pipeX, pipeY + 400, 'pipe');

    pipeTop.setScale(scale);
    pipeBottom.setScale(scale);

    pipeTop.body.allowGravity = false;
    pipeBottom.body.allowGravity = false;
    pipeTop.setVelocityX(-200);
    pipeBottom.setVelocityX(-200);

    pipeTop.passed = false;
    pipeBottom.passed = false;
}

function hitPipe() {
    this.physics.pause();
    bird.setTint(0xff0000);
    gameOver = true;
    scoreText.setText('Game Over! Score: ' + score);
}
