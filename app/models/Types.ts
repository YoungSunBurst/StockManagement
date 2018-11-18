export interface IImage {
  base64: string;
  width: number;
  height: number;
}

export interface IStore {
  id: number;
  name: string;
  location?: string;
  businessCard?: IImage;
  receiptList: Array<IImage>;
}

export interface IMaterial {
  name: string;
  image: IImage;
  count: number;
  price?: number;
  storeId?: number;
}

export interface IColor {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export class Color implements IColor {
  red: number;
  green: number;
  blue: number;
  alpha: number;

  constructor(object: any);
  constructor(r: number, g: number, b: number)
  constructor(r: number, g: number, b: number, a: number)
  constructor(r?: any, g?: number, b?: number, a?: number) {
    if (r instanceof Object) {
      this.red = Math.round((r.red * 255));
      this.green = Math.round(r.green * 255);
      this.blue = Math.round(r.blue * 255);
      this.alpha = r.alpha !== undefined ? r.alpha : 1;
    } else {
      this.red = r !== undefined ? r : 0;
      this.green = g !== undefined ? g : 0;
      this.blue = b !== undefined ? b : 0;
      this.alpha = a !== undefined ? a : 1;
    }
  }

  getHexaString(withAlpha: boolean = false) {
    let r = this.red.toString(16);
    r = r.length < 2 ? '0' + r : r;
    let g = this.green.toString(16);
    g = g.length < 2 ? '0' + g : g;
    let b = this.blue.toString(16);
    b = b.length < 2 ? '0' + b : b;
    if ( false !== withAlpha ) {
      let a = Math.round(this.alpha * 255).toString(16);
      a = a.length < 2 ? '0' + a : a;
      return '#' + a + r + g + b;
    } else {
      return '#' + r + g + b;
    }

  }

  getInterface() {
    return this as IColor;
  }
}

export interface IPoint {
  x: number;
  y: number;
}

export class Point {
  private x: number;
  private y: number;

