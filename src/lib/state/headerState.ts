import { derived, writable } from 'svelte/store';

export const MAX_PULL = 180;
export const HEADER_HEIGHT = 120;
export const OPEN_THRESHOLD = 120;
export const OPEN_POSITION = 120;
export const OVERSHOOT = 16;

export const pullDistance = writable(0);
export const pullForce = writable(0);
export const isOpen = writable(false);
export const viewMode = writable<'main' | 'projects' | 'knowledge'>('main');

export const headerPullStrength = derived(pullForce, ($pullForce) =>
	Math.min(Math.max($pullForce / MAX_PULL, 0), 1)
);

export const headerActive = derived(
	[pullDistance, isOpen],
	([$pullDistance, $isOpen]) => $pullDistance > 0 || $isOpen
);
