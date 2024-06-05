/* eslint-disable no-undef */

import { fetchProteins } from '../../api.js';

class ConsumingProteinApi {
  constructor() {
    if (typeof document !== 'undefined') {
      this.proteins = [];
      this.init();
    }
  }

  async init() {
    if (document.getElementById('proteinInitialized')) {
      return;
    }

    const initializedMarker = document.createElement('div');
    initializedMarker.id = 'proteinInitialized';
    document.body.appendChild(initializedMarker);

    const proteinList = document.getElementById('proteinList');

    try {
      this.proteins = await fetchProteins();
      this.proteins.forEach(protein => this.createProteinItem(protein, proteinList));
      document.dispatchEvent(new Event('proteinListReady'));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao carregar as proteínas:', error);
    }
  }

  createProteinItem(protein, container) {
    const div = document.createElement('div');
    div.classList.add('item-container');

    const img = document.createElement('img');
    img.src = protein.imageInactive;
    img.setAttribute('data-name', protein.name);
    img.classList.add('protein-image');

    const h2 = this.createElementWithText('h2', protein.name, 'protein-name');
    const p1 = this.createElementWithText('p', protein.description, 'protein-description');
    const p2 = this.createElementWithText('p', `US$ ${protein.price}`, 'protein-price');

    div.append(img, h2, p1, p2);
    container.appendChild(div);

    div.addEventListener('mouseover', () => {
      if (!div.classList.contains('selected')) {
        img.src = protein.imageActive;
      }
    });

    div.addEventListener('mouseout', () => {
      if (!div.classList.contains('selected')) {
        img.src = protein.imageInactive;
      }
    });

    div.addEventListener('click', () => {
      this.handleItemClick(div, img, protein);
    });
  }

  handleItemClick(div, img, protein) {
    const allContainers = document.querySelectorAll('.item-container');
  
    allContainers.forEach(container => {
      this.deactivateItem(container);
    });
  
    div.classList.add('selected');
    img.src = protein.imageActive;
    const event = new CustomEvent('proteinSelected', { detail: protein });
    document.dispatchEvent(event);
  }

  deactivateItem(container) {
    container.classList.remove('selected');
    const img = container.querySelector('.protein-image');
    if (img) {
      const name = img.getAttribute('data-name');
      const proteinData = this.proteins.find(p => p.name === name);
      if (proteinData) {
        img.src = proteinData.imageInactive;
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

export default ConsumingProteinApi;
