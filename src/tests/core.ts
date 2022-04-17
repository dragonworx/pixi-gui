import { Application } from 'pixi.js';
import DOM from 'src/lib/core/document';
import Element from 'src/lib/core/node/base';
import Grid from 'src/lib/display/grid';

const main = document.getElementById('main')!;

const app = new Application({
  width: 400,
  height: 400,
  backgroundColor: 0,
});

main.appendChild(app.renderer.view);

const doc = new DOM(app);

const grid = Grid.createTilingSprite(1000, 1000);
doc.stage.addChildAt(grid, 0);

const blue = new Element({
  id: 'blue',
  backgroundColor: 0x0000ff,
  left: 50,
});
blue.set('width', 200);
blue.set('height', 200);
doc.root.addChild(blue);

const green = new Element({
  id: 'green',
  width: 50,
  height: 50,
  backgroundColor: 0x00ff00,
});
blue.addChild(green);

// green.allDuration = 1000;

(window as any).doc = doc;
(window as any).blue = blue;
(window as any).green = green;
