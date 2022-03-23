import { Graphics } from 'pixi.js';
import { Appearance, FillType } from 'src/lib/display/style';
import { Setter } from 'src/lib/parser';
import { GeometryUpdate } from 'src/lib/node/box';
import GraphicsPainter from 'src/lib/display/graphicsPainter';
import BoxContainer from 'src/lib/node/container';
import { log } from '../log';

export default class Surface extends BoxContainer {
  apperance: Appearance;
  graphics: Graphics;
  painter: GraphicsPainter;

  static setters(): Setter[] {
    return [
      ...super.setters(),
      {
        name: 'fillType',
        type: 'string',
        values: ['solid', 'none'],
      },
      {
        name: 'fillColor',
        type: 'color',
      },
    ];
  }

  constructor() {
    super();

    this.apperance = this.defaultAppearance();

    const graphics = (this.graphics = new Graphics());

    this.painter = new GraphicsPainter(graphics);
  }

  onInit() {
    super.onInit();

    this.container.addChildAt(this.graphics, 0);
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

    if (!this.hasDocument) {
      return;
    }

    if (updateType.indexOf(GeometryUpdate.Size) > -1) {
      this.render();
    }

    if (updateType.indexOf(GeometryUpdate.Padding) > -1) {
      this.render();
    }
  }

  render() {
    const { painter, debugPainter, hasSize, hasDocument } = this;

    if (!hasSize || !painter || !hasDocument) {
      return;
    }

    log(this, 'render');

    if (this.apperance.fill?.type === 'solid') {
      painter
        .uncache()
        .clear()
        .beginFill(this.apperance.fill?.color!)
        .drawRect(0, 0, this.width, this.height)
        .endFill()
        .cache();
    }

    super.render();
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
