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
  width: 200,
  height: 200,
});
doc.root.addChild(blue);

const green = new Element({
  id: 'green',
  width: 50,
  height: 50,
  backgroundColor: 0x00ff00,
});
blue.addChild(green);

// const red = new Element({
//   id: 'red',
//   width: 50,
//   height: 50,
//   backgroundColor: 0xff0000,
// });
// blue.addChild(red);

(window as any).doc = doc;
(window as any).blue = blue;
(window as any).green = green;
// (window as any).red = red;

const _queue: (() => void)[] = [];

function queue(fn: () => void) {
  _queue.push(fn);
}

setInterval(() => {
  if (_queue.length) {
    const fn = _queue.shift()!;
    fn();
  }
}, 250);

// queue(() => blue.set('alignItems', 'center'));
// queue(() => blue.set('justifyContent', 'center'));
// queue(() => green.set('marginLeft', 50));
// queue(() => green.set('left', 10));
// queue(() => blue.set('paddingTop', 50));
// queue(() => blue.set('top', 50));
setTimeout(() => {
  const red = new Element({
    id: 'red',
    width: 50,
    height: 50,
    backgroundColor: 0xff0000,
  });
  blue.addChild(red);
}, 1000);
