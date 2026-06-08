const POLAROID_KEY = "bb_home_polaroid_photo";
const POLAROID_CAP_KEY = "bb_home_polaroid_caption";

export function getHomePolaroidPhoto(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(POLAROID_KEY);
}

export function setHomePolaroidPhoto(url: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(POLAROID_KEY, url);
}

export function getHomePolaroidCaption(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(POLAROID_CAP_KEY);
}

export function setHomePolaroidCaption(text: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(POLAROID_CAP_KEY, text);
}
