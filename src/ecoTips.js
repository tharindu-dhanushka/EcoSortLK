// Bundled educational tips: no network connection is needed to seed or read them.
export const ECO_TIPS = [
  { id: 1, title: 'Separate waste where you use it', body: 'Keep separate containers for clean recyclables, organic scraps and other waste. Check your local collection rules before combining materials.' },
  { id: 2, title: 'Keep paper clean and dry', body: 'Store newspapers and flattened cardboard away from food and liquids. Soiled tissues should stay out of clean paper recycling.' },
  { id: 3, title: 'Empty accepted containers', body: 'Empty and rinse bottles, cans and food containers that your collector accepts. Check the material type; a recycling symbol alone does not guarantee acceptance.' },
  { id: 4, title: 'Reuse before discarding', body: 'Repair or donate usable items when appropriate. Reuse clean containers for suitable non-food storage rather than buying new organizers.' },
  { id: 5, title: 'Compost suitable plant scraps', body: 'Vegetable peels and dry leaves can go into a managed home compost system. Keep it covered and managed to avoid attracting pests.' },
  { id: 6, title: 'Keep batteries and electronics separate', body: 'Use an approved collection or take-back service for batteries and electronics. Never burn, crush or puncture batteries, and stop using damaged chargers.' },
  { id: 7, title: 'Protect waste handlers', body: 'Do not leave broken glass loose. Use a safe rigid container or secure wrapping, label it and follow your local disposal service instructions.' },
  { id: 8, title: 'Plan for less waste', body: 'Carry a reusable shopping bag and choose durable items when practical. Before purchasing, consider whether you can repair or reuse something you already own.' },
];

export function getEcoTips(db) {
  return db.getAllAsync('SELECT id, title, body FROM eco_tips ORDER BY id');
}
