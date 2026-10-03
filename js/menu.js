export const broths = [
  { id: 'shoyu', name: 'Shoyu', description: 'Leve e profundo, com a intensidade do molho de soja.', price: 18, image: 'shoyu' },
  { id: 'miso', name: 'Miso', description: 'Encorpado e aromático, com pasta de soja fermentada.', price: 20, image: 'miso' },
  { id: 'yasai', name: 'Vegetal', description: 'Umami de cogumelos e legumes. Totalmente vegetal.', price: 18, image: 'yasai' },
];
export const proteins = [
  { id: 'chasu', name: 'Char siu', description: 'Porco braseado, macio e cheio de sabor.', price: 16, image: 'shoyu' },
  { id: 'karaage', name: 'Karaage', description: 'Frango dourado, com uma casquinha crocante.', price: 14, image: 'miso' },
  { id: 'tofu', name: 'Tofu', description: 'Dourado por fora, delicado por dentro.', price: 12, image: 'yasai' },
];
export const extras = [
  { id: 'egg', name: 'Ovo marinado', price: 5 },
  { id: 'nori', name: 'Nori', price: 3 },
  { id: 'mushroom', name: 'Shiitake', price: 6 },
  { id: 'corn', name: 'Milho', price: 3 },
];
export function totalPrice(selection) {
  return (selection.broth?.price || 0) + (selection.protein?.price || 0) + selection.extras.reduce((sum, item) => sum + item.price, 0);
}
