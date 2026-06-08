/** @deprecated Import from `@/lib/qa-routes` — kept for older imports. */
export {
  ALL_QA_ROUTES,
  QA_BRAND_CHECKLIST,
  QA_VIEWPORTS,
  MEMBER_QA_ROUTES_LEGACY as MEMBER_QA_ROUTES,
  QA_ROUTES_BY_PORTAL,
  routesForPortal,
  defaultRouteForPortal,
  type QaRoute,
  type QaViewportId,
  type QaPortalId,
} from "@/lib/qa-routes";

import { QA_ROUTES_BY_PORTAL } from "@/lib/qa-routes";

export const PUBLIC_QA_ROUTES = QA_ROUTES_BY_PORTAL.public;
