import Color from 'color';
import Document, { DocumentOptions } from 'src/lib/node/document';
import Node from 'src/lib/node/node';
import Element from 'src/lib/node/element';
import Image from 'src/lib/node/image';
import NineSliceImage from 'src/lib/node/ninesliceImage';
import Fill from 'src/lib/node/fill';
import Block from 'src/lib/layout/block';
import Row from 'src/lib/layout/row';
import Column from 'src/lib/layout/column';
import DisplayContainer from 'src/lib/node/displayContainer';
import XmlSchema, { XsdAttribute, XsdSimpleType } from './schema';

export interface Setter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'color' | 'selector';
  values?: string[];
}

type FactoryClass = { new (...args: any[]): Node };

export default class Parser {
  schema: XmlSchema;

  constructor(readonly docOpts?: DocumentOptions) {
    this.schema = new XmlSchema();
  }

  static fromXmlString(xml: string, opts?: DocumentOptions) {
    return new Parser(opts).parse(xml);
  }

  factory: Record<string, FactoryClass> = {
    Document: Document,
    Element: Element,
    Image: Image,
    NineSliceImage: NineSliceImage,
    Fill: Fill,
    // Container: DisplayContainer,
    Container: Element,
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
    const doc = new Document(this.docOpts);

    this.parseNode(xmlDoc.documentElement, doc);

    if (!doc.deferInit) {
      doc.deepInit();
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

    if (className === 'UI') {
      this.parseChildren(node, parent);
      return parent;
    }

    const Class = this.factory[className];
    if (!Class) {
      throw new Error(
        `"${className}" is not a known node type. Check XML syntax.`
      );
    }
    const obj = new Class() as any;

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

    this.parseChildren(node, obj);

    return obj;
  }

  protected parseChildren(node: ChildNode, obj: any) {
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
  }
}
