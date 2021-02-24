export class Controls {
  constructor(canvas, shader, program, ui) {
    this.canvas = canvas;
    this.shader = shader;
    this.program = program;
    this.ui = ui;

    this.movementModifier = 5;
    this.zoomModifier = .1;
    this.zoomMoveModifier = .15;
    this.iterationModifier = 1;
    this.juliaOffset = .005 / Math.PI;

    this.resizeCanvas();
    this.moveCanvas();
    this.mouseZoom();
    this.mouseMove();
    this.touchMove();
    this.touchZoom();
  }

  resizeCanvas() {
    window.addEventListener('resize', () => {
      this.canvas.resize(window.innerWidth, window.innerHeight);
      this.program.buffers = this.program.initBuffers();
    });
  }

  mouseZoom() {
    window.addEventListener('wheel', (e) => {
      if (e.deltaY < 0) {
        this.program.scale *= 1 - this.zoomModifier;
      } else {
        this.program.scale *= 1 + this.zoomModifier;
      }

      this.xOffset = (this.canvas.xCenter - e.clientX) * this.program.scale;
      this.yOffset = (this.canvas.yCenter - e.clientY) * this.program.scale;

      this.program.xOffset += this.xOffset * this.zoomMoveModifier;
      this.program.yOffset -= this.yOffset * this.zoomMoveModifier;

      this.ui.updateUI();
    });
  }

  touchZoom() {
    const calcTouchZoom = (e) => {
      console.log(e.touches.length);

      if (this.click && e.touches.length === 2) {
        const x1 = e.touches[0].clientX;
        const y1 = e.touches[0].clientY;

        const x2 = e.touches[1].clientX;
        const y2 = e.touches[1].clientY;

        const a = Math.floor(x2 - x1);
        const b = Math.floor(y2 - y1);

        const d = Math.sqrt(a*a + b*b);
        const change = Math.floor(this.d - d);
        this.d = d;

        if (change < -5 || change > 5) {
          if (change < 0) {
            this.program.scale *= 1 - this.zoomModifier;
          } else {
            this.program.scale *= 1 + this.zoomModifier;
          }

          this.xOffset = (this.canvas.xCenter - ((x1 + x2) / 2)) * this.program.scale;
          this.yOffset = (this.canvas.yCenter - ((y1 + y2) / 2)) * this.program.scale;
          this.program.xOffset += this.xOffset * this.zoomMoveModifier;
          this.program.yOffset -= this.yOffset * this.zoomMoveModifier;
        }

        this.ui.updateUI();
      }
    };

    this.canvas.canvas.addEventListener('touchstart', (e) => {
      this.click = true;
      this.touches = e.touches;
      window.addEventListener('touchmove', calcTouchZoom);
    });

    this.canvas.canvas.addEventListener('touchend', () => {
      this.click = false;
      window.removeEventListener('touchmove', calcTouchZoom);
    });
  }

  mouseMove() {
    const calcMouseMove = (e) => {
      if (this.click) {
        this.xOffset = (this.mouseX - e.clientX);
        this.mouseX = e.clientX;

        this.yOffset = (this.mouseY - e.clientY);
        this.mouseY = e.clientY;

        this.program.xOffset -= this.xOffset  * this.program.scale;
        this.program.yOffset += this.yOffset  * this.program.scale;

        this.ui.updateUI();
      }
    };

    this.canvas.canvas.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.click = true;
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      window.addEventListener('mousemove', calcMouseMove);
    });

    this.canvas.canvas.addEventListener('mouseup', () => {
      this.click = false;
      window.removeEventListener('mousemove', calcMouseMove);
    });
  }

  touchMove() {
    const calcTouchMove = (e) => {
      if (this.click && this.touches.length === 1) {
        const x = e.touches[0].clientX - this.canvas.xCenter;
        const y = e.touches[0].clientY - this.canvas.yCenter;

        this.xOffset = (this.mouseX - x);
        this.mouseX = x;

        this.yOffset = (this.mouseY - y);
        this.mouseY = y;

        this.program.xOffset -= this.xOffset  * this.program.scale;
        this.program.yOffset += this.yOffset  * this.program.scale;

        this.ui.updateUI();
      }
    };

    this.canvas.canvas.addEventListener('touchstart', (e) => {
      this.click = true;
      this.mouseX = e.touches[0].clientX - this.canvas.xCenter;
      this.mouseY = e.touches[0].clientY - this.canvas.yCenter;
      window.addEventListener('touchmove', calcTouchMove);
    });

    this.canvas.canvas.addEventListener('touchend', () => {
      this.click = false;
      window.removeEventListener('touchmove', calcTouchMove);
    });
  }

  moveCanvas() {
    window.addEventListener('keydown', (e) => {
      this.offset = this.movementModifier * this.program.scale;

      if (e.code === 'KeyD') {
        this.program.xOffset -= this.offset;
      } else if (e.code === 'KeyA') {
        this.program.xOffset += this.offset;
      }

      if (e.code === 'KeyW') {
        this.program.yOffset -= this.offset;
      } else if (e.code === 'KeyS') {
        this.program.yOffset += this.offset;
      }

      if (e.code === 'KeyQ') {
        this.program.scale *= 1 - this.zoomModifier;
      } else if (e.code === 'KeyE') {
        this.program.scale *= 1 + this.zoomModifier;
      }

      if (e.code === 'KeyZ') {
        this.shader.iterations += this.iterationModifier;
        this.shader.updateIterations();
        this.program.reloadShaders();
      } else if (e.code === 'KeyX') {
        this.shader.iterations -= this.iterationModifier;
        this.shader.iterations = this.shader.iterations < 0 ? 0 : this.shader.iterations;
        this.shader.updateIterations();
        this.program.reloadShaders();
      }

      if (e.code === 'KeyC') {
        this.program.isJulia = !this.program.isJulia;
      }

      if (e.code === 'KeyR') {
        this.program.aOffset += this.juliaOffset;
      } else if (e.code === 'KeyT') {
        this.program.aOffset -= this.juliaOffset;
      }

      if (e.code === 'KeyF') {
        this.program.bOffset += this.juliaOffset;
      } else if (e.code === 'KeyG') {
        this.program.bOffset -= this.juliaOffset;
      }

      if (e.code === 'KeyV') {
        this.ui.uiWrapper.classList.toggle('hide');
        this.ui.footer.classList.toggle('hide');
      }

      if (
        e.code === 'KeyD' ||
        e.code === 'KeyA' ||
        e.code === 'KeyW' ||
        e.code === 'KeyS' ||
        e.code === 'KeyQ' ||
        e.code === 'KeyE' ||
        e.code === 'KeyZ' ||
        e.code === 'KeyX' ||
        e.code === 'KeyC' ||
        e.code === 'KeyR' ||
        e.code === 'KeyT' ||
        e.code === 'KeyF' ||
        e.code === 'KeyG'
      ) {
        this.ui.updateUI();
      }

    });
  }
}