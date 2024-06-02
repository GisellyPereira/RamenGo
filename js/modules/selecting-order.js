/* eslint-disable no-undef */

import ConsumingBrothApi from './consuming-broth.js';
import ConsumingProteinApi from './consuming-protein.js';

class SelectingOrder {
  constructor() {
    this.selectedItems = {
      broth: null,
      protein: null
    };

    if (typeof document !== 'undefined') {
      this.init();
    }
  }

  async init() {
    this.initializeApis();
    this.retrieveSelectedItems();
    this.setupOrderButton();
  }

  initializeApis() {
    this.brothApi = new ConsumingBrothApi(this.handleSelection.bind(this));
    this.proteinApi = new ConsumingProteinApi(this.handleSelection.bind(this));
  }

  retrieveSelectedItems() {
    const selectedBroth = localStorage.getItem('selectedBroth');
    const selectedProtein = localStorage.getItem('selectedProtein');

    if (selectedBroth) {
      this.selectedItems.broth = selectedBroth;
    }
    if (selectedProtein) {
      this.selectedItems.protein = selectedProtein;
    }
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

  handleSelection(type, name) {
    this.selectedItems[type] = name;
    localStorage.setItem(`selected${type.charAt(0).toUpperCase() + type.slice(1)}`, name);
  }

  showOrderSummary() {
    const { broth, protein } = this.selectedItems;
    if (broth && protein) {
      window.location.href = 'success.html';
    } else {
      alert('Por favor, selecione um caldo e uma proteína.');
    }
  }
}

export default SelectingOrder;
