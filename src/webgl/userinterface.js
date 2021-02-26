import { getById } from '../utils.js';

export class UI {
  constructor(canvas, program, engine, shader) {
    this.canvas = canvas;
    this.program = program;
    this.engine = engine;
    this.shader = shader;

    this.uiWrapper = getById('ui-wrapper');
    this.fps = getById('fps').querySelector('span');
    this.missed = getById('missed').querySelector('span');
    this.render = getById('render').querySelector('span');
    this.x = getById('x');
    this.y = getById('y');
    this.scale = getById('scale');
    this.iterations = getById('iterations');
    this.julia = getById('julia');
    this.juliaWrap = getById('julia-wrap');
    this.a = getById('a');
    this.b = getById('b');
    this.footer = getById('footer');
    this.uiForm = getById('ui-form');
    this.hamburger = getById('hamburger');
    this.toggleH = getById('toggleH');
    this.hRange = getById('hRange');
    this.toggleS = getById('toggleS');
    this.sRange = getById('sRange');
    this.toggleV = getById('toggleV');
    this.vRange = getById('vRange');
    this.smoothing = getById('smoothing');
    this.blackAndWhite = getById('blackandwhite');
    this.invert = getById('invert');

    this.addEventListeners();
    this.updateUI();
  }

  addEventListeners() {
    this.uiForm.addEventListener('submit', (e) => this.calculateUI(e));

    this.julia.addEventListener('click', () => {
      this.program.isJulia = !this.program.isJulia;
      this.juliaWrap.classList.toggle('hide');
    });

    this.hamburger.addEventListener('click', () => {
      this.uiWrapper.classList.toggle('active');
      this.hamburger.classList.toggle('active');
    });


    this.toggleH.addEventListener('click', () => {
      if (this.hRange.disabled === true) {
        this.hRange.disabled = false;
        this.program.h = this.hRange.value;
      } else {
        this.hRange.disabled = true;
        this.program.h = -1.0;
      }
    });

    this.hRange.addEventListener('input', (e) => {
      this.program.h = e.target.value;
    });

    this.toggleS.addEventListener('click', () => {
      if (this.sRange.disabled === true) {
        this.sRange.disabled = false;
        this.program.s = this.sRange.value;
      } else {
        this.sRange.disabled = true;
        this.program.s = -1.0;
      }
    });

    this.sRange.addEventListener('input', (e) => {
      this.program.s = e.target.value;
    });

    this.toggleV.addEventListener('click', () => {
      if (this.vRange.disabled === true) {
        this.vRange.disabled = false;
        this.program.v = this.vRange.value;
      } else {
        this.vRange.disabled = true;
        this.program.v = -1.0;
      }
    });

    this.vRange.addEventListener('input', (e) => {
      this.program.v = e.target.value;
    });

    this.smoothing.addEventListener('click', () => {
      this.program.smoothing = !this.program.smoothing;
    });

    this.blackAndWhite.addEventListener('click', () => {
      this.program.blackAndWhite = !this.program.blackAndWhite;
    });

    this.invert.addEventListener('click', () => {
      this.program.invert = !this.program.invert;
    });
  }

  updatePerf() {
    this.fps.innerHTML = this.engine.fps;
    this.missed.innerHTML = this.engine.missedFrameCount;
    this.render.innerHTML = this.engine.renderPerf + ' ms';
  }

  updateUI() {
    this.x.value = this.program.xOffset;
    this.y.value = this.program.yOffset;
    this.scale.value = this.program.scale;
    this.iterations.value = this.shader.iterations;
    this.a.value = this.program.aOffset;
    this.b.value = this.program.bOffset;
    this.julia.checked = this.program.isJulia;
    this.smoothing.checked = this.program.smoothing;
    this.blackAndWhite.checked = this.program.blackAndWhite;
    this.invert.checked = this.program.invert;
  }

  calculateUI(e) {
    e.preventDefault();

    console.log(e.target.iterations.value);

    this.program.xOffset = parseFloat(e.target.x.value);
    this.program.yOffset = parseFloat(e.target.y.value);

    this.program.aOffset = parseFloat(e.target.a.value);
    this.program.bOffset = parseFloat(e.target.b.value);

    this.program.scale = parseFloat(e.target.scale.value);

    this.shader.iterations = e.target.iterations.value > 0
      ? e.target.iterations.value
      : 0;
    this.shader.updateIterations();
    this.program.reloadShaders();

    if (!this.engine.running) {
      this.engine.render();
    }
  }
}