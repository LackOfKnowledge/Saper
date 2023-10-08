import { Cell } from "./Cell.js";

export class Board {
  constructor(width, height, mines) {
    this.width = width;
    this.height = height;
    this.mines = mines;
    this.cells = [];
    this.gameOver = false;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.cells.push(new Cell(x, y));
      }
    }

    for (let i = 0; i < mines; i++) {
      let cell = null;
      do {
        cell = this.cells[Math.floor(Math.random() * this.cells.length)];
      } while (cell.mine);
      cell.mine = true;
    }

    this.cells.forEach((cell) => {
      if (!cell.mine) {
        const neighbors = this.getNeighbors(cell.x, cell.y);
        cell.count = neighbors.filter((neighbor) => neighbor.mine).length;
      }
    });
  }

  getNeighbors(x, y) {
    const neighbors = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
          neighbors.push(this.cells[nx + ny * this.width]);
        }
      }
    }
    return neighbors;
  }

  render(container) {
    container.style.gridTemplateColumns = `repeat(${this.width}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${this.height}, 1fr)`;
    container.innerHTML = "";
    this.cells.forEach((cell) => {
      const cellElement = cell.render();
      container.appendChild(cellElement);

      cellElement.addEventListener("click", () => {
        if (!this.gameOver) {
          this.reveal(cell.x, cell.y);
          cellElement.className = "";
          cellElement.classList.add(...cell.render().classList);
        }
      });
    });
  }

  reveal(x, y) {
    const cell = this.cells.find((cell) => cell.x === x && cell.y === y);
    if (cell && !cell.revealed) {
      cell.reveal();

      if (cell.mine) {
        this.gameOver = true;
        alert("Game Over");
        this.cells.forEach((cell) => {
          cell.reveal();
          cell.update();
        });
      } else if (cell.count === 0) {
        const neighbors = this.getNeighbors(x, y);
        cell.reveal();
        cell.update();
        neighbors
          .filter((neighbor) => !neighbor.mine)
          .forEach((neighbor) => this.reveal(neighbor.x, neighbor.y));
      } else {
        cell.reveal();
        cell.update();
      }
    }
  }
}
