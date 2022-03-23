import { Application, Sprite } from 'pixi.js';

const app = new Application({
  backgroundColor: 0x333333,
  resizeTo: document.body,
});

document.body.appendChild(app.renderer.view);

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d')!;
canvas.width = 100;
canvas.height = 100;
ctx.fillStyle = 'red';
ctx.fillRect(0, 0, 100, 100);
ctx.fillStyle = 'green';
ctx.fillRect(90, 90, 10, 10);
const sprite = Sprite.from(canvas);

app.stage.addChild(sprite);

setTimeout(() => {
  ctx.fillStyle = 'blue';
  ctx.fillRect(90, 90, 10, 10);
  sprite.texture.update();
}, 1000);

sprite.x = 200;
sprite.y = 200;
sprite.rotation = 0.5;

// setInterval(() => {
//   sprite.rotation += 0.001;
// });

const canvas2 = document.createElement('canvas');
const ctx2 = canvas.getContext('2d')!;
canvas2.width = 0;
canvas2.height = 0;
console.log(canvas2.width, canvas2.height);
console.log(ctx2.measureText('abcdefghij'));

sprite.interactive = true;

sprite.on('mousedown', e => {
  console.log(e.data.getLocalPosition(sprite));
});
