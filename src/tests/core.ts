import { Application } from 'pixi.js';
import DOM from 'src/lib/core/document';
import Element from 'src/lib/core/element';

const main = document.getElementById('main')!;

const app = new Application({
  width: 500,
  height: 500,
  backgroundColor: 0x333333,
});

main.appendChild(app.renderer.view);

const doc = new DOM(app);

const blue = new Element({
  id: 'blue',
  width: 150,
  backgroundColor: 0x0000ff,
});
blue.width = 200;
blue.height = 300;
doc.root.addChild(blue);

const green = new Element({
  id: 'green',
  width: 150,
  backgroundColor: 0x00ff00,
});
green.width = 50;
green.height = 50;
blue.addChild(green);

(window as any).doc = doc;
(window as any).blue = blue;
(window as any).green = green;
