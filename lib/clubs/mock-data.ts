/** PROTOTYPE_ONLY — fallback when API returns no neighborhood counts */

const NEAR_YOU_GRADS = [
  "linear-gradient(135deg,#FF85C0,#FFB3D9)",
  "linear-gradient(135deg,#E8006A,#FF5BAD)",
  "linear-gradient(135deg,#C80060,#FF1F7D)",
  "linear-gradient(135deg,#FF1F7D,#FF85C0)",
  "linear-gradient(135deg,#A8004C,#E8006A)",
];

export const NEAR_YOU_FALLBACK = [
  { name: "SoHo", clubs: 0, grad: NEAR_YOU_GRADS[0] },
  { name: "Williamsburg", clubs: 0, grad: NEAR_YOU_GRADS[1] },
  { name: "West Village", clubs: 0, grad: NEAR_YOU_GRADS[2] },
  { name: "Brooklyn Hts", clubs: 0, grad: NEAR_YOU_GRADS[3] },
  { name: "Harlem", clubs: 0, grad: NEAR_YOU_GRADS[4] },
];
