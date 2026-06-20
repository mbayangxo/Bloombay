/**
 * Curated onboarding copy by locale — not machine-translated.
 * Add locales with native-speaker review before production.
 */

export type OnboardingLocale = "en" | "fr" | "hi";

const COPY: Record<
  OnboardingLocale,
  {
    name: string;
    photo: string;
    location: string;
    age: string;
    interests: string;
    about: string;
    gender: string;
    continue: string;
    skip: string;
    finish: string;
  }
> = {
  en: {
    name: "What should we call you?",
    photo: "Add a photo so we can verify you",
    location: "Where are you based?",
    age: "Your age range",
    interests: "What are you here for?",
    about: "Tell Yande a little about you",
    gender: "BloomBay is for women only. I confirm I am a woman joining this community.",
    continue: "Continue",
    skip: "Skip for now",
    finish: "Enter BloomBay",
  },
  fr: {
    name: "Comment devons-nous vous appeler ?",
    photo: "Ajoutez une photo pour la vérification",
    location: "Où habitez-vous ?",
    age: "Votre tranche d'âge",
    interests: "Pourquoi êtes-vous ici ?",
    about: "Parlez un peu de vous à Yande",
    gender: "BloomBay est réservé aux femmes. Je confirme être une femme qui rejoint cette communauté.",
    continue: "Continuer",
    skip: "Passer pour l'instant",
    finish: "Entrer dans BloomBay",
  },
  hi: {
    name: "हम आपको क्या बुलाएँ?",
    photo: "सत्यापन के लिए एक फ़ोटो जोड़ें",
    location: "आप कहाँ रहती हैं?",
    age: "आपकी उम्र सीमा",
    interests: "आप यहाँ किस लिए हैं?",
    about: "Yande को अपने बारे में थोड़ा बताएँ",
    gender: "BloomBay केवल महिलाओं के लिए है। मैं पुष्टि करती हूँ कि मैं इस समुदाय में शामिल होने वाली महिला हूँ।",
    continue: "आगे बढ़ें",
    skip: "अभी छोड़ें",
    finish: "BloomBay में प्रवेश करें",
  },
};

/** Country name (as stored in location picker) → locale */
export function localeFromCountry(country: string): OnboardingLocale {
  const c = country.trim().toLowerCase();
  if (c === "france" || c.startsWith("france")) return "fr";
  if (c === "india") return "hi";
  return "en";
}

export function onboardingCopy(locale: OnboardingLocale) {
  return COPY[locale];
}
