import { Board } from "./src/Board.js";

let board = new Board(10, 10, 10);
board.render(document.getElementById("app"));

document.getElementById("settings").addEventListener("submit", (event) => {
  event.preventDefault();

  const width = parseInt(document.getElementById("width").value);
  const height = parseInt(document.getElementById("height").value);
  const mines = parseInt(document.getElementById("mines").value);

  board = new Board(width, height, mines);
  board.render(document.getElementById("app"));
});
