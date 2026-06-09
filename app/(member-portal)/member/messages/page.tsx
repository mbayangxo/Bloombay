import { Suspense } from "react";
import { MessagesPage } from "@/app/components/portal/messages-page";

export default function MessagesRoute() {
  return (
    <Suspense fallback={null}>
      <MessagesPage />
    </Suspense>
  );
}
