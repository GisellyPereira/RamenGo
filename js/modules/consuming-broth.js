/* eslint-disable no-undef */

import { fetchBroths } from '../../api.js';

class ConsumingBrothApi {
  constructor(onSelect) {
    if (typeof document !== 'undefined') {
      this.onSelect = onSelect;
      this.broths = [];
      this.init();
    }
  }

  async init() {
    if (document.getElementById('brothInitialized')) {
      return;
    }

    const initializedMarker = document.createElement('div');
    initializedMarker.id = 'brothInitialized';
    document.body.appendChild(initializedMarker);

    const brothList = document.getElementById('brothList');

    try {
      this.broths = await fetchBroths();
      this.broths.forEach(broth => this.createBrothItem(broth, brothList));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao carregar os caldos:', error);
    }
  }

  createBrothItem(broth, container) {
    const div = document.createElement('div');
    div.classList.add('item-container');

    const img = document.createElement('img');
    img.src = broth.imageInactive;
    img.setAttribute('data-name', broth.name);
    img.classList.add('broth-image');

    const h2 = this.createElementWithText('h2', broth.name, 'broth-name');
    const p1 = this.createElementWithText('p', broth.description, 'broth-description');
    const p2 = this.createElementWithText('p', `US$ ${broth.price}`, 'broth-price');

    div.append(img, h2, p1, p2);
    container.appendChild(div);

    div.addEventListener('mouseover', () => {
      if (!div.classList.contains('active')) {
        img.src = broth.imageActive;
      }
    });

    div.addEventListener('mouseout', () => {
      if (!div.classList.contains('active')) {
        img.src = broth.imageInactive;
      }
    });

    div.addEventListener('click', () => {
      this.handleItemClick(div, img, broth);
    });
  }

  handleItemClick(div, img, broth) {
    const allContainers = document.querySelectorAll('.item-container');
    const isActive = div.classList.contains('active');

    if (isActive) {
      this.deactivateItem(div, img);
      localStorage.removeItem('selectedBroth');
    } else {
      allContainers.forEach(container => {
        this.deactivateItem(container, container.querySelector('.broth-image'));
      });
      div.classList.add('active');
      img.src = broth.imageActive;
      this.onSelect && this.onSelect('broth', broth.name);
      localStorage.setItem('selectedBroth', broth.name);
    }
  }

  deactivateItem(container, img) {
    container.classList.remove('active');
    if (img) {
      const name = img.getAttribute('data-name');
      const brothData = this.broths.find(b => b.name === name);
      if (brothData) {
        img.src = brothData.imageInactive;
      }
    }
  }

  createElementWithText(tag, text, className) {
    const element = document.createElement(tag);
    element.textContent = text;
    if (className) {
      element.classList.add(className);
    }
    return element;
  }
}

export default ConsumingBrothApi;
