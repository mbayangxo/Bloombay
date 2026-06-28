// Real plan data is fetched from /api/member/plans — no mock data.

import type { PlanRoom } from "./types";

export const PLAN_ROOMS: PlanRoom[] = [];
export const BLOOMIES_LIST: { id: number; name: string; initial: string; color: string; status: string }[] = [];
export const CLUBS_LIST: { id: number; name: string; emoji: string; members: number }[] = [];
export const PLAN_TODOS: Record<number, { id: number; text: string; done: boolean }[]> = {};
export const PLAN_NOTES: Record<number, { id: number; text: string }[]> = {};
export const EVENT_DATES: Record<string, { emoji: string; name: string; time: string; color: string }[]> = {};
export const TICKET_IMAGES: Record<number, string> = {};
export const MEMORY_EVENTS: { id: number; name: string; date: string; poster: string; note: string; color: string }[] = [];
export const POLAROID_ROTS: number[] = [];
export const RETIRED_ROOMS: PlanRoom[] = [];
export const EXPIRED_ROOMS: PlanRoom[] = [];
