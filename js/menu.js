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
  { id: 'egg', name: 'Ovo marinado', description: 'Gema cremosa, marinado em shoyu.', price: 5 },
  { id: 'nori', name: 'Nori', description: 'Alga tostada, um toque de mar.', price: 3 },
  { id: 'mushroom', name: 'Shiitake', description: 'Cogumelos salteados, mais umami.', price: 6 },
  { id: 'corn', name: 'Milho', description: 'Grãos doces e levemente tostados.', price: 3 },
];
export function totalPrice(selection) {
  return (selection.broth?.price || 0) + (selection.protein?.price || 0) + selection.extras.reduce((sum, item) => sum + item.price, 0);
}

export function combinationImage(brothId, proteinId, selectedExtras = []) {
  if (!broths.some(item => item.id === brothId) || !proteins.some(item => item.id === proteinId)) return null;
  if (selectedExtras.some(id => !extras.some(item => item.id === id))) return null;
  const orderedExtras = extras.filter(item => selectedExtras.includes(item.id)).map(item => item.id);
  const base = `${brothId}-${proteinId}`;
  return orderedExtras.length
    ? `./public/food/variants/${base}--${orderedExtras.join('-')}.png`
    : `./public/food/combinations/${base}.png`;
}
