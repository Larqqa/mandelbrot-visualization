import { calcDistance, mapValue } from '../utils.js';

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
    this.mobileOffset = 2.5;

    this.resizeCanvas();
    this.keyboardControls();
    this.mouseControls();
    this.touchControls();
  }

  resizeCanvas() {
    window.addEventListener('resize', () => {
      this.canvas.resize(window.innerWidth, window.innerHeight);
      this.program.buffer = this.program.initBuffer();
    });
  }

  mouseControls() {

    // ZOOM
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

    // MOVE
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
      e.target.focus();

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

  touchControls() {
    const move = (e) => {
      if (this.click && e.touches.length === 1) {
        document.getElementById('doubletouch').innerHTML = Math.floor(e.touches[0].clientX);

        const x = e.touches[0].clientX - this.canvas.xCenter;
        const y = e.touches[0].clientY - this.canvas.yCenter;

        this.xOffset = (this.mouseX - x);
        this.mouseX = x;

        this.yOffset = (this.mouseY - y);
        this.mouseY = y;

        this.program.xOffset -= this.xOffset  * this.program.scale;
        this.program.yOffset += this.yOffset  * this.program.scale;
      }
    };

    const zoom = (e) => {
      if (this.click && e.touches.length === 2) {
        const x = e.touches[0].clientX;
        const y = e.touches[0].clientY;
        const x2 = e.touches[1].clientX;
        const y2 = e.touches[1].clientY;

        const xCenter = this.canvas.xCenter - ((x2 + x) / 2);
        const yCenter = this.canvas.yCenter - ((y2 + y) / 2);

        this.xOffset = xCenter * this.program.scale;
        this.yOffset = yCenter * this.program.scale;

        this.program.xOffset += this.xOffset * this.zoomMoveModifier / this.mobileOffset;
        this.program.yOffset -= this.yOffset * this.zoomMoveModifier / this.mobileOffset;

        this.d = calcDistance(x, y, x2, y2);

        if (!this.initialD) {
          this.initialD = this.d;
        }

        this.change = Math.floor(this.initialD - this.d);
        this.initialD = this.d;

        document.getElementById('doubletouchy').innerHTML = this.change;

        if (this.change < -1) {
          this.program.scale *= 1 - (this.zoomModifier / this.mobileOffset);
        } else if (this.change > 1) {
          this.program.scale *= 1 + (this.zoomModifier / this.mobileOffset);
        }
      }
    };

    window.addEventListener('touchstart', (e) => {
      this.click = true;

      this.mouseX = e.touches[0].clientX - this.canvas.xCenter;
      this.mouseY = e.touches[0].clientY - this.canvas.yCenter;

      window.addEventListener('touchmove', move, false);
      window.addEventListener('touchmove', zoom, false);
    });

    window.addEventListener('touchend', () => {
      this.click = false;

      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchmove', zoom);

      this.ui.updateUI();
    });
  }

  keyboardControls() {
    const keys = (e) => {
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
        this.ui.juliaWrap.classList.toggle('hide');
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
    };

    this.canvas.canvas.addEventListener('keydown', keys);
    this.canvas.canvas.removeEventListener('keyup', keys);
  }
}