import { Application, Loader, Resource, settings, Texture } from 'pixi.js';
import Box from 'src/lib/node/box';
import Node, { NodeEvent } from 'src/lib/node/node';

export interface DocumentOptions {
  app?: Application;
  resizeTo?: HTMLElement;
  deferInit?: boolean;
}

export enum DocumentEvent {
  resize = 'resize',
}

export default class Document extends Node {
  readonly app: Application;

  protected _htmlContainer?: HTMLElement;
  protected _themeName?: string;
  protected _observer?: ResizeObserver;
  protected _deferInit: boolean;
  protected _sharp: boolean;
  protected _resizeToElement?: HTMLElement;
  protected _textureCache: Map<string, Texture<Resource>>;

  constructor(opts: DocumentOptions = {}) {
    super();

    const { app, resizeTo } = opts;

    this.app =
      app ||
      new Application({
        antialias: false,
        backgroundColor: 0,
      });

    if (resizeTo) {
      this.observeResizeOn(resizeTo);
    }

    this._textureCache = new Map();
    this._deferInit = false;
    this._sharp = true;
  }

  deepInit() {
    this.init();
  }

  init() {
    if (!this._htmlContainer) {
      console.error('Document was initialised without a container');
    }

    this._hasInit = true;
    this.sharp = this._sharp;
    this.children.forEach(node => node.deepInit());
    this.emit(NodeEvent.init);
  }

  preload(urls: string[]): Promise<void> {
    const loader = new Loader();
    urls.forEach(url => loader.add(url));
    const promise = new Promise<void>((resolve, reject) => {
      loader.onComplete.add(() => {
        urls.forEach(url => {
          const texture = loader.resources[url].texture;
          console.log('Loaded ' + url);
          if (texture) {
            this._textureCache.set(url, texture);
          } else {
            reject(`Cannot load texture "${url}"`);
          }
        });
        resolve();
      });
    });
    loader.load();
    return promise;
  }

  getTexture(url: string) {
    if (!this._textureCache.has(url)) {
      throw new Error(`Texture "${url}" not found`);
    }
    return this._textureCache.get(url)!;
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
    this.app.renderer.resize(width, height);
    this.emit(DocumentEvent.resize, { width, height });
    this.performLayout();
    this.app.render();
  }

  performLayout() {
    this.forEach<Box>(node => node.updateLayout());
  }

  get className() {
    return 'Document';
  }

  get stage() {
    return this.app.stage;
  }

  get loader() {
    return this.app.loader;
  }

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
    return this._htmlContainer;
  }

  get sharp() {
    return this._sharp;
  }

  get theme() {
    return this._themeName;
  }

  set width(value: number) {
    this.resize(value, this.height);
  }

  set height(value: number) {
    this.resize(this.width, value);
  }

  set container(element: HTMLElement | undefined) {
    if (element) {
      this._htmlContainer = element;
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
