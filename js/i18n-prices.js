// Texts of the prices page (added to the main dictionary in js/i18n.js)
(function () {
  var add = {
    en: {
      'pz.a.n': 'Avatar', 'pz.a.p': '150–400 UAH', 'pz.a.d': 'Bust-up portrait, perfect for a profile picture.',
      'pz.h.n': 'Half-body', 'pz.h.p': '200–500 UAH', 'pz.h.d': 'Character from the waist up with a pose of your choice.',
      'pz.f.n': 'Full body', 'pz.f.p': '400–1500 UAH', 'pz.f.d': 'Full-length character illustration.', 'pz.f.note': 'Complex pose: +450 UAH',
      'pz.r.n': 'Reference sheet', 'pz.r.p': '700–2000 UAH', 'pz.r.d': 'Character reference sheet for your OC: views and details in one place.',
      'pz.n.n': 'NSFW (18+)', 'pz.n.p': '500–1000 UAH', 'pz.n.d': 'Adult artwork, for clients 18 and older only.', 'pz.n.note': '18+ only',
      'pz.t.title': 'Terms of work',
      'pz.pay.t': 'Payment', 'pz.pay.d': '50% prepayment after the sketch is approved (or 100% upfront), paid to a bank card.',
      'pz.rev.t': 'Revisions', 'pz.rev.d': '2–3 free revisions at the sketch stage. After coloring, only minor color changes.',
      'pz.time.t': 'Timeline', 'pz.time.d': 'From 5 to 12 days, depending on the complexity of the order.'
    },
    uk: {
      'pz.a.n': 'Аватарка', 'pz.a.p': '150–400 грн', 'pz.a.d': 'Портрет по груди, ідеально для аватарки в соцмережах.',
      'pz.h.n': 'По пояс', 'pz.h.p': '200–500 грн', 'pz.h.d': 'Персонаж по пояс із позою на ваш вибір.',
      'pz.f.n': 'Повний зріст', 'pz.f.p': '400–1500 грн', 'pz.f.d': 'Ілюстрація персонажа на весь зріст.', 'pz.f.note': 'Складна поза: +450 грн',
      'pz.r.n': 'Референс лист', 'pz.r.p': '700–2000 грн', 'pz.r.d': 'Референс лист вашого персонажа (OC): види та деталі в одному місці.',
      'pz.n.n': 'NSFW (18+)', 'pz.n.p': '500–1000 грн', 'pz.n.d': 'Арти для дорослих, лише для замовників від 18 років.', 'pz.n.note': 'Лише 18+',
      'pz.t.title': 'Умови роботи',
      'pz.pay.t': 'Оплата', 'pz.pay.d': '50% передоплата після затвердження скетчу (або 100% одразу) на картку.',
      'pz.rev.t': 'Правки', 'pz.rev.d': '2–3 безкоштовні правки на етапі скетчу. Після фарбування — лише дрібні зміни кольору.',
      'pz.time.t': 'Термін виконання', 'pz.time.d': 'Від 5 до 12 днів залежно від складності замовлення.'
    }
  };
  for (var l in add) { window.I18N[l] = Object.assign(window.I18N[l] || {}, add[l]); }
})();
