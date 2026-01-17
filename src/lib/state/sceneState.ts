// State boundary:
// This module defines global, shared state.
// UI layers must treat these stores as read-only signals.
// All mutations originate from the scene layer only.
import { writable } from 'svelte/store';

export type HoveredPart = 'floor' | 'foundation' | 'pillar' | 'roof' | null;

export const hoveredPart = writable<HoveredPart>(null);
// Security note: progressStep is discrete by design to keep states auditable and deterministic.
export const progressStep = writable(0);
export const pillarStage = writable(0);
export const cubeFocusIndex = writable(0);
export const cubeHoverIndex = writable<number | null>(null);
export const cubeHoverLock = writable(false);
export const knowledgeHoverIndex = writable<number | null>(null);
