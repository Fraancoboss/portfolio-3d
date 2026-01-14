import { writable } from 'svelte/store';

export type HoveredPart = 'floor' | 'foundation' | 'pillar' | 'roof' | null;

export const hoveredPart = writable<HoveredPart>(null);
