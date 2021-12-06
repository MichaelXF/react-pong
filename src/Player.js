import Game from "./Game";
import { getDistance } from "./math";
import { getRandomInteger } from "./random";

export default class Player {
  constructor(game) {
    this.x = 100;
    this.y = 100;
    this.w = 10;
    this.h = 100;
    this.score = 0;

    /**
     * @type {Game}
     */
    this.game = game;

    this.speed = 450;

    this.randomTick = 0;
    this.randomValue = 0;
  }

  moveToCenter() {
    this.y = this.game.canvas.height / 2 - this.h / 2;
  }

  isControlling() {
    return !this.game.demo && this === this.game.player1;
  }

  isCPU() {
    return this.game.demo || this === this.game.player2;
  }

  getCenter() {
    return [this.x + this.w / 2, this.y + this.h / 2];
  }

  render() {
    this.game.ctx.fillStyle = "#fff";
    this.game.ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  update(delta) {
    if (this.isCPU()) {
      if (this.game.cpu) {
        var opposing =
          this === this.game.player1 ? this.game.player2 : this.game.player1;

        var opposingDistance = getDistance(
          this.x,
          this.y,
          opposing.x,
          opposing.y
        );
        var ballDistance = getDistance(
          this.x,
          this.y,
          this.game.ball.x,
          this.game.ball.y
        );

        this.randomTick += delta;
        if (this.randomTick > 4) {
          this.randomTick = 0;

          this.randomValue = getRandomInteger(-this.h / 2, this.h / 2);
        }

        if (ballDistance < opposingDistance / 2) {
          var diff = Math.abs(
            this.game.ball.y - (this.game.ball.y > this.y + this.h / 2)
          );

          if (diff > 5) {
            if (this.game.ball.y > this.y + this.h / 2 + this.randomValue) {
              this.y += delta * this.speed;
            } else {
              this.y -= delta * this.speed;
            }
          }
        } else {
          var diff = Math.abs(
            this.game.canvas.height / 2 -
              (this.y + this.h / 2 + this.randomValue)
          );

          if (diff > 5) {
            if (
              this.y + this.h / 2 + this.randomValue >
              this.game.canvas.height / 2
            ) {
              this.y -= delta * this.speed;
            } else {
              this.y += delta * this.speed;
            }
          }
        }
      } else {
        if (this.game.inputManager.isKeyDown("ArrowUp")) {
          this.y -= delta * this.speed;
        }
        if (this.game.inputManager.isKeyDown("ArrowDown")) {
          this.y += delta * this.speed;
        }
      }
    }

    if (this.isControlling()) {
      if (this.game.inputManager.isKeyDown("w")) {
        this.y -= delta * this.speed;
      }
      if (this.game.inputManager.isKeyDown("s")) {
        this.y += delta * this.speed;
      }
    }

    this.y = Math.min(this.game.canvas.height - this.h, Math.max(0, this.y));
  }
}
