import '../css/style.css';
import { broths, proteins, extras, totalPrice, combinationImage } from './menu.js';

const flavors = [
  { name: 'Shoyu & char siu', note: 'O CLÁSSICO DA CASA', description: 'Caldo de shoyu, porco braseado, ovo marinado e um toque de cebolinha.', profile: 'Profundo · delicado · reconfortante' },
  { name: 'Miso & karaage', note: 'PARA QUEM AMA INTENSIDADE', description: 'Miso encorpado, frango crocante, milho doce e o calor sutil da pimenta.', profile: 'Cremoso · crocante · intenso' },
  { name: 'Yasai & shiitake', note: 'UMAMI EM VERSÃO VEGETAL', description: 'Caldo vegetal, tofu dourado, shiitake e legumes cheios de textura.', profile: 'Vegetal · aromático · leve' },
];
const experience = document.querySelector('.experience');
const bowls = [...document.querySelectorAll('.bowl')];
const stage = document.querySelector('.stage');
const orbitMeasure = document.createElement('span');
orbitMeasure.className = 'orbit-measure';
document.querySelector('.food-scene').append(orbitMeasure);
let orbitRadius = 0;
let orbitSpread = 1;
let orbitCenter = 0;
let textWidth = 0;
let textBottom = 0;
function measureOrbit() {
  orbitRadius = orbitMeasure.offsetHeight;
  orbitSpread = Number(getComputedStyle(stage).getPropertyValue('--orbit-spread')) || 1;
  orbitCenter = parseFloat(getComputedStyle(bowls[0]).top);
  const copy = document.querySelector('.flavor-copy');
  textWidth = copy.offsetWidth;
  textBottom = copy.offsetTop + copy.offsetHeight;
}
measureOrbit();
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
  measureOrbit();
}
function animate() {
  position += (target - position) * .085;
  if (Math.abs(target - position) < .001) position = target;
  bowls.forEach((bowl, i) => {
    const angle = i * 120 - position * 120;
    const emphasis = Math.max(0, Math.cos(angle * Math.PI / 180));
    const radians = angle * Math.PI / 180;
    const x = -Math.sin(radians) * orbitRadius * orbitSpread;
    let y = Math.cos(radians) * orbitRadius;
    const radius = bowls[i].offsetWidth * .43 * (.78 + .22 * emphasis);
    const distance = Math.max(0, Math.abs(x) - textWidth / 2);
    if (y >= 0 && distance < radius) {
      y = Math.max(y, textBottom + 24 + Math.sqrt(radius * radius - distance * distance) - orbitCenter);
    }
    bowl.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${position * 18}deg) scale(${.78 + .22 * emphasis})`;
  });
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
window.addEventListener('resize', () => { measureOrbit(); syncScroll(); if (frame === null) frame = requestAnimationFrame(animate); });
reducedMotion.addEventListener('change', syncScroll);
updateFlavor(0);
syncScroll();
document.fonts.ready.then(() => { measureOrbit(); setTarget(target); });

function renderOptions(items, group, container) {
  document.querySelector(container).innerHTML = items.map((item, index) => `<label class="option"><input type="radio" name="${group}" value="${item.id}" ${index === 0 ? 'checked' : ''} required><span class="option-content"><strong>${item.name}</strong><small>${item.description}</small><span class="price">${formatPrice(item.price)}</span></span></label>`).join('');
}
function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
renderOptions(broths, 'broth', '#broth-options');
renderOptions(proteins, 'protein', '#protein-options');
document.querySelector('#toppings').innerHTML = extras.map(item => `<label class="topping"><input type="checkbox" name="extra" value="${item.id}"><span class="topping-card"><img src="./public/food/extras/${item.id}.png" alt="" width="160" height="160" loading="lazy"><span class="topping-info"><strong>${item.name}</strong><small>${item.description}</small><span class="extra-price">+ ${formatPrice(item.price)}</span></span><span class="topping-check" aria-hidden="true">+</span></span></label>`).join('');
const form = document.querySelector('#bowl-form');
const finish = document.querySelector('#finish-order');
const dialog = document.querySelector('#order-dialog');
let selection = { broth: null, protein: null, extras: [] };
let lastImage = '';
let previewRequest = 0;
function updateOrder() {
  const data = new FormData(form);
  selection = { broth: broths.find(item => item.id === data.get('broth')), protein: proteins.find(item => item.id === data.get('protein')), extras: extras.filter(item => data.getAll('extra').includes(item.id)) };
  const { broth, protein } = selection;
  finish.disabled = !broth || !protein;
  document.querySelector('#order-price').textContent = formatPrice(totalPrice(selection));
  document.querySelector('#mobile-total').textContent = formatPrice(totalPrice(selection));
  document.querySelector('#mobile-review').disabled = finish.disabled;
  document.querySelector('#order-name').textContent = broth && protein ? `${broth.name} & ${protein.name}` : 'Escolha sua combinação';
  document.querySelector('#order-detail').textContent = broth && protein ? ['Noodles inclusos', ...selection.extras.map(item => item.name)].join(' · ') : 'Comece pelo caldo e pela proteína.';
  const image = combinationImage(broth?.id, protein?.id, selection.extras.map(item => item.id));
  if (image && image !== lastImage) {
    lastImage = image;
    const request = ++previewRequest;
    const incoming = new Image();
    const display = document.querySelector('.bowl-display');
    const status = document.querySelector('#preview-status');
    const extraNames = selection.extras.map(item => item.name.toLowerCase());
    const alt = `Ramen de caldo ${broth.name.toLowerCase()} com ${protein.name.toLowerCase()}${extraNames.length ? ', ' + extraNames.join(', ') : ', sem adicionais'}`;
    display.setAttribute('aria-busy', 'true');
    status.textContent = 'Preparando seu bowl…';
    incoming.src = image;
    incoming.decode().then(() => {
      if (request !== previewRequest) return;
      const preview = document.querySelector('#preview-image');
      preview.src = image;
      preview.alt = alt;
      display.setAttribute('aria-busy', 'false');
      status.textContent = '';
      if (!reducedMotion.matches) preview.animate([{ opacity: .45, transform: 'rotate(-7deg) scale(.97)' }, { opacity: 1, transform: 'rotate(0) scale(1)' }], { duration: 450, easing: 'ease-out' });
    }).catch(() => {
      if (request !== previewRequest) return;
      display.setAttribute('aria-busy', 'false');
      status.textContent = 'Não foi possível mostrar este bowl. Tente selecionar novamente.';
      lastImage = '';
    });
  }
  document.querySelector('#selected-extras').innerHTML = selection.extras.map(item => `<span><img src="./public/food/extras/${item.id}.png" alt="" width="80" height="80"><small>${item.name}</small></span>`).join('');
  document.querySelectorAll('.topping').forEach(label => {
    label.querySelector('.topping-check').textContent = label.querySelector('input').checked ? '✓' : '+';
  });
}
form.addEventListener('change', updateOrder);
form.addEventListener('submit', event => event.preventDefault());
function showSummary() {
  if (!selection.broth || !selection.protein) return;
  document.querySelector('#dialog-summary').textContent = `${selection.broth.name} com ${selection.protein.name}. ${selection.extras.length ? 'Complementos: ' + selection.extras.map(item => item.name).join(', ') + '.' : 'Noodles inclusos, sem complementos adicionais.'} Total: ${formatPrice(totalPrice(selection))}.`;
  dialog.showModal();
}
finish.addEventListener('click', showSummary);
document.querySelector('#mobile-review').addEventListener('click', showSummary);
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('#back-to-bowl').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
updateOrder();
