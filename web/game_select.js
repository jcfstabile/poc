// Create a namespace for our games
const GameManager = (function() {
    // Private variables
    let currentGame = null;
    
    // Shared constants between games
    const CANVAS = {
        WIDTH: 800,
        HEIGHT: 600
    };

    // Dino game constants
    const DINO = {
        WIDTH: 60,
        HEIGHT: 60,
        GROUND_Y: 300 - 60,
        JUMP_FORCE: 20,
        GRAVITY: 0.8,
        CACTUS_WIDTH: 30,
        CACTUS_HEIGHT: 60
    };

    // Galaga game constants
    const GALAGA = {
        PLAYER_WIDTH: 50,
        PLAYER_HEIGHT: 50,
        BULLET_WIDTH: 4,
        BULLET_HEIGHT: 10,
        ENEMY_WIDTH: 40,
        ENEMY_HEIGHT: 40
    };

    class DinoGame {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.canvas.width = CANVAS.WIDTH;
            this.canvas.height = DINO.GROUND_Y + 60;
            
            // Load images
            this.loadImages();
            
            this.dinoFrames = {
                running: [0, 1],
                jumping: 2,
                dead: 3
            };
            this.currentFrame = 0;
            this.frameCount = 0;
            
            this.score = 0;
            this.gameOver = false;
            this.speed = 5;
            this.isActive = true;
            
            this.dino = {
                x: 50,
                y: DINO.GROUND_Y,
                velocityY: 0,
                isJumping: false
            };
            
            this.obstacles = [];
            this.obstacleTimer = 0;
            
            this.handleInputBound = this.handleInput.bind(this);
            document.addEventListener('keydown', this.handleInputBound);
        }

        // ... rest of DinoGame methods (same as before) ...

        cleanup() {
            this.isActive = false;
            document.removeEventListener('keydown', this.handleInputBound);
            this.ctx.clearRect(0, 0, CANVAS.WIDTH, this.canvas.height);
        }
    }

    class GalagaGame {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.canvas.width = CANVAS.WIDTH;
            this.canvas.height = CANVAS.HEIGHT;
            
            this.score = 0;
            this.gameOver = false;
            this.isActive = true;
            
            this.player = {
                x: CANVAS.WIDTH / 2 - GALAGA.PLAYER_WIDTH / 2,
                y: CANVAS.HEIGHT - GALAGA.PLAYER_HEIGHT - 20,
                speed: 5
            };
            
            this.bullets = [];
            this.enemies = [];
            this.enemyTimer = 0;
            
            this.keys = {};
            this.setupInputs();
            this.gameLoop();
        }

        // ... rest of GalagaGame methods (same as before) ...

        cleanup() {
            this.isActive = false;
            document.removeEventListener('keydown', this.keydownHandler);
            document.removeEventListener('keyup', this.keyupHandler);
            this.ctx.clearRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
        }
    }

    // Game manager methods
    function initGame(gameType) {
        if (currentGame && typeof currentGame.cleanup === 'function') {
            currentGame.cleanup();
        }

        switch(gameType) {
            case 'game1.js':
                currentGame = new DinoGame('gameCanvas');
                break;
            case 'game2.js':
                currentGame = new GalagaGame('gameCanvas');
                break;
            case 'game3.js':
                // Future game implementation
                break;
        }
    }

    // Public API
    return {
        initGame: initGame
    };
})();

// Game selection handler
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const gameSelector = document.getElementById('gameSelector');
        
        function initGame(gameType) {
            // Stop current game if exists
            window.GameManager.stopCurrentGame();

            // Initialize new game
            switch(gameType) {
                case 'game1.js':
                    window.GameManager.currentGame = new DinoGame('gameCanvas');
                    break;
                case 'game2.js':
                    window.GameManager.currentGame = new GalagaGame('gameCanvas');
                    break;
                case 'game3.js':
                    // Future game implementation
                    break;
            }
        }

        gameSelector.addEventListener('change', function() {
            initGame(this.value);
        });

        // Initialize first game
        initGame('game1.js');
    });
})(); 