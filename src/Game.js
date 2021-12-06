import Ball from "./Ball";
import InputManager from "./InputManager";
import ParticleSystem from "./ParticleSystem";
import Player from "./Player";

export default class Game {
  constructor(canvas, ctx, updateScoresCallback) {
    /**
     * @type {HTMLCanvasElement}
     */
    this.canvas = canvas;

    /**
     * @type {CanvasRenderingContext2D}
     */
    this.ctx = ctx;

    this.updateScoresCallback = updateScoresCallback;

    this.inputManager = new InputManager();
    this.particleSystem = new ParticleSystem(this);

    this.player1 = new Player(this);
    this.player2 = new Player(this);
    this.ball = new Ball(this);

    this.ballActive = false;

    this.demo = true;
    this.cpu = true;

    this.resetId = "";
  }

  start() {
    this.inputManager.attach();
  }

  reset() {
    this.updateScoresCallback(this.player1.score, this.player2.score);
    this.ball.moveToCenter();
    this.ball.clearVelocity();
    this.ballActive = false;
    this.particleSystem.particles = [];

    // Hacky way to ensure this setTimeout only runs once, a better solution would be to use cancelTimeout
    var id = {};
    this.resetId = id;

    setTimeout(() => {
      if (this.resetId === id) {
        this.ball.setRandomVelocity();
        this.ball.bounceEffect();
        this.ballActive = true;
      }
    }, 1000);
  }

  render() {
    this.ctx.fillStyle = "#222";
    this.ctx.fillRect(this.canvas.width / 2 - 1, 0, 2, this.canvas.height);

    this.player1.render();
    this.player2.render();
    this.ball.render();
    this.particleSystem.render();
  }

  update(delta) {
    this.player1.update(delta);
    this.player2.update(delta);

    if (this.ballActive) {
      this.ball.update(delta);
    }
    this.particleSystem.update(delta);

    // game logic

    // player 1 loses
    if (this.ball.x + this.ball.r < this.player1.x) {
      this.player2.score++;
      this.reset();
    }

    // player 2 loses
    if (this.ball.x - this.ball.r > this.player2.x + this.player2.w) {
      this.player1.score++;
      this.reset();
    }
  }
}
