export default class InputManager {
  constructor() {
    this.keyboard = Object.create(null);
    this.mousePosition = [];

    this.events = [];
  }

  attach() {
    window.addEventListener("keydown", (e) => {
      this.handleKeyEvent(e, true);
    });

    window.addEventListener("keyup", (e) => {
      this.handleKeyEvent(e, false);
    });

    window.addEventListener("mousemove", (e) => {
      this.handleMouseMove(e);
    });
  }

  isKeyDown(char) {
    return !!this.keyboard[char.toLowerCase()];
  }

  getMousePosition() {
    return this.mousePosition;
  }

  /**
   * @param {KeyboardEvent} e
   * @param {boolean} state
   */
  handleKeyEvent(e, state) {
    this.keyboard[e.key.toLowerCase()] = state;
  }

  /**
   * @param {MouseEvent} e
   */
  handleMouseMove(e) {
    this.mousePosition = [e.clientX, e.clientY];
  }
}