  constructor(object: any)
  constructor(x: number, y: number)
  constructor(a: any, b?: number) {
    if ( a instanceof Object) {
    // if ( object !== undefined ) {
      // this.constructor(a.x, a.y);
      this.x = a.x;
      this.y = a.y;
    } else if ( typeof a === 'number' && b !== undefined) {
      this.x = a;
      this.y = b;
    } else {
      this.x = 0;
      this.y = 0;
    }
  }
  getX = () => {
    return this.x;
  }
  setX = (x: number) => {
    this.x = x;
  }
  getY = () => {
    return this.y;
  }
  setY = (y: number) => {
    this.y = y;
  }
  setOffset = (x: number, y: number) => {
    this.x += x;
    this.y += y;
  }
}

export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Rect implements IRect {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor()
  constructor(object: any)
  constructor(x: number, y: number, width: number, height: number) 
  constructor(a?: any, y?: number, width?: number, height?: number) {
    if ( a instanceof Object || a instanceof Rect) {
      // this.constructor(a.x, a.y, a.width, a.height);
      this.x = a.x;
      this.y = a.y;
      this.width = a.width;
      this.height = a.height;
    } else if ( typeof a === 'number' && typeof y === 'number' && typeof width === 'number'  && typeof height === 'number' ) {
      this.x = a;
      this.y = y;
      this.width = width;
      this.height = height;
    } else {
      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.height = 0;
    }
  }

  getX = () => {
    return this.x;
  }
  setX = (x: number) => {
    this.x = x;
  }
  getY = () => {
    return this.y;
  }
  setY = (y: number) => {
    this.y = y;
  }
  getPoint = () => {
    return new Point(this.x, this.y);
  }
  getWidth = () => {
    return this.width;
  }
  setWidth = (width: number) => {
    this.width = width;
  }
  getHeight = () => {
    return this.height;
  }
  setHeight = (height: number) => {
    this.height = height;
  }
  setOffset = (x: number, y: number) => {
    this.x += x;
    this.y += y;
  }
  setScale = ( ratio: number ) => {
    this.x = this.x * ratio;
    this.y = this.y * ratio;
    this.width = this.width * ratio;
    this.height = this.height * ratio;
  }
  getRight = (): number => {
    return this.x + this.width;
  }
  getBottom = (): number => {
    return this.y + this.height;
  }
  getStyle = (): Object => {
    return {
      left: this.x,
      top: this.y,
      width: this.width,
      height: this.height,
    };
  }
  IsPointIn = ( x: number, y: number ): boolean => {
    if ( x < this.x || x > this.getRight() || y < this.y || y > this.getBottom()) {
      return false;
    } else {
      return true;
    }
  }
  union = ( rect: Rect ) => {
    if (this.width <= 0) {
      this.x = rect.x;
      this.width = rect.width;
    } else {
      if (this.x > rect.x) {
        this.width += this.x - rect.x;
        this.x = rect.x;
      }
      if (this.getRight() < rect.getRight()) {
        this.width = rect.getRight() - this.x;
      }
    }
    if (this.height <= 0) {
      this.y = rect.y;
      this.height = rect.height;
    } else {
      if (this.y > rect.y) {
        this.height += this.y - rect.y;
        this.y = rect.y;
      }
      if (this.getBottom() < rect.getBottom()) {
        this.height = rect.getBottom() - this.y;
      }
    }
  }
  unionFromStyle = ( left: number, top: number, width: number, height: number ) => {
    if (this.width <= 0) {
      this.x = left;
      this.width = width;
    } else {
      if (this.x > left) {
        this.width += this.x - left;
        this.x = left;
      }
      if (this.getRight() < left + width) {
        this.width = left + width - this.x;
      }
    }
    if (this.height <= 0) {
      this.y = top;
      this.height = height;
    } else {
      if (this.y > top) {
        this.height += this.y - top;
        this.y = top;
      }
      if (this.getBottom() < top + height) {
        this.height = top + height - this.y;
      }
    }
  }
  intersect = ( rect: Rect ) => {
    let right = Math.min(rect.getRight(), this.getRight());
    let bottom = Math.min(rect.getBottom(), this.getBottom());
    this.x = Math.max(rect.x, this.x);
    this.width = right - this.x;
    this.y = Math.max(rect.y, this.y);
    this.height = bottom - this.y;
  }
  relationCompare = (refRect: Rect): RectRelation => {
    if (this.x === refRect.x && this.getRight() === refRect.getRight() && this.y === refRect.y && this.getBottom() === refRect.getBottom()) {
      return RectRelation.equal;
    } else if (this.x >= refRect.x && this.getRight() <= refRect.getRight() && this.y >= refRect.y && this.getBottom() <= refRect.getBottom()) {
      return RectRelation.comeUnder;
    } else if (this.x <= refRect.x && this.getRight() >= refRect.getRight() && this.y <= refRect.y && this.getBottom() >= refRect.getBottom()) {
      return RectRelation.include;
    } else {
      return RectRelation.outside;
    }
  }
  toString = () => {
    return `${this.x} ${this.y} ${this.width} ${this.height}`;
  }

  calcOriginDistance = (x: number, y: number): number => {
    return Math.sqrt(x * x + y * y);
  }

  calcArea = (width: number, height: number): number => {
    return width * height;
  }
  getArea = (): number => {
    return this.width * this.height;
  }
  whoIsCloserToTheOrigin = (refRect: Rect): boolean => {
    let thisDist = this.calcOriginDistance(this.getX(), this.getY());
    let refDist = this.calcOriginDistance(refRect.getX(), refRect.getY());
    let bResult;

    if (thisDist < refDist) {
      bResult = true;
    } else if (thisDist > refDist) {
      bResult = false;
    } else if (this.calcArea(this.getWidth(), this.getHeight()) >=  this.calcArea(refRect.getWidth(), refRect.getHeight())) {
      bResult = true;
    } else {
      bResult = false;
    }

    return bResult;
  }
}

export enum RectRelation {
  include,
  equal,
  comeUnder,
  outside,
}
