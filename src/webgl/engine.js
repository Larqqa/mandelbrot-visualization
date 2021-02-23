export class Engine {
  constructor(canvas, program) {
    this.running = false;
    this.canvas = canvas;
    this.program = program;
  }

  update() {
    this.program.rotation += .01;
  }

  render() {
    this.canvas.clear();
    this.program.drawScene();
  }

  start() {
    console.log('Engine started');
    this.running = true;

    const frameTarget = 60.0;
    const updateCap = 1.0 / frameTarget;
    let shouldRender = true;

    let firstTime = 0.0;
    let lastTime = window.performance.now() / 1000.0;
    let passedTime = 0.0;
    let unprocessedTime = 0.0;

    let frameTime = 0.0;
    let frames = 0;
    let fps = 0;
    let missedFrameCount = 0;

    const animationLoop = () => {
      shouldRender = false;

      // Set timers
      firstTime = window.performance.now() / 1000.0;
      passedTime = firstTime - lastTime;
      lastTime = firstTime;
      unprocessedTime += passedTime;
      frameTime += passedTime;

      // If the engine skips frames, update state untill caught up
      // Otherwise run ~once per frame
      while (unprocessedTime >= updateCap) {
        unprocessedTime -= updateCap;
        shouldRender = true;

        this.update();

        // Update FPS counter
        if (frameTime >= 1.0) {
          frameTime = 0;
          fps = frames;
          frames = 0;
          missedFrameCount = frameTarget - fps;

          console.log(`FPS: ${fps} Missed frames: ${missedFrameCount}`);
        }
      }

      // Do update
      this.update();

      // Do render
      if (shouldRender) {
        this.render();
        frames++;
      }

      if (this.running === true) {
        window.requestAnimationFrame(animationLoop);
      } else {
        console.error('Engine stopped');
      }
    }

    window.requestAnimationFrame(animationLoop);
  }
}