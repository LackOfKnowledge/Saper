export class Cell {
  constructor(x, y, mine = false) {
    this.x = x;
    this.y = y;
    this.mine = mine;
    this.revealed = false;
    this.count = 0; // Dodano liczbę sąsiadujących min
    this.element = this.createElement();
  }

  createElement() {
    const element = document.createElement("div");
    element.classList.add("cell");
    return element;
  }

  render() {
    if (this.revealed) {
      this.element.classList.add("revealed");
      if (this.mine) {
        this.element.classList.add("mine");
      } else {
        this.element.classList.add("safe");
        if (this.count > 0) {
          this.element.textContent = this.count.toString(); // Dodano wyświetlanie liczby sąsiadujących min
        }
      }
    }
    return this.element;
  }

  reveal() {
    this.revealed = true;
    if (this.mine) {
      this.element.classList.add("mine");
    } else {
      this.element.classList.add("safe");
      if (this.count > 0) {
        this.element.textContent = this.count.toString(); // Dodano wyświetlanie liczby sąsiadujących min
      }
    }
  }

  update() {
    // Usuń wszystkie istniejące klasy
    this.element.className = "";
    // Dodaj aktualne klasy komórki
    this.element.classList.add(...this.render().classList);
  }
}
