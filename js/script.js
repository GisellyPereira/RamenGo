/* eslint-disable no-undef */
import ConsumingBrothApi from './modules/consuming-broth.js';
import ConsumingProteinApi from './modules/consuming-protein.js';



document.addEventListener('DOMContentLoaded', () => {
  new ConsumingBrothApi();
});
document.addEventListener('DOMContentLoaded', () => {
  new ConsumingProteinApi();
}); 
