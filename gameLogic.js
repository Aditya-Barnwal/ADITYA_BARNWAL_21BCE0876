// server/gameLogic.js

class Game {
    constructor() {
      this.grid = Array(5).fill(null).map(() => Array(5).fill(null));
      this.players = { A: [], B: [] };
      this.turn = 'A';
    }
  
    initializePlayer(playerId, characters) {
      if (playerId === 'A') {
        this.grid[0] = characters;
        this.players.A = characters;
      } else if (playerId === 'B') {
        this.grid[4] = characters;
        this.players.B = characters;
      }
    }
  
    validateMove(playerId, move) {
      const [char, direction] = move.split(':');
      const charPos = this.findCharacterPosition(playerId, char);
  
      if (!charPos) return false;
      
      let [x, y] = charPos;
  
      const movement = {
        L: [0, -1],
        R: [0, 1],
        F: playerId === 'A' ? [1, 0] : [-1, 0],
        B: playerId === 'A' ? [-1, 0] : [1, 0],
        FL: playerId === 'A' ? [1, -1] : [-1, 1],
        FR: playerId === 'A' ? [1, 1] : [-1, -1],
        BL: playerId === 'A' ? [-1, -1] : [1, 1],
        BR: playerId === 'A' ? [-1, 1] : [1, -1],
      };
  
      if (!movement[direction]) return false;
  
      const [dx, dy] = movement[direction];
      x += dx;
      y += dy;
  
      if (x < 0 || x >= 5 || y < 0 || y >= 5) return false;
      if (this.grid[x][y] && this.grid[x][y][0] === playerId) return false;
  
      return { x, y };
    }
  
    makeMove(playerId, move) {
      const validation = this.validateMove(playerId, move);
  
      if (!validation) return false;
  
      const [char, ] = move.split(':');
      const [oldX, oldY] = this.findCharacterPosition(playerId, char);
  
      const { x: newX, y: newY } = validation;
  
      this.grid[oldX][oldY] = null;
      this.grid[newX][newY] = char;
  
      this.turn = this.turn === 'A' ? 'B' : 'A';
      return true;
    }
  
    findCharacterPosition(playerId, char) {
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          if (this.grid[i][j] === char && this.grid[i][j][0] === playerId) {
            return [i, j];
          }
        }
      }
      return null;
    }
  
    checkGameOver() {
      const AAlive = this.players.A.some(char => this.findCharacterPosition('A', char));
      const BAlive = this.players.B.some(char => this.findCharacterPosition('B', char));
  
      if (!AAlive) return 'B';
      if (!BAlive) return 'A';
      return null;
    }
  
    getGameState() {
      return {
        grid: this.grid,
        turn: this.turn,
      };
    }
  }
  
  module.exports = Game;
  