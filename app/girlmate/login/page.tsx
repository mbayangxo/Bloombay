import { Suspense } from "react";
import { GMLoginPage } from "@/app/components/girlmate/gm-login";

export const metadata = { title: "Log In — GirlMate", description: "Log in to your GirlMate account." };

export default function LoginRoute() {
  return <Suspense><GMLoginPage /></Suspense>;
}
