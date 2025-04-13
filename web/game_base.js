// Single source of shared constants and game management
window.GameConstants = {
    CANVAS: {
        WIDTH: 800,
        HEIGHT: 600
    }
};

// Global game manager
window.GameManager = {
    currentGame: null,
    stopCurrentGame: function() {
        if (this.currentGame && typeof this.currentGame.cleanup === 'function') {
            this.currentGame.cleanup();
            this.currentGame = null;
        }
    }
}; 