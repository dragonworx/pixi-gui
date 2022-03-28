import { Graphics } from 'pixi.js';
import { Appearance, FillType } from 'src/lib/display/style';
import { GeometryUpdate } from 'src/lib/node/box';
import GraphicsPainter from 'src/lib/display/graphicsPainter';
import DisplayContainer from 'src/lib/node/container';
import { randomColor } from 'src/lib/util';
import { log } from '../log';

export default class Surface extends DisplayContainer {
  apperance: Appearance;

  protected _painter: GraphicsPainter;
  protected _graphics: Graphics;

  constructor() {
    super();

    this.apperance = this.defaultAppearance();
    const graphics = (this._graphics = new Graphics());
    this._painter = new GraphicsPainter(graphics);
  }

  onInit(): void {
    super.onInit();
    this.container.addChildAt(this._graphics, 0);
  }

  defaultAppearance(): Appearance {
    return {
      fill: {
        type: 'solid',
        color: '#333',
      },
    };
  }

  onGeometryChanged(updateType: GeometryUpdate[]) {
    super.onGeometryChanged(updateType);

    if (!this.isReady) {
      return;
    }

    if (updateType.indexOf(GeometryUpdate.Padding) > -1) {
      this.render();
    }

    if (
      updateType.indexOf(GeometryUpdate.Size) > -1 ||
      updateType.indexOf(GeometryUpdate.Fixture) > -1
    ) {
      this.render();
    }
  }

  render() {
    const { _painter: painter } = this;

    log(this, 'render');

    if (this.apperance.fill?.type === 'solid') {
      this.apperance.fill.color =
        this.apperance.fill.color || randomColor().hex();
      painter
        .clear()
        .uncache()
        .beginFill(this.apperance.fill?.color!)
        .drawRect(0, 0, this.width, this.height)
        .endFill()
        .cache();
    }
  }

  /** Setters */
  set fillType(value: FillType) {
    const {
      apperance,
      apperance: { fill },
    } = this;
    if (fill) {
      fill.type = value;
    } else {
      apperance.fill = {
        type: value,
      };
    }

    this.render();
  }

  set fillColor(value: string) {
    const {
      apperance,
      apperance: { fill },
    } = this;
    if (fill) {
      fill.color = value;
    } else {
      apperance.fill = {
        type: 'solid',
        color: value,
      };
    }

    this.render();
  }
}
