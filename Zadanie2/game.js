//[EXAM] Create bouncy simulator. Get board from ExampleInput.js.
//  Y – when bouncing objects enters it move it to random direction
//  other that it came and Y turns into 0,    X – border, 0 – boards object can travel,
//  1 – bouncing object. The program is to show how the object would travel and bounce
//  against the walls. Bouncing objects starts in any corner. 1 and Y position may vary.

"use strict";

const board = [
  ["X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X"],
  ["X", "0", "0", "X", "X", "X", "X", "X", "X", "X", "X", "X"],
  ["X", "0", "0", "0", "X", "X", "X", "X", "X", "X", "X", "X"],
  ["X", "0", "0", "0", "0", "X", "X", "X", "X", "X", "X", "X"],
  ["X", "0", "0", "0", "0", "0", "X", "X", "X", "X", "X", "X"],
  ["X", "0", "0", "0", "0", "0", "0", "X", "X", "X", "X", "X"],
  ["X", "0", "0", "0", "0", "0", "0", "0", "X", "X", "X", "X"],
  ["X", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "X"],
  ["X", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "X"],
  ["X", "0", "0", "0", "X", "0", "0", "0", "0", "Y", "0", "X"],
  ["X", "0", "0", "X", "X", "X", "0", "0", "0", "0", "0", "X"],
  ["X", "0", "0", "0", "X", "0", "0", "0", "0", "0", "0", "X"],
  ["X", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "X"],
  ["X", "0", "0", "Y", "0", "0", "0", "0", "0", "0", "0", "X"],
  ["X", "1", "0", "0", "0", "0", "0", "0", "0", "0", "0", "X"],
  ["X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X"],
];

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let ballRadius = 10;
let dx = 1;
let dy = -1;
let brickWidth = 20;
let brickHeight = 20;
let counter = 0;
let requestId;

canvas.height = board.length * brickWidth;
canvas.width = board[0].length * brickHeight;

class Game {
  constructor(board) {
    this.board = board;
    this.initialize();
  }

  initialize() {
    let bricks = [];
    for (let i = 0; i < board.length; i++) {
      bricks[i] = [];
      for (let j = 0; j < board[i].length; j++) {
        const current = board[i][j];
        // console.log(`current: ${current}`);
        if (current === "Y") {
          bricks[i][j] = { status: true, wall: false };
        } else if (current === "X") {
          bricks[i][j] = { wall: true };
        } else if (current == "1") {
          this.x = brickWidth * j + ballRadius;
          this.initialX = this.x;
          this.y = brickWidth * i + ballRadius;
          this.initialY = this.y;
        }
      }
    }
    this.bricks = bricks;
  }

  collisionDetection() {
    let x = this.x;
    let y = this.y;
    let bricks = this.bricks;
    for (let c = 0; c < board.length; c++) {
      for (let r = 0; r < board[c].length; r++) {
        let b = bricks[c][r];
        if (b && b.status === true && b.wall === false) {
          if (
            x > b.x - ballRadius &&
            x < b.x + brickWidth + ballRadius &&
            y > b.y - ballRadius &&
            y < b.y + brickHeight + ballRadius
          ) {
            dy = -dy;
            b.status = false;
            counter++;
            console.log(`x: ${x}`);
            console.log(`b.x: ${b.x}`);
          }
        } else if (b && b.wall === true) {
          if (
            x > b.x - ballRadius &&
            x < b.x + brickWidth + ballRadius &&
            y > b.y - ballRadius &&
            y < b.y + brickHeight + ballRadius
          ) {
            if (dx < 0 && dy < 0) {
              dx = -Math.abs(dx);
              dy = Math.abs(dy);
            } else if (dx < 0 && dy > 0) {
              dx = Math.abs(dx);
              dy = Math.abs(dy);
            } else if (dx > 0 && dy < 0) {
              dx = -Math.abs(dx);
              dy = -Math.abs(dy);
            } else if (dx > 0 && dy > 0) {
              dx = Math.abs(dx);
              dy = -Math.abs(dy);
            }
            counter++;
            return;
          }
        }
      }
    }
  }

  drawBall() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

  drawBricks() {
    let bricks = this.bricks;
    for (let c = 0; c < board.length; c++) {
      for (let r = 0; r < board[c].length; r++) {
        if (board[c][r] === "Y" && bricks[c][r].status == true) {
          let brickX = r * brickWidth;
          let brickY = c * brickHeight;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;

          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "green";
          ctx.fill();
          ctx.closePath();
        } else if (board[c][r] === "X") {
          let brickX = r * brickWidth;
          let brickY = c * brickHeight;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;

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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawBricks();
    this.drawBall();
    this.collisionDetection();

    let x = this.x;
    let y = this.y;

    x += dx;
    y += dy;

    this.x = x;
    this.y = y;

    if (counter == 100) {
      window.cancelAnimationFrame(requestId);
      return;
    } else {
      requestId = requestAnimationFrame(this.draw.bind(this));
    }
  }
}

let game = new Game(board);
game.draw();
