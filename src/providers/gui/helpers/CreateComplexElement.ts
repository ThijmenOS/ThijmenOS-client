/* eslint-disable @typescript-eslint/ban-ts-comment */
class CreateElement {
  static div() {
    const element = document.createElement("div");
    return new DivElement(element);
  }
  static span() {
    const element = document.createElement("span");
    return new SpanElement(element);
  }
  static p() {
    const element = document.createElement("p");
    return new ParagraphElement(element);
  }
  static h1() {
    const element = document.createElement("h1");
    return new HeadingElement(element);
  }
  static h2() {
    const element = document.createElement("h2");
    return new HeadingElement(element);
  }
  static h3() {
    const element = document.createElement("h3");
    return new HeadingElement(element);
  }
  static h4() {
    const element = document.createElement("h4");
    return new HeadingElement(element);
  }
  static h5() {
    const element = document.createElement("h5");
    return new HeadingElement(element);
  }
  static h6() {
    const element = document.createElement("h6");
    return new HeadingElement(element);
  }
}

class TElement<T extends HTMLElement> {
  protected element: T;

  constructor(element: T) {
    this.element = element;
  }

  class(item: string | Array<string>): TElement<T> {
    if (Array.isArray(item)) {
      this.element.classList.add(...item);
      return this;
    }

    this.element.classList.add(item);
    return this;
  }

  id(item: string): TElement<T> {
    this.element.id = item;
    return this;
  }

  style<T extends readonly [] | Array<keyof CSSStyleDeclaration>>(
    item: keyof CSSStyleDeclaration | T,
    value: string | { [K in keyof T]: string }
  ) {
    if (!Array.isArray(item)) {
      //@ts-ignore
      this.element.style[item] = value;
      return this;
    }

    item.forEach((style, index) => {
      //@ts-ignore
      this.element.style[style] = value[index as number];
    });

    return this;
  }

  attribute<T extends readonly [] | Array<string>>(
    key: string | T,
    value: string | { [K in keyof T]: string }
  ) {
    if (!Array.isArray(key)) {
      //@ts-ignore
      this.element.setAttribute(key, value);
      return this;
    }

    key.forEach((key, index) => {
      this.element.setAttribute(key, value[index]);
    });

    return this;
  }

  children(children: HTMLElement | Array<HTMLElement>) {
    if (!Array.isArray(children)) {
      this.element.appendChild(children);
      return this;
    }

    children.forEach((child) => this.element.appendChild(child));
    return this;
  }

  construct() {
    return this.element;
  }
}

class DivElement extends TElement<HTMLDivElement> {
  constructor(element: HTMLDivElement) {
    super(element);
  }
}

class SpanElement extends TElement<HTMLSpanElement> {
  constructor(element: HTMLSpanElement) {
    super(element);
  }
}

class ParagraphElement extends TElement<HTMLParagraphElement> {
  constructor(element: HTMLParagraphElement) {
    super(element);
  }
}

class HeadingElement extends TElement<HTMLHeadingElement> {
  constructor(element: HTMLHeadingElement) {
    super(element);
  }
}

export default CreateElement;
