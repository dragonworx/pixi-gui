import { Application, Texture, TilingSprite } from 'pixi.js';
import Box from 'src/lib/node/box';
import DebugGrid from 'src/lib/display/debugGrid';
import Node from 'src/lib/node/node';
import Container from 'src/lib/node/container';
import { Setter } from 'src/lib/parser';
import Renderer from 'src/lib/display/renderer';
import Theme, { getTheme, defaultTheme } from 'src/lib/theme/theme';
import { settings } from 'pixi.js';
import { log } from '../log';

export interface DocumentOptions {
  app?: Application;
  resizeTo?: HTMLElement;
  deferInit?: boolean;
  debug?: boolean;
}

export default class Document extends Node {
  readonly renderer: Renderer;
  readonly app: Application;

  protected _container?: HTMLElement;
  protected _theme?: Partial<Theme>; // todo: partial or required?
  protected _observer?: ResizeObserver;
  protected _debugGrid?: TilingSprite;
  protected _deferInit: boolean;
  protected _debug: boolean;
  protected _sharp: boolean;
  protected _resizeToElement?: HTMLElement;

  static setters(): Setter[] {
    return [
      ...super.setters(),
      {
        name: 'container',
        type: 'selector',
      },
      {
        name: 'theme',
        type: 'string',
      },
      {
        name: 'resizeTo',
        type: 'string',
      },
      {
        name: 'debug',
        type: 'boolean',
      },
      {
        name: 'deferInit',
        type: 'boolean',
      },
      {
        name: 'sharp',
        type: 'boolean',
      },
    ];
  }

  constructor(opts: DocumentOptions = {}) {
    super();

    const { app, resizeTo } = opts;

    this._theme = defaultTheme;

    this.app =
      app ||
      new Application({
        antialias: false,
        backgroundColor: 0,
      });

    this.renderer = new Renderer();

    if (resizeTo) {
      this.observeResizeOn(resizeTo);
    }

    this._deferInit = false;
    this._debug = false;
    this._sharp = true;
  }

  init() {
    this.sharp = this._sharp;
    // this.debug = this._debug;

    super.init();
  }

  onInit() {
    if (!this._container) {
      console.error('Document was initialised without a container');
    }
  }

  performLayout() {
    log(this, 'performLayout');
    this.forEach<Box>(node => node.performLayout());
  }

  render() {
    this.walk(node => {
      if (node instanceof Container) {
        node.render();
      }
    });
  }

  observeResizeOn(element: HTMLElement) {
    if (element) {
      if (this._observer) {
        this._observer.disconnect();
      }
      this._observer = new ResizeObserver(this.onContainerResize);
      this._observer.observe(element);
      this._resizeToElement = element;

      const bounds = element.getBoundingClientRect();
      this.resize(bounds.width, bounds.height);
    }
  }

  onContainerResize = (entries: ResizeObserverEntry[]) => {
    entries.forEach(entry => {
      const { width, height } = entry.contentRect;
      this.resize(width, height);
    });
  };

  resize(width: number, height: number) {
    log(this, 'resize', { width, height });
    this.app.renderer.resize(width, height);
    if (this._debugGrid) {
      this._debugGrid.width = width;
      this._debugGrid.height = height;
    }
    this.performLayout();
    this.app.render();
  }

  unobserveResize() {
    if (this._observer) {
      this._observer.disconnect();
    }
    delete this._resizeToElement;
    delete this._observer;
  }

  getTheme() {
    return this._theme;
  }

  createDebugGrid() {
    const grid = new DebugGrid();
    this._debugGrid = new TilingSprite(
      Texture.from(grid.canvas),
      this.width,
      this.height
    );
    return this._debugGrid;
  }

  get className() {
    return 'Document';
  }

  get stage() {
    return this.app.stage;
  }

  /** Getter */
  get canvas() {
    return this.app.renderer.view;
  }

  get width() {
    return this.app.renderer.width;
  }

  get height() {
    return this.app.renderer.height;
  }

  get deferInit() {
    return this._deferInit;
  }

  get debug() {
    return this._debug;
  }

  get container() {
    return this._container;
  }

  get sharp() {
    return this._sharp;
  }

  /** Setters */
  set width(value: number) {
    this.resize(value, this.height);
  }

  set height(value: number) {
    this.resize(this.width, value);
  }

  set container(element: HTMLElement | undefined) {
    if (element) {
      this._container = element;
      element.appendChild(this.canvas);
    } else {
      throw new Error(`Undefined container passed to Document`);
    }
  }

  set theme(name: string) {
    // todo: known string, or update to theme object for setter/getter
    const theme = getTheme(name);
    this._theme = theme;
  }

  set resizeTo(cssSelector: string) {
    const element = document.querySelector(cssSelector);
    if (!element || !(element instanceof HTMLElement)) {
      throw new Error(`Resize element for selector "${cssSelector}" not found`);
    }
    this.observeResizeOn(element);
  }

  set debug(enabled: boolean) {
    if (!this._debugGrid && enabled) {
      const sprite = this.createDebugGrid();
      this.app.stage.addChildAt(sprite, 0);
      this.app.stage.alpha = 0.5;
    } else if (this._debugGrid && !enabled) {
      this.app.stage.alpha = 1;
      this.app.stage.removeChild(this._debugGrid);
      this._debugGrid = undefined;
    }
    this._debug = enabled;
    this.walk(node => node.onDebugChange(enabled));
    this.render();
  }

  set deferInit(defer: boolean) {
    this._deferInit = defer;
  }

  set sharp(isSharp: boolean) {
    this._sharp = isSharp;
    settings.ROUND_PIXELS = isSharp;
  }
}
