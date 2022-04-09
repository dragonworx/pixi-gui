import { Application, Container } from 'pixi.js';

const main = document.getElementById('main')!;
const app = new Application({
  width: 500,
  height: 500,
  backgroundColor: 0x333333,
});
main.appendChild(app.renderer.view);

interface Interface {
  hasLayout: boolean;
}

export function applyRendererMixin(classToMixin: typeof Container): void {
  const Proto = classToMixin.prototype as Container & Partial<Interface>;

  // Skip if mixin already applied.
  if (Proto.hasLayout) {
    return;
  }

  const proto = {
    xyz: 123,
    test() {
      console.log('TEST', this);
    },
  };

  Object.assign(Proto, proto);

  Object.defineProperty(Proto, 'hasLayout', {
    set: function (value: boolean) {
      console.log('!', this);
      this._hasLayout = value;
    },
    get: function () {
      return this._hasLayout || 123;
    },
  });
}

applyRendererMixin(Container);

const test = ((window as any).test = new Container());
