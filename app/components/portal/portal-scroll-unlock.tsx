"use client";

import { useEffect } from "react";

const CLASS = "bb-portal-scroll";

export function PortalScrollUnlock() {
  useEffect(() => {
    document.documentElement.classList.add(CLASS);
    document.body.classList.add(CLASS);
    return () => {
      document.documentElement.classList.remove(CLASS);
      document.body.classList.remove(CLASS);
    };
  }, []);

  return null;
}
