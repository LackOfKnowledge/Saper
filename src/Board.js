import { Cell } from "./Cell.js";

export class Board {
  constructor(width, height, mines) {
    this.width = width;
    this.height = height;
    this.mines = mines;
    this.cells = [];
    this.gameOver = false;

    // Inicjalizacja komórek
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.cells.push(new Cell(x, y));
      }
    }

    // Umieszczanie losowo min na planszy
    for (let i = 0; i < mines; i++) {
      let cell = null;
      do {
        cell = this.cells[Math.floor(Math.random() * this.cells.length)];
      } while (cell.mine);
      cell.mine = true;
    }

    // Obliczanie sąsiadujących min dla każdej komórki
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

      // Obsługa zdarzeń kliknięcia
      cellElement.addEventListener("click", () => {
        if (!this.gameOver) {
          this.reveal(cell.x, cell.y);
          cellElement.className = ""; // Usuń wszystkie istniejące klasy
          cellElement.classList.add(...cell.render().classList); // Dodaj aktualne klasy komórki
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
        // Odkryj całą planszę
        this.cells.forEach((cell) => {
          cell.reveal();
          cell.update(); // Aktualizuj element DOM komórki
        });
      } else if (cell.count === 0) {
        // Odkryj wszystkie sąsiednie komórki bez min
        const neighbors = this.getNeighbors(x, y);
        neighbors
          .filter((neighbor) => !neighbor.mine)
          .forEach((neighbor) => this.reveal(neighbor.x, neighbor.y));
      }
    }
  }
}
