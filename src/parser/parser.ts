import Color from 'color';
import Document, { DocumentOptions } from 'src/lib/node/document';
import Node from 'src/lib/node/node';
import Element from 'src/lib/node/element';
import Block from 'src/lib/layout/block';
import Row from 'src/lib/layout/row';
import Column from 'src/lib/layout/column';
import DisplayContainer from 'src/lib/node/container';
import XmlSchema, { XsdAttribute, XsdElement, XsdSimpleType } from './schema';

export interface Setter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'color' | 'selector';
  values?: string[];
}

type FactoryClass = { new (...args: any[]): Node };

export default class Parser {
  schema: XmlSchema;

  constructor(readonly opts?: DocumentOptions) {
    this.schema = new XmlSchema();
  }

  static fromXmlString(xml: string, opts?: DocumentOptions) {
    return new Parser(opts).parse(xml);
  }

  factory: Record<string, FactoryClass> = {
    Document: Document,
    Element: Element,
    Container: DisplayContainer,
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

  private isValidSimpleTypeValue(simpleType: XsdSimpleType, value: any) {
    const { values } = simpleType;
    if (values.length === 0) {
      return true;
    } else {
      return values.indexOf(value) > -1;
    }
  }

  protected getAttribute(node: HTMLElement, attribute: XsdAttribute) {
    const { name, type, simpleType } = attribute;
    const value = node.getAttribute(name)!;
    if (type === 'string') {
      if (simpleType && !this.isValidSimpleTypeValue(simpleType, value)) {
        throw new Error(
          `Property "${name}" accepts only "${simpleType.values.join(' | ')}"`
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
    } else if (simpleType && simpleType.name === 'color') {
      try {
        return Color(value).hex();
      } catch (e) {
        throw new Error(`Property "name" has invalid color value "${value}"`);
      }
    } else if (simpleType && simpleType.name === 'selector') {
      return document.querySelector(value);
    }
    return value;
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

    const xsdElement = this.schema.getElement(className);
    if (!xsdElement) {
      throw new Error(`Cannot find element "${className}"`);
    }

    const attributes = xsdElement.attributes;

    if (node.nodeType === 1) {
      if (parent) {
        obj.setParent(parent, true);
      }

      const element = node as HTMLElement;
      element.getAttributeNames().forEach(attrKey => {
        const attribute = attributes.find(
          attribute => attribute.name === attrKey
        );
        if (!attribute) {
          throw new Error(
            `${className} does not implement setter "${attrKey}"`
          );
        }
        const value = this.getAttribute(element, attribute);
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
