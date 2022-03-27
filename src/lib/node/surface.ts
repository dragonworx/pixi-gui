import { Appearance, FillType } from 'src/lib/display/style';
import { GeometryUpdate } from 'src/lib/node/box';
import BoxContainer from 'src/lib/node/container';
import { randomColor } from 'src/lib/util';
import { log } from '../log';

export default class Surface extends BoxContainer {
  apperance: Appearance;

  constructor() {
    super();

    this.apperance = this.defaultAppearance();
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

    if (updateType.indexOf(GeometryUpdate.Padding) > -1) {
      this.render();
    }
  }

  paintBackground() {
    const { _painter: painter } = this;

    log(this, 'render');

    if (this.apperance.fill?.type === 'solid') {
      this.apperance.fill.color = randomColor().hex();
      painter
        .beginFill(this.apperance.fill?.color!)
        .drawRect(0, 0, this.width, this.height)
        .endFill();
    }

    super.paintBackground();
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
