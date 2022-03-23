import Color from 'color';
import Document, { DocumentOptions } from 'src/lib/node/document';
import Node from 'src/lib/node/node';
import Element from 'src/lib/node/element';
import Block from 'src/lib/layout/block';
import Row from 'src/lib/layout/row';
import Column from 'src/lib/layout/column';
import BoxContainer from 'src/lib/node/container';

export interface Setter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'color' | 'selector';
  values?: string[];
}

type FactoryClass = { new (...args: any[]): Node };

export default class Parser {
  constructor(readonly opts?: DocumentOptions) {}

  static fromXmlString(xml: string, opts?: DocumentOptions) {
    return new Parser(opts).parse(xml);
  }

  factory: Record<string, FactoryClass> = {
    Document: Document,
    Element: Element,
    Container: BoxContainer,
    Block: Block,
    Row: Row,
    Column: Column,
  };

  addFactoryType<T extends FactoryClass>(key: string, Class: T) {
    this.factory[key] = Class;
  }

  parse(xmlStr: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlStr, 'application/xml');
    const doc = this.parseNode(xmlDoc.documentElement) as Document;
    if (!doc.deferInit) {
      doc.init();
    }
    return doc;
  }

  protected getAttribute(node: HTMLElement, setter: Setter) {
    const { name, type, values } = setter;
    const value = node.getAttribute(name)!;
    if (type === 'string') {
      if (values && values.indexOf(value) === -1) {
        throw new Error(
          `Property "${name}" accepts only "${values.join(' | ')}"`
        );
      }
      return value;
    } else if (type === 'number') {
      const num = parseFloat(value);
      if (isNaN(num)) {
        throw new Error(`Numeric property "${name}" is not a number`);
      }
      return num;
    } else if (type === 'boolean') {
      const bool = value.toLowerCase();
      if (bool !== 'true' && bool !== 'false') {
        throw new Error(`Boolean property "${name}" is not a true or false`);
      }
      return bool === 'true';
    } else if (type === 'color') {
      try {
        return Color(value).hex();
      } catch (e) {
        throw new Error(`Property "name" has invalid color value "${value}"`);
      }
    } else if (type === 'selector') {
      return document.querySelector(value);
    }
    throw new Error(`Type "${type}" not parsable`);
  }

  protected parseNode(node: ChildNode, parent?: Node) {
    if (node.nodeType !== 1) {
      return;
    }

    const className = node.nodeName;
    const Class = this.factory[className];
    const obj = (
      className === 'Document' ? new Class(this.opts) : new Class()
    ) as any;

    const proto = (obj as any).__proto__;
    if (!proto || (proto && !proto.constructor.setters)) {
      throw new Error(`Could not find prototype constructor for ${className}`);
    }
    const setters = proto.constructor.setters() as Setter[];

    if (node.nodeType === 1) {
      if (parent) {
        obj.setParent(parent, true);
      }

      const element = node as HTMLElement;
      element.getAttributeNames().forEach(attrKey => {
        const setter = setters.find(setter => setter.name === attrKey);
        if (!setter) {
          throw new Error(
            `${className} does not implement setter "${attrKey}"`
          );
        }
        const value = this.getAttribute(element, setter);
        (obj as any)[attrKey] = value;
      });
    }

    for (
      let child = node.firstChild;
      child !== null;
      child = child.nextSibling
    ) {
      if (child.nodeName === '#text') {
        continue;
      }

      this.parseNode(child, obj);
    }

    return obj;
  }
}
