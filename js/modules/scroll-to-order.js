/* eslint-disable no-undef */

class ScrollToOrder {
  constructor() {
    this.init();
  }

  init() {
    const orderButton = document.querySelector('.order-btn');
    if (orderButton) {
      orderButton.addEventListener('click', () => this.scrollToMenuSection());
    } else {
      // eslint-disable-next-line no-console
      console.error('Order button not found!');
    }
  }

  scrollToMenuSection() {
    const menuSection = document.querySelector('.menu-contain');
    if (menuSection) {
      this.smoothScroll(menuSection);
    }
  }

  smoothScroll(element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

export default ScrollToOrder;
