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
    } else {
      // eslint-disable-next-line no-console
      console.error('Order button not found!');
    }
  }

  setupEventListeners() {
    document.addEventListener('brothSelected', (event) => {
      const broth = event.detail;
      this.selectedItems.broth = broth;
    });

    document.addEventListener('proteinSelected', (event) => {
      const protein = event.detail;
      this.selectedItems.protein = protein;
    });
  }

  showOrderSummary() {
    setTimeout(() => {
      const { broth, protein } = this.selectedItems;
      if (broth && protein) {
        localStorage.setItem('selectedBroth', broth.name);
        localStorage.setItem('selectedProtein', protein.name);
        window.location.href = 'success.html';
      } else {
        alert('Por favor, selecione um caldo e uma proteína.');
      }
    }, 100);
  }
}

export default SelectingOrder;
