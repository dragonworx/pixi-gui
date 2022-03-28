import { Appearance, FillType } from 'src/lib/display/style';
import Painted from 'src/lib/node/painted';
import { randomColor } from 'src/lib/util';

export default class Themable extends Painted {
  appearance: Appearance;

  constructor() {
    super();

    this.appearance = this.defaultAppearance();
  }

  defaultAppearance(): Appearance {
    return {
      fill: {
        type: 'solid',
        color: '#333',
      },
    };
  }

  protected paint() {
    const { painter } = this;

    if (this.appearance.fill?.type === 'solid') {
      this.appearance.fill.color =
        this.appearance.fill.color || randomColor().hex();
      painter

        .beginFill(this.appearance.fill?.color!)
        .drawRect(0, 0, this.width, this.height)
        .endFill();
    }
  }

  set fillType(value: FillType) {
    const {
      appearance: apperance,
      appearance: { fill },
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
      appearance: apperance,
      appearance: { fill },
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
