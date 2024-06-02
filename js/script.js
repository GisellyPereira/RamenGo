/* eslint-disable no-undef */
import ConsumingBrothApi from './modules/consuming-broth.js';
import ConsumingProteinApi from './modules/consuming-protein.js';
import SelectingOrder from './modules/selecting-order.js'; 
import ScrollToOrder from './modules/scroll-to-order.js';


document.addEventListener('DOMContentLoaded', () => {
  new ConsumingBrothApi();
});
document.addEventListener('DOMContentLoaded', () => {
  new ConsumingProteinApi();
});
document.addEventListener('DOMContentLoaded', () => {
  new SelectingOrder();
});
document.addEventListener('DOMContentLoaded', () => {
  new ScrollToOrder();
});
