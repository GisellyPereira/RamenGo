/* eslint-disable no-undef */

import ConsumingBrothApi from './consuming-broth.js';
import ConsumingProteinApi from './consuming-protein.js';

class SelectingOrder {
  constructor() {
    this.selectedItems = {
      broth: null,
      protein: null,
    };

    if (typeof document !== 'undefined') {
      this.initializeApis();
      this.setupOrderButton();
      this.setupEventListeners();
    }
  }

  initializeApis() {
    this.brothApi = new ConsumingBrothApi();
    this.proteinApi = new ConsumingProteinApi();
  }

  setupOrderButton() {
    const orderButton = document.querySelector('.btn-request button');
    if (orderButton) {
      orderButton.addEventListener('click', () => this.showOrderSummary());
      this.updateOrderButton();
    } else {
      // eslint-disable-next-line no-console
      console.error('Order button not found!');
    }
  }

  setupEventListeners() {
    document.addEventListener('brothSelected', (event) => {
      const broth = event.detail;
      this.selectedItems.broth = broth;
      this.updateOrderButton();
    });

    document.addEventListener('proteinSelected', (event) => {
      const protein = event.detail;
      this.selectedItems.protein = protein;
      this.updateOrderButton();
    });

    document.addEventListener('itemDeselected', () => {
      this.updateOrderButton();
    });
  }

  updateOrderButton() {
    const orderButton = document.querySelector('.btn-request button');
    if (!orderButton) return;

    const { broth, protein } = this.selectedItems;
    if (!broth || !protein) {
      orderButton.classList.add('disabled');
      orderButton.querySelector('img').src = './public/arrow.png';
    } else {
      orderButton.classList.remove('disabled');
      orderButton.querySelector('img').src = './public/arrow-active.png';
    }
  }

  showOrderSummary() {
    const { broth, protein } = this.selectedItems;
    if (broth && protein) {
      localStorage.setItem('selectedBroth', broth.name);
      localStorage.setItem('selectedProtein', protein.name);
      window.location.href = 'success.html';
    } else {
      const toast = document.createElement('div');
      toast.classList.add('toast');
      toast.textContent = 'Please, select a broth and a protein.';

      const line = document.createElement('div');
      line.classList.add('line');
      toast.appendChild(line);

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.transform = 'translateY(0)';
      }, 100);

      setTimeout(() => {
        document.body.removeChild(toast);
      }, 5000);
    }
  }

  deselectItem(itemType) {
    if (itemType === 'broth') {
      this.selectedItems.broth = null;
    } else if (itemType === 'protein') {
      this.selectedItems.protein = null;
    }
    document.dispatchEvent(new Event('itemDeselected'));
  }
}

export default SelectingOrder;
