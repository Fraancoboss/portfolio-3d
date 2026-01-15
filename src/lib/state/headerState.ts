import { writable } from 'svelte/store';

export const MAX_PULL = 180;
export const HEADER_HEIGHT = 120;
export const OPEN_THRESHOLD = 120;
export const OPEN_POSITION = 120;
export const OVERSHOOT = 16;

export const pullDistance = writable(0);
export const pullForce = writable(0);
export const isOpen = writable(false);
export const viewMode = writable<'main' | 'projects'>('main');
