import ThemableSurface from './themableSurface';

export default class DebugSurface extends ThemableSurface {
  protected paint() {
    const { painter } = this;
    super.paint();
    painter
      .lineStyle('cyan')
      .drawRect(...this.localContentBounds.toArray())
      .lineStyle('yellow')
      .drawRect(...this.localMarginBounds.toArray());
  }
}
