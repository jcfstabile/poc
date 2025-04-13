// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 300;
const DINO_WIDTH = 60;
const DINO_HEIGHT = 60;
const CACTUS_WIDTH = 30;
const CACTUS_HEIGHT = 60;
const GROUND_Y = CANVAS_HEIGHT - 60;
const JUMP_FORCE = 20;
const GRAVITY = 0.8;

class DinoGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.GameConstants.CANVAS.WIDTH;
        this.canvas.height = 300;
        
        // Game constants
        this.DINO_WIDTH = 60;
        this.DINO_HEIGHT = 60;
        this.CACTUS_WIDTH = 30;
        this.CACTUS_HEIGHT = 60;
        this.GROUND_Y = this.canvas.height - 60;
        this.JUMP_FORCE = 20;
        this.GRAVITY = 0.8;
        
        // Load images
        this.loadImages();
        
        // Animation frames for dino
        this.dinoFrames = {
            running: [0, 1], // Two frames for running animation
            jumping: 2,      // Single frame for jumping
            dead: 3         // Frame for death
        };
        this.currentFrame = 0;
        this.frameCount = 0;
        
        // Game state
        this.score = 0;
        this.gameOver = false;
        this.speed = 5;
        this.isActive = true;
        
        // Dino properties
        this.dino = {
            x: 50,
            y: this.GROUND_Y,
            velocityY: 0,
            isJumping: false
        };
        
        // Obstacles array
        this.obstacles = [];
        this.obstacleTimer = 0;
        
        // Event listeners
        this.handleInputBound = this.handleInput.bind(this);
        document.addEventListener('keydown', this.handleInputBound);
        
        // Start game loop
        this.gameLoop();
    }
    
    cleanup() {
        this.isActive = false;
        document.removeEventListener('keydown', this.handleInputBound);
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    loadImages() {
        // Load dino sprite sheet
        this.dinoImage = new Image();
        this.dinoImage.src = 'assets/dino-sprite.png';
        
        // Load cactus images
        this.cactusImage = new Image();
        this.cactusImage.src = 'assets/cactus.png';
        
        // Load ground image
        this.groundImage = new Image();
        this.groundImage.src = 'assets/ground.png';
        
        // Start game when all images are loaded
        Promise.all([
            this.loadImagePromise(this.dinoImage),
            this.loadImagePromise(this.cactusImage),
            this.loadImagePromise(this.groundImage)
        ]).then(() => {
            this.gameLoop();
        });
    }
    
    loadImagePromise(img) {
        return new Promise((resolve) => {
            img.onload = () => resolve();
        });
    }
    
    handleInput(event) {
        if ((event.code === 'Space' || event.code === 'ArrowUp') && !this.dino.isJumping && !this.gameOver) {
            this.dino.velocityY = -this.JUMP_FORCE;
            this.dino.isJumping = true;
        }
        
        if (this.gameOver && event.code === 'Space') {
            this.resetGame();
        }
    }
    
    update() {
        if (this.gameOver) return;
        
        // Update score
        this.score++;
        
        // Update animation frame
        this.frameCount++;
        if (this.frameCount > 5) { // Change frame every 6 frames
            this.frameCount = 0;
            this.currentFrame = this.currentFrame === 0 ? 1 : 0;
        }
        
        // Update dino position
        this.dino.velocityY += this.GRAVITY;
        this.dino.y += this.dino.velocityY;
        
        // Ground collision
        if (this.dino.y > this.GROUND_Y) {
            this.dino.y = this.GROUND_Y;
            this.dino.velocityY = 0;
            this.dino.isJumping = false;
        }
        
        // Spawn obstacles
        this.obstacleTimer++;
        if (this.obstacleTimer > 100) {
            this.obstacleTimer = 0;
            if (Math.random() < 0.3) {
                this.obstacles.push({
                    x: CANVAS_WIDTH,
                    y: this.GROUND_Y - this.CACTUS_HEIGHT + 10
                });
            }
        }
        
        // Update obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].x -= this.speed;
            
            if (this.obstacles[i].x < -this.CACTUS_WIDTH) {
                this.obstacles.splice(i, 1);
                continue;
            }
            
            if (this.checkCollision(this.obstacles[i])) {
                this.gameOver = true;
            }
        }
        
        // Increase speed over time
        if (this.score % 500 === 0) {
            this.speed += 0.5;
        }
    }
    
    checkCollision(obstacle) {
        // Adjust collision box to be slightly smaller than the visible sprites
        const collisionMargin = 10;
        return (
            this.dino.x + collisionMargin < obstacle.x + this.CACTUS_WIDTH - collisionMargin &&
            this.dino.x + this.DINO_WIDTH - collisionMargin > obstacle.x + collisionMargin &&
            this.dino.y + collisionMargin < obstacle.y + this.CACTUS_HEIGHT - collisionMargin &&
            this.dino.y + this.DINO_HEIGHT - collisionMargin > obstacle.y + collisionMargin
        );
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ground (repeated pattern)
        const groundPattern = this.ctx.createPattern(this.groundImage, 'repeat-x');
        this.ctx.fillStyle = groundPattern;
        this.ctx.fillRect(0, this.GROUND_Y + this.DINO_HEIGHT - 10, this.canvas.width, 20);
        
        // Draw dino with appropriate animation frame
        let sourceX;
        if (this.gameOver) {
            sourceX = this.dinoFrames.dead * this.DINO_WIDTH;
        } else if (this.dino.isJumping) {
            sourceX = this.dinoFrames.jumping * this.DINO_WIDTH;
        } else {
            sourceX = this.dinoFrames.running[this.currentFrame] * this.DINO_WIDTH;
        }
        
        this.ctx.drawImage(
            this.dinoImage,
            sourceX, 0,
            this.DINO_WIDTH, this.DINO_HEIGHT,
            this.dino.x, this.dino.y,
            this.DINO_WIDTH, this.DINO_HEIGHT
        );
        
        // Draw obstacles
        this.obstacles.forEach(obstacle => {
            this.ctx.drawImage(
                this.cactusImage,
                obstacle.x, obstacle.y,
                this.CACTUS_WIDTH, this.CACTUS_HEIGHT
            );
        });
        
        // Draw score
        this.ctx.fillStyle = '#000';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${Math.floor(this.score/10)}`, 20, 30);
        
        // Draw game over message
        if (this.gameOver) {
            this.ctx.fillStyle = '#000';
            this.ctx.font = '40px Arial';
            this.ctx.fillText('Game Over!', this.canvas.width/2 - 100, this.canvas.height/2);
            this.ctx.font = '20px Arial';
            this.ctx.fillText('Press Space to Restart', this.canvas.width/2 - 100, this.canvas.height/2 + 40);
        }
    }
    
    resetGame() {
        this.score = 0;
        this.gameOver = false;
        this.speed = 5;
        this.obstacles = [];
        this.obstacleTimer = 0;
        this.currentFrame = 0;
        this.frameCount = 0;
        this.dino = {
            x: 50,
            y: this.GROUND_Y,
            velocityY: 0,
            isJumping: false
        };
    }
    
    gameLoop() {
        if (!this.isActive) return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Remove window.onload and export the game class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DinoGame;
} 