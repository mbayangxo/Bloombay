/** BloomBay luxury motion tokens — editorial, soft, no bounce */

export const LUXURY_EASE = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.6,
  medium: 0.8,
  slow: 1,
  reveal: 1.2,
} as const;

export const OPEN_SEQUENCE_MS = 1300;

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.medium, ease: LUXURY_EASE },
  },
};

export const fadeSlideUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.reveal, ease: LUXURY_EASE },
  },
};

export const sceneEnter = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: DURATION.medium, ease: LUXURY_EASE },
};

export const sceneEnterReduced = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 1, y: 0 },
  transition: { duration: 0 },
};

/** Future admin dashboard — cards, metrics, map pins */
export const dashboardCard = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: DURATION.medium, ease: LUXURY_EASE },
  }),
};

export const dashboardPin = {
  hidden: { opacity: 0, scale: 0.6 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.slow, ease: LUXURY_EASE },
  },
};
