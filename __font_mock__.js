// Mock Google Fonts CSS responses for offline builds
const makeFontFace = (family, weights, styles) => {
  const lines = [];
  for (const style of styles) {
    for (const weight of weights) {
      lines.push(`@font-face {
  font-family: '${family}';
  font-style: ${style};
  font-weight: ${weight};
  font-display: swap;
  src: local('Arial');
}`);
    }
  }
  return lines.join('\n');
};

module.exports = {
  // Playfair Display: ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap':
    makeFontFace('Playfair Display', [400, 500, 600, 700], ['normal', 'italic']),

  // Jost: wght@300;400;500;600;700;800;900
  'https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700;800;900&display=swap':
    makeFontFace('Jost', [300, 400, 500, 600, 700, 800, 900], ['normal']),

  // Caveat: wght@400;500;600
  'https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600&display=swap':
    makeFontFace('Caveat', [400, 500, 600], ['normal']),

  // Instrument Serif: ital,wght@0,400;1,400
  'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&display=swap':
    makeFontFace('Instrument Serif', [400], ['normal', 'italic']),

  // Fraunces: ital,wght@0,300;0,400;0,500;0,600;0,700;0,900;1,300;1,400;1,500;1,600;1,700;1,900
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,500;0,600;0,700;0,900;1,300;1,400;1,500;1,600;1,700;1,900&display=swap':
    makeFontFace('Fraunces', [300, 400, 500, 600, 700, 900], ['normal', 'italic']),
};
