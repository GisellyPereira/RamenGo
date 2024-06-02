/* eslint-disable no-undef */
import { fetchProteins } from '../../api.js';

class ConsumingProteinApi {
  constructor() {
    if (typeof document !== 'undefined') {
      this.init();
    }
    this.activeImage = null; 
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
      const proteins = await fetchProteins();
      proteins.forEach((protein) => this.createProteinItem(protein, proteinList));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao carregar as proteínas:', error);
    }
  }

  createProteinItem(protein, container) {
    const div = document.createElement('div');
    div.classList.add('item-container');

    const img = this.createProteinImage(protein.name);
    const h2 = this.createElementWithText('h2', protein.name, 'protein-name');
    const p1 = this.createElementWithText('p', protein.description, 'protein-description');
    const p2 = this.createElementWithText('p', `US$ ${protein.price}`, 'protein-price');

    div.append(img, h2, p1, p2);
    container.appendChild(div);

    div.addEventListener('mouseover', () => this.changeImageOnHover(img, true));
    div.addEventListener('mouseout', () => this.changeImageOnHover(img, false));
    div.addEventListener('click', () => this.toggleActiveImage(img));
  }

  createProteinImage(name) {
    const img = document.createElement('img');
    img.src = this.getProteinImageSrc(name);
    img.setAttribute('data-name', name);
    img.setAttribute('data-active', 'false');
    return img;
  }

  createElementWithText(tag, text, className) {
    const element = document.createElement(tag);
    element.textContent = text;
    if (className) {
      element.classList.add(className);
    }
    return element;
  }

  changeImageOnHover(img, isHover) {
    const imgName = img.getAttribute('data-name');
    const newImgSrc = isHover ? this.getProteinActiveImageSrc(imgName) : this.getProteinImageSrc(imgName);
    if (img.getAttribute('data-active') === 'false') {
      img.src = newImgSrc;
    }
  }

  toggleActiveImage(img) {
    const imgName = img.getAttribute('data-name');
    const newImgSrc = this.getProteinActiveImageSrc(imgName);

    if (this.activeImage) {
      const prevImgName = this.activeImage.getAttribute('data-name');
      this.activeImage.src = this.getProteinImageSrc(prevImgName);
      this.activeImage.setAttribute('data-active', 'false');
      this.activeImage.parentElement.classList.remove('active');
    }

    if (this.activeImage === img) {
      this.activeImage = null;
    } else {
      img.src = newImgSrc;
      img.setAttribute('data-active', 'true');
      img.parentElement.classList.add('active');
      this.activeImage = img;
    }
  }

  getProteinImageSrc(name) {
    const images = {
      Chasu: '../public/pork.png',
      'Yasai Vegetarian': '../public/yasai.png',
      Karaague: '../public/chicken.png',
    };
    return images[name] || 'Imagem não encontrada';
  }

  getProteinActiveImageSrc(name) {
    const activeImages = {
      Chasu: '../public/pork-active.png',
      'Yasai Vegetarian': '../public/yasai-active.png',
      Karaague: '../public/chicken-active.png',
    };
    return activeImages[name] || 'Imagem não encontrada';
  }
}

export default ConsumingProteinApi;
