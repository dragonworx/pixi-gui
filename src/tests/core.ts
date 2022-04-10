import { Application } from 'pixi.js';
import DOM from 'src/lib/core/document';
import FillColor from 'src/lib/core/fillColor';

const main = document.getElementById('main')!;

const app = new Application({
  width: 500,
  height: 500,
  backgroundColor: 0x333333,
});

main.appendChild(app.renderer.view);

const dom = new DOM(app);

const blue = new FillColor();
blue.color = 0x0000ff;
blue.width = 100;
blue.height = 100;
dom.root.addChild(blue);
// blue.layout.setWidthPercent(0.5);
dom.root.update();
// for (let i = 0; i < 5; i++) {
//   const red = new FillColor();
//   red.color = 0xff0000;
//   red.width = 10;
//   red.height = 10;
// }

(window as any).blue = blue;
(window as any).dom = dom;
