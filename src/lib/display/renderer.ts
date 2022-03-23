export default class Renderer {
  constructor() {
    this.init();
  }

  init() {}

  get isCanvasSupported() {
    return document.createElement('canvas').getContext('2d') !== null;
  }

  newCanvas(width: number, height: number) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = width;
    canvas.height = height;
    return { canvas, ctx };
  }
}
