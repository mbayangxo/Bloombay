/**
 * PROTOTYPE_ONLY — empty stubs for UI flows not yet wired to real APIs.
 * Plans and memories are loaded via getPlansData / /api/member/plans.
 */

import type { PlanRoom } from "./types";

/** PROTOTYPE_ONLY: unused; real plan rooms come from bloomies_plans */
export const PLAN_ROOMS: PlanRoom[] = [];

/** PROTOTYPE_ONLY: invite flow hidden when empty */
export const BLOOMIES_LIST: { id: number; name: string; initial: string; color: string; status: string }[] = [];

/** PROTOTYPE_ONLY: club post flow hidden when empty */
export const CLUBS_LIST: { id: number; name: string; emoji: string; members: number }[] = [];

/** PROTOTYPE_ONLY: plan room board uses local empty state instead */
export const PLAN_TODOS: Record<string, { id: number; text: string; done: boolean }[]> = {};

/** PROTOTYPE_ONLY: plan room board uses local empty state instead */
export const PLAN_NOTES: Record<string, { id: number; text: string }[]> = {};

/** PROTOTYPE_ONLY: day editor receives eventsToday from parent */
export const EVENT_DATES: Record<string, { emoji: string; name: string; time: string; color: string }[]> = {};

/** PROTOTYPE_ONLY: wallet uses room.poster instead */
export const TICKET_IMAGES: Record<string, string> = {};

/** PROTOTYPE_ONLY: memories come from gathering_attendance API */
export const MEMORY_EVENTS: { id: number; name: string; date: string; poster: string; note: string; color: string }[] = [];

export const POLAROID_ROTS: number[] = [];

/** PROTOTYPE_ONLY: tickets page still uses inline mock data */
export const RETIRED_ROOMS: PlanRoom[] = [];

/** PROTOTYPE_ONLY: tickets page still uses inline mock data */
export const EXPIRED_ROOMS: PlanRoom[] = [];
