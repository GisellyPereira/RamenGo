/* eslint-disable no-undef */

class OrderSummary {
  constructor() {}

  init() {
    this.setupNewOrderButton();
    this.displayOrderSummary();
  }

  setupNewOrderButton() {
    const newOrderButton = document.querySelector('.new-order-button');
    if (newOrderButton) {
      newOrderButton.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }
  }

  displayOrderSummary() {
    const orderSummaryElement = document.getElementById('order-summary');
    if (orderSummaryElement) {
      const broth = localStorage.getItem('selectedBroth');
      const protein = localStorage.getItem('selectedProtein');

      if (broth && protein) {
        orderSummaryElement.textContent = `${broth} and ${protein} Ramen`;

        const imagePath = this.getImagePath(protein);
        this.updateRamenImage(imagePath);
      } else {
        orderSummaryElement.textContent = 'Nenhum pedido selecionado.';
      }
    }
  }

  getImagePath(protein) {
    const imagePaths = {
      Chasu: './public/ramen-chasu.png',
      'Yasai Vegetarian': './public/ramen-yasai.png',
      Karaague: './public/ramen-karaague.png',
    };

    return imagePaths[protein] || '';
  }

  updateRamenImage(imagePath) {
    const ramenImageElement = document.querySelector('.ramen-image');
    if (ramenImageElement) {
      ramenImageElement.src = imagePath;
    }
  }
}

export default OrderSummary;
