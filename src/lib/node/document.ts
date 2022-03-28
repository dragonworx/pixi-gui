import { Application, settings } from 'pixi.js';
import Box from 'src/lib/node/box';
import Node from 'src/lib/node/node';
import Renderer from 'src/lib/display/renderer';
import { log } from '../log';

export interface DocumentOptions {
  app?: Application;
  resizeTo?: HTMLElement;
  deferInit?: boolean;
}

export enum DocumentEvent {
  resize = 'resize',
}

export default class Document extends Node {
  readonly renderer: Renderer;
  readonly app: Application;

  protected _container?: HTMLElement;
  protected _themeName?: string;
  protected _observer?: ResizeObserver;
  protected _deferInit: boolean;
  protected _sharp: boolean;
  protected _resizeToElement?: HTMLElement;

  constructor(opts: DocumentOptions = {}) {
    super();

    const { app, resizeTo } = opts;

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
    this._sharp = true;
  }

  init() {
    this.sharp = this._sharp;

    super.init();
  }

  onInit() {
    if (!this._container) {
      console.error('Document was initialised without a container');
    }
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

  unobserveResize() {
    if (this._observer) {
      this._observer.disconnect();
    }
    delete this._resizeToElement;
    delete this._observer;
  }

  resize(width: number, height: number) {
    log(this, 'resize', { width, height });
    this.app.renderer.resize(width, height);
    this.emit(DocumentEvent.resize, { width, height });
    this.performLayout();
    this.app.render();
  }

  performLayout() {
    log(this, 'performLayout');
    this.forEach<Box>(node => node.performLayout());
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

  get container() {
    return this._container;
  }

  get sharp() {
    return this._sharp;
  }

  get theme() {
    return this._themeName;
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

  set theme(name: string | undefined) {
    this._themeName = name;
  }

  set resizeTo(element: HTMLElement) {
    this.observeResizeOn(element);
  }

  set deferInit(defer: boolean) {
    this._deferInit = defer;
  }

  set sharp(isSharp: boolean) {
    this._sharp = isSharp;
    settings.ROUND_PIXELS = isSharp;
  }
}
