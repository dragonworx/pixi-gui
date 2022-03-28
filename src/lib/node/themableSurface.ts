import { Appearance, FillType } from 'src/lib/display/style';
import PaintedSurface from 'src/lib/node/paintedSurface';
import { randomColor } from 'src/lib/util';

export default class ThemableSurface extends PaintedSurface {
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

  paint() {
    const { _painter } = this;

    if (this.apperance.fill?.type === 'solid') {
      this.apperance.fill.color =
        this.apperance.fill.color || randomColor().hex();
      _painter

        .beginFill(this.apperance.fill?.color!)
        .drawRect(0, 0, this.width, this.height)
        .endFill();
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
