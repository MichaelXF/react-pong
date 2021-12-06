import { useEffect, useRef, useState } from "react";
import Game from "./Game";

function App() {
  var canvasRef = useRef();

  var [p1, setP1] = useState(0);
  var [p2, setP2] = useState(0);

  /**
   * Show menu
   */
  var [menu, setMenu] = useState(false);
  var gameRef = useRef();

  useEffect(() => {
    /**
     * @type {HTMLCanvasElement}
     */
    var canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    /**
     * @type {CanvasRenderingContext2D}
     */
    var ctx = canvas.getContext("2d");

    var last = performance.now();

    var game = new Game(canvas, ctx, (p1, p2) => {
      setP1(p1);
      setP2(p2);
    });
    gameRef.current = game;

    var cb = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";

      game.player2.x = window.innerWidth - 100;
    };
    cb();

    game.player1.moveToCenter();
    game.player2.moveToCenter();
    game.ball.moveToCenter();

    function update() {
      var now = performance.now();
      var delta = (now - last) / 1000;
      last = now;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      game.update(delta);
      game.render();

      requestAnimationFrame(update);
    }

    update();

    setTimeout(() => {
      game.start();
      game.reset();
      setMenu(true);
    }, 100);

    window.addEventListener("resize", cb);

    return () => {
      cancelAnimationFrame(update);
      window.removeEventListener("resize", cb);
    };
  }, []);

  return (
    <div className={!menu ? "hide-cursor" : ""}>
      <div className={"main-menu" + (menu ? " main-menu-show" : "")}>
        <h1>Pong</h1>
        <p>by: MichaelXF</p>

        <button
          className='main-btn'
          onClick={() => {
            // Start game for Player vs. CPU
            gameRef.current.player1.score = 0;
            gameRef.current.player2.score = 0;
            gameRef.current.particleSystem.particles = [];
            gameRef.current.player1.moveToCenter();
            gameRef.current.player2.moveToCenter();
            gameRef.current.ball.moveToCenter();
            gameRef.current.demo = false;
            gameRef.current.cpu = true;
            gameRef.current.reset();
            setMenu(false);
          }}
        >
          Player vs. CPU
        </button>
        <button
          className='main-btn'
          onClick={() => {
            // Start game for Player vs. Player
            gameRef.current.player1.score = 0;
            gameRef.current.player2.score = 0;
            gameRef.current.particleSystem.particles = [];
            gameRef.current.player1.moveToCenter();
            gameRef.current.player2.moveToCenter();
            gameRef.current.ball.moveToCenter();
            gameRef.current.demo = false;
            gameRef.current.cpu = false;
            gameRef.current.reset();
            setMenu(false);
          }}
        >
          Player vs. Player
        </button>
      </div>

      <canvas ref={canvasRef} />

      <div className='scoreboard'>
        <div className='scoreboard-p1'>{p1}</div>
        <div className='scoreboard-p2'>{p2}</div>
      </div>

      <div className='controls'>
        <div className='controls-p1'>
          <kbd>W</kbd>
          <kbd>S</kbd>
        </div>
        <div className='controls-p2'>
          {gameRef?.current?.cpu ? (
            <kbd>CPU</kbd>
          ) : (
            <>
              <kbd>🠕</kbd>
              <kbd>
                <span
                  style={{
                    transform: "translate(0, 2px)",
                    display: "inline-block",
                  }}
                >
                  🠗
                </span>
              </kbd>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
