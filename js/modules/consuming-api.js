import '../../css/style.css';

import { fetchBroths, fetchProteins, createOrder } from '../../api.js';

export default class ConsumingApi {
  constructor() {
    // eslint-disable-next-line no-undef
    document.addEventListener('DOMContentLoaded', async () => {
      // eslint-disable-next-line no-undef
      const brothSelect = document.getElementById('brothSelect');
      // eslint-disable-next-line no-undef
      const proteinSelect = document.getElementById('proteinSelect');
      // eslint-disable-next-line no-undef
      const orderForm = document.getElementById('ramenForm');
      // eslint-disable-next-line no-undef
      const orderStatus = document.getElementById('orderStatus');

      try {
        const broths = await fetchBroths();
        const proteins = await fetchProteins();

        broths.forEach((broth) => {
          // eslint-disable-next-line no-undef
          const option = document.createElement('option');
          option.value = broth.id;
          option.textContent = broth.name;
          brothSelect.appendChild(option);
        });

        proteins.forEach((protein) => {
          // eslint-disable-next-line no-undef
          const option = document.createElement('option');
          option.value = protein.id;
          option.textContent = protein.name;
          proteinSelect.appendChild(option);
        });

        orderForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          const brothId = brothSelect.value;
          const proteinId = proteinSelect.value;

          try {
            const result = await createOrder(brothId, proteinId);

            if (result.orderId) {
              orderStatus.textContent = `Pedido criado com sucesso! ID do pedido: ${result.orderId}`;
              orderStatus.style.color = 'green';
            } else {
              orderStatus.textContent =
                'Falha ao criar o pedido. Tente novamente.';
              orderStatus.style.color = 'red';
            }
          // eslint-disable-next-line no-unused-vars
          } catch (error) {
            orderStatus.textContent =
              'Erro ao criar o pedido. Tente novamente.';
            orderStatus.style.color = 'red';
          }
        });
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        orderStatus.textContent = 'Erro ao carregar opções. Tente novamente.';
        orderStatus.style.color = 'red';
      }
    });
  }
}
