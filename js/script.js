import '../css/style.css';
import { broths, proteins, extras, totalPrice } from './menu.js';

const flavors = [
  { name: 'Shoyu & char siu', note: 'O CLÁSSICO DA CASA', description: 'Caldo de shoyu, porco braseado, ovo marinado e um toque de cebolinha.', profile: 'Profundo · delicado · reconfortante' },
  { name: 'Miso & karaage', note: 'PARA QUEM AMA INTENSIDADE', description: 'Miso encorpado, frango crocante, milho doce e o calor sutil da pimenta.', profile: 'Cremoso · crocante · intenso' },
  { name: 'Yasai & shiitake', note: 'UMAMI EM VERSÃO VEGETAL', description: 'Caldo vegetal, tofu dourado, shiitake e legumes cheios de textura.', profile: 'Vegetal · aromático · leve' },
];
const experience = document.querySelector('.experience');
const orbit = document.querySelector('#orbit');
const bowls = [...document.querySelectorAll('.bowl')];
const tabs = [...document.querySelectorAll('[data-flavor]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let target = 0;
let position = 0;
let frame = null;
let active = -1;
function updateFlavor(index) {
  if (active === index) return;
  active = index;
  const flavor = flavors[index];
  document.querySelector('#flavor-title').textContent = flavor.name;
  document.querySelector('#flavor-note').textContent = flavor.note;
  document.querySelector('#flavor-description').textContent = flavor.description;
  document.querySelector('#flavor-profile').textContent = flavor.profile;
  tabs.forEach((tab, i) => tab.setAttribute('aria-pressed', String(i === index)));
}
function animate() {
  position += (target - position) * .085;
  if (Math.abs(target - position) < .001) position = target;
  orbit.style.transform = `rotate(${-position * 120}deg)`;
  bowls.forEach((bowl, i) => { bowl.style.transform = `rotate(${position * 120 + position * 12 - i * 12}deg)`; });
  updateFlavor(Math.min(2, Math.max(0, Math.round(position))));
  frame = position === target ? null : requestAnimationFrame(animate);
}
function setTarget(value) {
  target = value;
  if (reducedMotion.matches) position = target;
  if (frame === null) frame = requestAnimationFrame(animate);
}
function syncScroll() {
  if (reducedMotion.matches) return;
  const distance = experience.offsetHeight - window.innerHeight;
  const progress = Math.min(1, Math.max(0, -experience.getBoundingClientRect().top / distance));
  setTarget(progress * 2);
}
tabs.forEach((tab, index) => tab.addEventListener('click', () => {
  if (reducedMotion.matches) { setTarget(index); return; }
  const top = experience.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top + index / 2 * (experience.offsetHeight - window.innerHeight), behavior: 'smooth' });
}));
window.addEventListener('scroll', syncScroll, { passive: true });
window.addEventListener('resize', syncScroll);
reducedMotion.addEventListener('change', syncScroll);
updateFlavor(0);
syncScroll();

function renderOptions(items, group, container) {
  document.querySelector(container).innerHTML = items.map(item => `<label class="option"><input type="radio" name="${group}" value="${item.id}" required><span class="option-content"><strong>${item.name}</strong><small>${item.description}</small><span class="price">${formatPrice(item.price)}</span></span></label>`).join('');
}
function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
renderOptions(broths, 'broth', '#broth-options');
renderOptions(proteins, 'protein', '#protein-options');
document.querySelector('#toppings').innerHTML = extras.map(item => `<label class="topping"><input type="checkbox" name="extra" value="${item.id}"><span>${item.name} + ${formatPrice(item.price)}</span></label>`).join('');
const form = document.querySelector('#bowl-form');
const finish = document.querySelector('#finish-order');
const dialog = document.querySelector('#order-dialog');
let selection = { broth: null, protein: null, extras: [] };
let lastImage = 'shoyu';
function updateOrder() {
  const data = new FormData(form);
  selection = { broth: broths.find(item => item.id === data.get('broth')), protein: proteins.find(item => item.id === data.get('protein')), extras: extras.filter(item => data.getAll('extra').includes(item.id)) };
  const { broth, protein } = selection;
  finish.disabled = !broth || !protein;
  document.querySelector('#order-price').textContent = formatPrice(totalPrice(selection));
  document.querySelector('#order-name').textContent = broth && protein ? `${broth.name} & ${protein.name}` : 'Escolha sua combinação';
  document.querySelector('#order-detail').textContent = broth && protein ? ['Noodles inclusos', ...selection.extras.map(item => item.name)].join(' · ') : 'Comece pelo caldo e pela proteína.';
  const image = protein?.image || broth?.image || 'shoyu';
  if (image !== lastImage) {
    const preview = document.querySelector('#preview-image');
    preview.classList.add('changed');
    preview.src = `./public/food/${image}.png`;
    setTimeout(() => preview.classList.remove('changed'), 350);
    lastImage = image;
  }
}
form.addEventListener('change', updateOrder);
form.addEventListener('submit', event => event.preventDefault());
finish.addEventListener('click', () => {
  if (!selection.broth || !selection.protein) return;
  document.querySelector('#dialog-summary').textContent = `${selection.broth.name} com ${selection.protein.name}. ${selection.extras.length ? 'Complementos: ' + selection.extras.map(item => item.name).join(', ') + '.' : 'Noodles inclusos, sem complementos adicionais.'} Total: ${formatPrice(totalPrice(selection))}.`;
  dialog.showModal();
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('#back-to-bowl').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
updateOrder();
