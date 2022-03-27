// @ts-ignore
import schema from './schema.xsd';

export interface XsdSimpleType {
  name: string;
  values: string[];
}

export type AttributeType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'color'
  | 'simpleType';

export interface XsdAttribute {
  name: string;
  type: AttributeType;
  simpleType?: XsdSimpleType;
}

export interface XsdComplexType {
  name: string;
  base?: XsdComplexType;
  attributes: XsdAttribute[];
}

export interface XsdElement {
  name: string;
  type: XsdComplexType;
  attributes: XsdAttribute[];
}

export default class XmlSchema {
  private simpleTypes: Map<string, XsdSimpleType>;
  private complexTypes: Map<string, XsdComplexType>;
  private elements: Map<string, XsdElement>;

  constructor() {
    const parser = new DOMParser();
    const doc = parser.parseFromString(schema, 'application/xml');

    this.simpleTypes = new Map();
    this.complexTypes = new Map();
    this.elements = new Map();

    this.parseSimpleTypes(doc);
    this.parseComplexTypes(doc);
    this.parseElements(doc);
  }

  private parseSimpleTypes(doc: Document) {
    this.querySelectAll(doc, 'restriction[base="xs:string"]', restriction => {
      const simpleType = restriction.parentElement!;
      const name = this.getAttribute(simpleType, 'name');
      const values: string[] = [];
      this.childNodes(restriction, enumeration => {
        values.push(this.getAttribute(enumeration, 'value'));
      });
      this.simpleTypes.set(name, {
        name,
        values,
      });
    });
  }

  parseComplexTypes(doc: Document) {
    // 1st pass
    this.querySelectAll(doc, 'complexType', complexType => {
      const name = this.getAttribute(complexType, 'name');
      const attributes: XsdAttribute[] = [];
      this.querySelectAll(complexType, 'attribute', attribute => {
        const name = this.getAttribute(attribute, 'name');
        const t = this.getAttribute(attribute, 'type');
        let type: AttributeType = 'string';
        let simpleType: XsdSimpleType | undefined;
        if (t === 'xs:string') {
          type = 'string';
        } else if (t === 'xs:decimal') {
          type = 'number';
        } else if (t === 'xs:boolean') {
          type = 'boolean';
        } else {
          type = 'simpleType';
          simpleType = this.simpleTypes.get(t);
        }
        const attr: XsdAttribute = {
          name,
          type,
          simpleType,
        };
        attributes.push(attr);
        if (!simpleType) {
          delete attr.simpleType;
        }
      });
      this.complexTypes.set(name, {
        name,
        attributes,
      });
    });

    // 2nd pass
    this.querySelectAll(doc, 'complexType', complexType => {
      const name = this.getAttribute(complexType, 'name');
      const extension = complexType.querySelector('extension');
      if (extension) {
        const base = extension.getAttribute('base');
        if (base) {
          const type = this.complexTypes.get(name)!;
          type.base = this.complexTypes.get(base)!;
        }
      }
    });
  }

  parseElements(doc: Document) {
    // 1st pass
    this.querySelectAll(doc, 'element', element => {
      const name = this.getAttribute(element, 'name');
      const typeName = this.getAttribute(element, 'type');
      const type = this.complexTypes.get(typeName)!;
      this.elements.set(name, {
        name,
        type,
        attributes: [],
      });
    });

    // 2nd pass
    this.elements.forEach(element => {
      element.attributes.push(...this.getElementAttributes(element));
    });
  }

  private getAttribute(node: ChildNode | Element, name: string) {
    const value = (node as Element).getAttribute(name);
    if (!value) {
      throw new Error(`Attribute "${name}" not found`);
    }
    return value;
  }

  private childNodes(node: Element, fn: (node: ChildNode) => void) {
    node.childNodes.forEach(child => {
      if (child.nodeType !== 1) {
        return;
      }
      fn(child);
    });
  }

  private querySelectAll(
    node: Element | Document,
    selector: string,
    fn: (node: Element) => void
  ) {
    node.querySelectorAll(selector).forEach(child => {
      if (child.nodeType !== 1) {
        return;
      }
      fn(child);
    });
  }

  getElement(name: string) {
    return this.elements.get(name);
  }

  private getElementAttributes(element: XsdElement) {
    const attributes: XsdAttribute[] = [];
    let pointer: XsdComplexType | undefined = element.type;
    while (pointer) {
      const attrs = [...pointer.attributes];
      attrs.reverse();
      attributes.push(...attrs);
      pointer = pointer.base;
    }
    attributes.reverse();
    return attributes;
  }
}
