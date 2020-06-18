//[EXAM] Create bouncy simulator. Get board from ExampleInput.js. X – border, 0 – boards object can travel,
// 1 – bouncing object. The program is to show how the object would travel and bounce against the walls.
// The program is to end when object comes back to original position.

// brickX -> to wartosc w pikselach; poczatek narysowanego prostokata
// x -> to srodek kulki ktora uderza w przeszkody

"use strict";

const board = [
  ["X", "X", "X", "X", "X", "X", "X", "X", "X", "X"],
  ["X", "0", "0", "0", "0", "0", "0", "1", "0", "X"],
  ["X", "0", "0", "0", "0", "0", "0", "0", "0", "X"],
  ["X", "0", "0", "0", "0", "0", "0", "0", "0", "X"],
  ["X", "0", "0", "0", "0", "0", "0", "0", "0", "X"],
  ["X", "0", "0", "0", "0", "0", "0", "0", "0", "X"],
  ["X", "0", "0", "0", "0", "0", "0", "0", "0", "X"],
  ["X", "0", "0", "0", "0", "0", "0", "0", "0", "X"],
  ["X", "0", "0", "0", "0", "0", "0", "0", "0", "X"],
  ["X", "X", "X", "X", "X", "X", "X", "X", "X", "X"],
];

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let ballRadius = 10;
let dx = 1;
let dy = -1;
let brickWidth = 20;
let brickHeight = 20;
let requestId;
canvas.height = board.length * brickWidth;
canvas.width = board[0].length * brickHeight;

class Game {
  constructor(board) {
    this.board = board;
    this.initialize();
  }

  initialize() {
    let bricks = []; //wrzucamy wszystkie przeszkody(zadanie2) i sciany
    for (let i = 0; i < board.length; i++) {
      bricks[i] = [];
      for (let j = 0; j < board[i].length; j++) {
        const current = board[i][j];
        console.log(`current: ${current}`);
        if (current === "X") {
          bricks[i][j] = true;
        } else if (current == "1") {
          this.x = brickWidth * j + ballRadius;
          this.initialX = this.x;
          this.y = brickWidth * i + ballRadius;
          this.initialY = this.y;
        }
      }
    }
    this.bricks = bricks;
    console.log(bricks);
  }

  drawBall() {
    ctx.beginPath(); //Tworzy nową ścieżkę. Po jej utworzeniu, wszelkie kolejne funkcje rysujące
    // będą się do niej odwoływały oraz kontynuowały jej rysunek.
    ctx.arc(this.x, this.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

  drawBricks() {
    let bricks = this.bricks;
    for (let c = 0; c < bricks.length; c++) {
      for (let r = 0; r < bricks[c].length; r++) {
        if (bricks[c][r]) {
          let brickX = r * brickWidth;
          let brickY = c * brickHeight;

          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "black";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Wymazuje prostokątny obszar, w wyniku czego staje się
    // on całkiem przezroczysty. Działą to jak gumka w formie prostokąta.
    this.drawBricks();
    this.drawBall();

    let x = this.x;
    let y = this.y;

    if (
      x + dx + brickWidth > canvas.width - ballRadius ||
      x + dx - brickWidth < ballRadius
    ) {
      dx = -dx;
    }
    if (
      y + dy + brickHeight > canvas.height - ballRadius ||
      y + dy - brickHeight < ballRadius
    ) {
      dy = -dy;
    }
    x += dx;
    y += dy;

    this.x = x;
    this.y = y;

    // Metoda window.cancelAnimationFrame anuluje żądanie ramki animacji zaplanowane
    // wcześniej za pomocą wywołania funkcji window.requestAnimationFrame ().
    if (x == this.initialX && y == this.initialY) {
      window.cancelAnimationFrame(requestId);
      return;
    } else {
      requestId = requestAnimationFrame(this.draw.bind(this));
    }
  }
}

let game = new Game(board);
game.draw();
