// server/index.js

const WebSocket = require('ws');
const Game = require('./gameLogic');

const wss = new WebSocket.Server({ port: 8080 });

let game = new Game();
let players = {};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    const { action, playerId, characters, move } = data;

    switch (action) {
      case 'init':
        if (!players[playerId]) {
          players[playerId] = ws;
          game.initializePlayer(playerId, characters);
        }
        break;
      case 'move':
        if (playerId === game.turn) {
          const validMove = game.makeMove(playerId, move);
          if (validMove) {
            const gameOver = game.checkGameOver();
            if (gameOver) {
              broadcast({ action: 'gameOver', winner: gameOver });
              game = new Game(); // reset game
            } else {
              broadcast({ action: 'update', state: game.getGameState() });
            }
          } else {
            ws.send(JSON.stringify({ action: 'invalidMove' }));
          }
        }
        break;
      default:
        break;
    }
  });
});

function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}
