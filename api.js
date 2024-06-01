const API_URL = 'https://api.tech.redventures.com.br';
const API_KEY = 'ZtVdh8XQ2U8pWI2gmZ7f796Vh8GllXoN7mr0djNf';

export async function fetchBroths() {
  // eslint-disable-next-line no-undef
  const response = await fetch(`${API_URL}/broths`, {
    headers: {
      'x-api-key': API_KEY
    }
  });
  return response.json();
}

export async function fetchProteins() {
  // eslint-disable-next-line no-undef
  const response = await fetch(`${API_URL}/proteins`, {
    headers: {
      'x-api-key': API_KEY
    }
  });
  return response.json();
}

export async function createOrder(brothId, proteinId) {
  // eslint-disable-next-line no-undef
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    },
    body: JSON.stringify({ brothId, proteinId })
  });
  return response.json();
}