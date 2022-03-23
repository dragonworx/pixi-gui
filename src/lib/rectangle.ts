export type Point = { x: number; y: number };
export type Size = { width: number; height: number };

export default class Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;

  static fromCenter(x: number, y: number, w: number, h: number) {
    const w2 = w / 2;
    const h2 = h / 2;
    return new Rectangle(x - w2, y - h2, w, h);
  }

  static fromTo(
    originX: number,
    originY: number,
    cornerX: number,
    cornerY: number
  ) {
    return new Rectangle(
      Math.min(originX, cornerX),
      Math.min(originY, cornerY),
      Math.abs(cornerX - originX),
      Math.abs(cornerY - originY)
    );
  }

  static withSize(width: number, height: number) {
    return new Rectangle(0, 0, width, height);
  }

  static empty() {
    return new Rectangle(0, 0, 0, 0);
  }

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }

  copy() {
    return new Rectangle(this.x, this.y, this.width, this.height);
  }

  clone(rect: Rectangle) {
    this.x = rect.x;
    this.y = rect.y;
    this.width = rect.width;
    this.height = rect.height;
    return this;
  }

  equals(rect: Rectangle) {
    return (
      this.x === rect.x &&
      this.y === rect.y &&
      this.width === rect.width &&
      this.height === rect.height
    );
  }

  get origin(): Point {
    return { x: this.x, y: this.y };
  }

  get corner(): Point {
    return { x: this.x + this.width, y: this.y + this.height };
  }

  get size(): Size {
    return { width: this.width, height: this.height };
  }

  get left() {
    return this.x;
  }

  get top() {
    return this.y;
  }

  get right() {
    return this.x + this.width;
  }

  get bottom() {
    return this.y + this.height;
  }

  get center(): Point {
    return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
  }

  get centerX() {
    return this.x + this.width / 2;
  }

  get centerY() {
    return this.y + this.height / 2;
  }

  get isTall() {
    return this.height > this.width;
  }

  get isWide() {
    return this.width > this.height;
  }

  get isSquare() {
    return this.width === this.height;
  }

  get smallestSide() {
    return Math.min(this.width, this.height);
  }

  get diagonal() {
    return Math.sqrt(this.width * this.width + this.height * this.height);
  }

  get isEmpty() {
    return this.width === 0 && this.height === 0;
  }

  toArray(): [number, number, number, number] {
    return [this.left, this.top, this.width, this.height];
  }

  expand(widthInc: number, heightInc: number, fromCenter: boolean = true) {
    const { x, y, width, height } = this;
    if (fromCenter) {
      const halfWAmount = widthInc / 2;
      const halfHAmount = heightInc / 2;
      this.x = x - halfWAmount;
      this.y = y - halfHAmount;
      this.width = width + halfWAmount * 2;
      this.height = height + halfHAmount * 2;
    } else {
      this.width += widthInc;
      this.height += heightInc;
    }
    return this;
  }

  expanded(widthInc: number, heightInc: number, fromCenter: boolean = true) {
    return this.copy().expand(widthInc, heightInc, fromCenter);
  }

  setSize(w: number, h: number, fromCenter: boolean = false) {
    if (fromCenter) {
      const { x, y } = this.center;
      this.width = w;
      this.height = h;
      this.setCenter(x, y);
    } else {
      this.width = w;
      this.height = h;
    }
    return this;
  }

  setWidth(width: number, preserveCenter: boolean = true) {
    const ratio = width / this.width;
    if (preserveCenter) {
      const { x, y } = this.center;
      this.width = width;
      this.height = this.height * ratio;
      this.setCenter(x, y);
    } else {
      this.width = width;
      this.height = this.height * ratio;
    }
    return this;
  }

  setHeight(height: number, preserveCenter: boolean = true) {
    const ratio = height / this.height;
    if (preserveCenter) {
      const { x, y } = this.center;
      this.height = height;
      this.width = this.width * ratio;
      this.setCenter(x, y);
    } else {
      this.height = height;
      this.width = this.width * ratio;
    }
    return this;
  }

  scaleBy(
    scaleX: number,
    scaleY: number = scaleX,
    preserveCenter: boolean = true
  ) {
    if (preserveCenter) {
      const { x, y } = this.center;
      this.width = this.width * scaleX;
      this.height = this.height * scaleY;
      this.setCenter(x, y);
    } else {
      this.width = this.width * scaleX;
      this.height = this.height * scaleY;
    }
    return this;
  }

  scaledBy(
    scaleX: number,
    scaleY: number = scaleX,
    preserveCenter: boolean = true
  ) {
    return this.copy().scaleBy(scaleX, scaleY, preserveCenter);
  }

  setTop(value: number) {
    this.y = value;
    return this;
  }

  setLeft(value: number) {
    this.x = value;
    return this;
  }

  setRight(value: number) {
    this.width += value - this.right;
    return this;
  }

  setBottom(value: number) {
    this.height += value - this.bottom;
    return this;
  }

  setOrigin(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  setCenter(x: number, y: number) {
    const w2 = this.width / 2;
    const h2 = this.height / 2;
    this.x = x - w2;
    this.y = y - h2;
    return this;
  }

  setCenterX(x: number) {
    this.setCenter(x, this.centerY);
  }

  setCenterY(y: number) {
    this.setCenter(this.centerX, y);
  }

  moveToRectCenter(rect: Rectangle) {
    const { x, y } = rect.center;
    return this.setCenter(x, y);
  }

  translate(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
    return this;
  }

  fractionalLocalPoint(localX: number, localY: number): Point {
    return { x: localX / this.width, y: localY / this.height };
  }

  localPointFromFractional(xFrac: number, yFrac: number): Point {
    return { x: this.width * xFrac, y: this.height * yFrac };
  }

  globalPointFromFractional(xFrac: number, yFrac: number): Point {
    return {
      x: this.left + this.width * xFrac,
      y: this.top + this.height * yFrac,
    };
  }

  globalToLocalPoint(globalX: number, globalY: number): Point {
    return { x: globalX - this.left, y: globalY - this.top };
  }

  localToGlobalPoint(localX: number, localY: number): Point {
    return { x: this.left + localX, y: this.top + localY };
  }

  localPointToRectGlobal(x: number, y: number, destRect: Rectangle) {
    const { x: xFrac, y: yFrac } = this.fractionalLocalPoint(x, y);
    return destRect.globalPointFromFractional(xFrac, yFrac);
  }

  localPointToRectLocal(x: number, y: number, destRect: Rectangle) {
    const { x: xFrac, y: yFrac } = this.fractionalLocalPoint(x, y);
    return destRect.localPointFromFractional(xFrac, yFrac);
  }

  constrainTo(
    rect: Rectangle,
    hConstraint: boolean = true,
    vConstraint: boolean = true
  ) {
    if (hConstraint) {
      if (this.width > rect.width) {
        this.setCenterX(rect.centerX);
      } else {
        if (this.left < rect.left) {
          const delta = rect.left - this.left;
          this.translate(delta, 0);
        }
        if (this.right > rect.right) {
          const delta = rect.right - this.right;
          this.translate(delta, 0);
        }
      }
    }
    if (vConstraint) {
      if (this.height > rect.height) {
        this.setCenterY(rect.centerY);
      } else {
        if (this.top < rect.top) {
          const delta = rect.top - this.top;
          this.translate(0, delta);
        }
        if (this.bottom > rect.bottom) {
          const delta = rect.bottom - this.bottom;
          this.translate(0, delta);
        }
      }
    }
    return this;
  }

  scaleToFitWithin(rect: Rectangle) {
    if (this.isWide) {
      this.setWidth(rect.width);
    } else {
      this.setHeight(rect.height);
    }
    if (this.height > rect.height) {
      this.setHeight(rect.height);
    }
    if (this.width > rect.width) {
      this.setWidth(rect.width);
    }
    return this;
  }

  scaleToFitAround(rect: Rectangle) {
    const isSelfWide = this.isWide;
    const isRectWide = rect.isWide;
    if ((isSelfWide && !isRectWide) || (!isSelfWide && isRectWide)) {
      if (isSelfWide) {
        this.setHeight(rect.height);
      } else {
        this.setWidth(rect.width);
      }
    } else {
      if (!isSelfWide) {
        this.setWidth(rect.width);
      } else {
        this.setHeight(rect.height);
      }
    }
    return this;
  }

  relativeDiagonalScaleOf(rect: Rectangle) {
    return this.diagonal / rect.diagonal;
  }

  union(rect: Rectangle) {
    const left = Math.min(rect.left, this.left);
    const top = Math.min(rect.top, this.top);
    const right = Math.min(rect.right, this.right);
    const bottom = Math.min(rect.bottom, this.bottom);
    this.x = left;
    this.y = top;
    this.width = right - left;
    this.height = bottom - top;
    return this;
  }
}

(window as any).Rect = Rectangle;
