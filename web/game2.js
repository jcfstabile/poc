// Game constants
const GALAGA_CANVAS_WIDTH = 800;
const GALAGA_CANVAS_HEIGHT = 600;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 10;
const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 40;

class GalagaGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.GameConstants.CANVAS.WIDTH;
        this.canvas.height = window.GameConstants.CANVAS.HEIGHT;
        
        // Game constants
        this.PLAYER_WIDTH = 50;
        this.PLAYER_HEIGHT = 50;
        this.BULLET_WIDTH = 4;
        this.BULLET_HEIGHT = 10;
        this.ENEMY_WIDTH = 40;
        this.ENEMY_HEIGHT = 40;
        
        // Game state
        this.score = 0;
        this.gameOver = false;
        this.isActive = true;
        
        // Player properties
        this.player = {
            x: this.canvas.width / 2 - this.PLAYER_WIDTH / 2,
            y: this.canvas.height - this.PLAYER_HEIGHT - 20,
            speed: 5
        };
        
        // Arrays for game objects
        this.bullets = [];
        this.enemies = [];
        this.enemyTimer = 0;
        
        // Input handling
        this.keys = {};
        this.setupInputs();
        
        // Start game loop
        this.gameLoop();
    }
    
    cleanup() {
        this.isActive = false;
        document.removeEventListener('keydown', this.keydownHandler);
        document.removeEventListener('keyup', this.keyupHandler);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setupInputs() {
        this.keydownHandler = (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') {
                this.shootBullet();
                if (this.gameOver) {
                    this.resetGame();
                }
            }
        };
        
        this.keyupHandler = (e) => {
            this.keys[e.code] = false;
        };

        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);
    }
    
    shootBullet() {
        if (!this.gameOver) {
            this.bullets.push({
                x: this.player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
                y: this.player.y,
                speed: 7
            });
        }
    }
    
    spawnEnemy() {
        this.enemies.push({
            x: Math.random() * (GALAGA_CANVAS_WIDTH - ENEMY_WIDTH),
            y: -ENEMY_HEIGHT,
            speed: 2 + Math.random() * 2,
            movePattern: Math.random() > 0.5 ? 'zigzag' : 'straight',
            angle: 0
        });
    }
    
    update() {
        if (this.gameOver) return;
        
        // Update player position
        if (this.keys['ArrowLeft'] && this.player.x > 0) {
            this.player.x -= this.player.speed;
        }
        if (this.keys['ArrowRight'] && this.player.x < GALAGA_CANVAS_WIDTH - PLAYER_WIDTH) {
            this.player.x += this.player.speed;
        }
        
        // Update bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].y -= this.bullets[i].speed;
            if (this.bullets[i].y < 0) {
                this.bullets.splice(i, 1);
            }
        }
        
        // Spawn enemies
        this.enemyTimer++;
        if (this.enemyTimer > 60) {
            this.enemyTimer = 0;
            if (Math.random() < 0.3) {
                this.spawnEnemy();
            }
        }
        
        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.y += enemy.speed;
            
            if (enemy.movePattern === 'zigzag') {
                enemy.angle += 0.05;
                enemy.x += Math.sin(enemy.angle) * 2;
            }
            
            // Check for collision with player
            if (this.checkCollision(
                enemy.x, enemy.y, ENEMY_WIDTH, ENEMY_HEIGHT,
                this.player.x, this.player.y, PLAYER_WIDTH, PLAYER_HEIGHT
            )) {
                this.gameOver = true;
            }
            
            // Check for collision with bullets
            for (let j = this.bullets.length - 1; j >= 0; j--) {
                if (this.checkCollision(
                    enemy.x, enemy.y, ENEMY_WIDTH, ENEMY_HEIGHT,
                    this.bullets[j].x, this.bullets[j].y, BULLET_WIDTH, BULLET_HEIGHT
                )) {
                    this.enemies.splice(i, 1);
                    this.bullets.splice(j, 1);
                    this.score += 100;
                    break;
                }
            }
            
            // Remove enemies that go off screen
            if (enemy.y > GALAGA_CANVAS_HEIGHT) {
                this.enemies.splice(i, 1);
            }
        }
    }
    
    checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2 &&
               x1 + w1 > x2 &&
               y1 < y2 + h2 &&
               y1 + h1 > y2;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, GALAGA_CANVAS_WIDTH, GALAGA_CANVAS_HEIGHT);
        
        // Draw player
        this.ctx.fillStyle = '#0F0';
        this.ctx.fillRect(this.player.x, this.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
        
        // Draw bullets
        this.ctx.fillStyle = '#FFF';
        this.bullets.forEach(bullet => {
            this.ctx.fillRect(bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT);
        });
        
        // Draw enemies
        this.ctx.fillStyle = '#F00';
        this.enemies.forEach(enemy => {
            this.ctx.fillRect(enemy.x, enemy.y, ENEMY_WIDTH, ENEMY_HEIGHT);
        });
        
        // Draw score
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 20, 30);
        
        // Draw game over message
        if (this.gameOver) {
            this.ctx.fillStyle = '#FFF';
            this.ctx.font = '40px Arial';
            this.ctx.fillText('Game Over!', GALAGA_CANVAS_WIDTH/2 - 100, GALAGA_CANVAS_HEIGHT/2);
            this.ctx.font = '20px Arial';
            this.ctx.fillText('Press Space to Restart', GALAGA_CANVAS_WIDTH/2 - 100, GALAGA_CANVAS_HEIGHT/2 + 40);
        }
    }
    
    resetGame() {
        this.score = 0;
        this.gameOver = false;
        this.bullets = [];
        this.enemies = [];
        this.enemyTimer = 0;
        this.player = {
            x: GALAGA_CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
            y: GALAGA_CANVAS_HEIGHT - PLAYER_HEIGHT - 20,
            speed: 5
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
    module.exports = GalagaGame;
} 