import Game from "./Game";
import Player from "./Player";
import { getRandom } from "./random";

export default class Ball {
  constructor(game) {
    this.x = 100;
    this.y = 100;
    this.r = 10;

    this.vx = 0;
    this.vy = 0;

    /**
     * @type {Game}
     */
    this.game = game;

    this.trailTick = 0;
    this.bounces = 0;
  }

  moveToCenter() {
    this.x = this.game.canvas.width / 2;
    this.y = this.game.canvas.height / 2;
  }

  clearVelocity() {
    this.vx = 0;
    this.vy = 0;

    this.bounces = 0;
  }

  setRandomVelocity() {
    var w = this.game.canvas.width / 4;
    var h = this.game.canvas.height / 4;

    this.vx = getRandom(w / 1.6, w) * (Math.random() > 0.5 ? 1 : -1);
    this.vy = getRandom(h / 1.6, h) * (Math.random() > 0.5 ? 1 : -1);
  }

  bounceEffect(contactX, contactY) {
    this.bounces++;

    var bounceForce = Math.max(0.01, this.bounces / 200);

    this.vx *= 1 + bounceForce;
    this.vy *= 1 + bounceForce;

    this.game.particleSystem.spawnParticles(
      contactX ?? this.x,
      contactY ?? this.y
    );
  }

  render() {
    this.game.ctx.beginPath();
    this.game.ctx.fillStyle = "#fff";
    this.game.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    this.game.ctx.fill();
    this.game.ctx.closePath();
  }

  getSpeed() {
    return Math.pow(Math.max(Math.abs(this.vx), Math.abs(this.vy)), 2);
  }

  update(delta) {
    this.x += this.vx * delta;
    this.y += this.vy * delta;

    this.trailTick += delta;
    if (this.trailTick * this.bounces > 100000 / this.getSpeed()) {
      this.trailTick = 0;

      this.game.particleSystem.spawnParticles(this.x, this.y, 1, 0.1);
    }

    // bounce off left wall
    if (this.x < this.r) {
      this.vx = Math.abs(this.vx);
      this.x = this.r;

      this.bounceEffect();
    }

    // bounce off top wall
    if (this.y < this.r) {
      this.vy = Math.abs(this.vy);
      this.y = this.r;
      this.bounceEffect();
    }

    // bounce off right wall
    if (this.x > this.game.canvas.width - this.r) {
      this.vx = -Math.abs(this.vx);
      this.x = this.game.canvas.width - this.r;
      this.bounceEffect();
    }

    // bounce off bottom wall
    if (this.y > this.game.canvas.height - this.r) {
      this.vy = -Math.abs(this.vy);
      this.y = this.game.canvas.height - this.r;
      this.bounceEffect();
    }

    // bounce off P1 paddle
    if (this.collidesWithRect(this.game.player1)) {
      this.handleCollision(this.game.player1);
    }

    // bounce off P2 paddle
    if (this.collidesWithRect(this.game.player2)) {
      this.handleCollision(this.game.player2);
    }
  }

  /**
   * @param {Player} player
   * @returns
   */
  handleCollision(player) {
    var center = player.getCenter();

    var angleRadians = Math.atan2(this.y - center[1], this.x - center[0]);

    var max = Math.max(Math.abs(this.vx), Math.abs(this.vy));

    var vector = [Math.cos(angleRadians) * max, Math.sin(angleRadians) * max];

    this.vx = vector[0];
    this.vy = vector[1];

    if (player === this.game.player1) {
      if (this.vx < max) {
        this.vx = max;
      }

      this.bounceEffect(player.x + player.w, this.y);
    } else if (player === this.game.player2) {
      if (this.vx < -max) {
        this.vx = -max;
      }

      this.bounceEffect(player.x - 2, this.y);
    }
  }

  /**
   * @param {Player} rect
   * @returns
   */
  collidesWithRect(rect) {
    var circle = this;

    var distX = Math.abs(circle.x - rect.x - rect.w / 2);
    var distY = Math.abs(circle.y - rect.y - rect.h / 2);

    if (distX > rect.w / 2 + circle.r) {
      return false;
    }
    if (distY > rect.h / 2 + circle.r) {
      return false;
    }

    if (distX <= rect.w / 2) {
      return true;
    }
    if (distY <= rect.h / 2) {
      return true;
    }

    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;
    return dx * dx + dy * dy <= circle.r * circle.r;
  }
}
