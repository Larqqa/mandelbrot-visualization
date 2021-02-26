export class Engine {
  constructor(canvas, program, shader) {
    this.shader = shader;
    this.running = false;
    this.canvas = canvas;
    this.program = program;
  }

  update() {
    this.ui.updatePerf();
  }

  render() {
    this.renderPerf = performance.now();
    this.canvas.clear();
    this.program.drawScene();
    this.renderPerf = Math.floor((performance.now() - this.renderPerf) * 100) / 100;
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
    this.fps = 0;
    this.missedFrameCount = 0;

    const animationLoop = () => {
      shouldRender = false;
      firstTime = window.performance.now() / 1000.0;
      passedTime = firstTime - lastTime;
      lastTime = firstTime;
      unprocessedTime += passedTime;
      frameTime += passedTime;

      while (unprocessedTime >= updateCap) {
        unprocessedTime -= updateCap;
        shouldRender = true;

        this.update();

        // Update FPS counter
        if (frameTime >= 1.0) {
          frameTime = 0;
          this.fps = frames;
          frames = 0;
          this.missedFrameCount = frameTarget - this.fps;

          // console.log(`FPS: ${this.fps}  Missed frames: ${this.missedFrameCount}   Render time: ${this.renderPerf} ms`);
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
      }
    };

    window.requestAnimationFrame(animationLoop);
  }

  stop() {
    this.running = false;
    console.error('Engine stopped');
  }
}