/* eslint-disable no-undef */
import { fetchBroths } from '../../api.js';

class ConsumingBrothApi {
  constructor() {
    if (typeof document !== 'undefined') {
      this.init();
    }
    this.activeImage = null;
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
      const broths = await fetchBroths();
      broths.forEach((broth) => this.createBrothItem(broth, brothList));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao carregar os caldos:', error);
    }
  }

  createBrothItem(broth, container) {
    const div = document.createElement('div');
    div.classList.add('item-container');

    const img = this.createBrothImage(broth.name);
    const h2 = this.createElementWithText('h2', broth.name, 'broth-name');
    const p1 = this.createElementWithText('p', broth.description, 'broth-description');
    const p2 = this.createElementWithText('p', `US$ ${broth.price}`, 'broth-price');

    div.append(img, h2, p1, p2);
    container.appendChild(div);

    div.addEventListener('mouseover', () => this.changeImageOnHover(img, true));
    div.addEventListener('mouseout', () => this.changeImageOnHover(img, false));
    div.addEventListener('click', () => this.toggleActiveImage(img));
  }

  createBrothImage(name) {
    const img = document.createElement('img');
    img.src = this.getBrothImageSrc(name);
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
    const newImgSrc = isHover ? this.getBrothActiveImageSrc(imgName) : this.getBrothImageSrc(imgName);
    if (img.getAttribute('data-active') === 'false') {
      img.src = newImgSrc;
    }
  }

  toggleActiveImage(img) {
    const imgName = img.getAttribute('data-name');
    const newImgSrc = this.getBrothActiveImageSrc(imgName);

    if (this.activeImage) {
      const prevImgName = this.activeImage.getAttribute('data-name');
      this.activeImage.src = this.getBrothImageSrc(prevImgName);
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

  getBrothImageSrc(name) {
    const images = {
      Salt: '../public/salt.png',
      Shoyu: '../public/shoyu.png',
      Miso: '../public/miso.png',
    };
    return images[name] || 'Imagem não encontrada';
  }

  getBrothActiveImageSrc(name) {
    const activeImages = {
      Salt: '../public/salt-active.png',
      Shoyu: '../public/shoyu-active.png',
      Miso: '../public/miso-active.png',
    };
    return activeImages[name] || 'Imagem não encontrada';
  }
}

export default ConsumingBrothApi;
