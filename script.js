// client/script.js

const ws = new WebSocket('ws://localhost:8080');

let playerId = null;

ws.onopen = () => {
  playerId = prompt("Enter your player ID (A or B):");

  const characters = prompt("Enter your characters (comma separated, e.g., A-P1,A-H1,A-H2):").split(',');
  ws.send(JSON.stringify({ action: 'init', playerId, characters }));
};

ws.onmessage = (message) => {
  const data = JSON.parse(message.data);

  switch (data.action) {
    case 'update':
      updateBoard(data.state);
      break;
    case 'invalidMove':
      alert("Invalid move. Try again.");
      break;
    case 'gameOver':
      document.getElementById('game-over').style.display = 'block';
      alert(`${data.winner} wins!`);
      break;
    default:
      break;
  }
};

document.getElementById('move-button').addEventListener('click', () => {
  const move = document.getElementById('move-input').value;
  ws.send(JSON.stringify({ action: 'move', playerId, move }));
});

document.getElementById('new-game-button').addEventListener('click', () => {
  location.reload();
});

function updateBoard(state) {
  const board = document.getElementById('game-board');
  board.innerHTML = '';

  state.grid.forEach((row, rowIndex) => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';

    row.forEach((cell, cellIndex) => {
      const cellDiv = document.createElement('div');
      cellDiv.className = 'cell';
      cellDiv.innerText = cell || '';
      rowDiv.appendChild(cellDiv);
    });

    board.appendChild(rowDiv);
  });
}
