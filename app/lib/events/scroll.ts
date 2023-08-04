export class Scroller {
  public element: HTMLElement;

  public fallback: string;

  public pos = {
    top: 0,
    left: 0,
    x: 0,
    y: 0
  }

  constructor(element: HTMLDivElement, fallback: string) {
    this.element = element;
    if (this.element) {
      this.element.scrollLeft = 150;
      this.element.scrollTop = 100;
    }
    this.fallback = fallback;
  }

  mouseDownHandler(event: MouseEvent) {
    if (!this.element || this.element === undefined) {
      this.element = document.querySelector(this.fallback) as HTMLDivElement;
    }

    this.pos = {
      left: this.element.scrollLeft,
      top: this.element.scrollTop,
      x: event.clientX,
      y: event.clientY,
    };

    document.addEventListener('mousemove', this.mouseMoveHandler);
    document.addEventListener('mouseup', this.mouseUpHandler);
  }

  mouseMoveHandler(event: MouseEvent) {
    // How far the mouse has been moved
    const dx = event.clientX - this.pos.x;
    const dy = event.clientY - this.pos.y;

    // Scroll the element
    this.element.scrollTop = this.pos.top - dy;
    this.element.scrollLeft = this.pos.left - dx;
  };

  mouseUpHandler = () => {
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('mouseup', this.mouseUpHandler);

    this.element.style.cursor = 'grab';
    this.element.style.removeProperty('user-select');
  };
}