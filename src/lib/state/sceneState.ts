import { writable } from 'svelte/store';

export type HoveredPart = 'floor' | 'foundation' | 'pillar' | 'roof' | null;

export const hoveredPart = writable<HoveredPart>(null);
export const progressStep = writable(0);
export const pillarStage = writable(0);
export const cubeFocusIndex = writable(0);
export const cubeHoverIndex = writable<number | null>(null);
export const cubeHoverLock = writable(false);
export const knowledgeHoverIndex = writable<number | null>(null);
