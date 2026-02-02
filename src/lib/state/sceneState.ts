// State boundary:
// This module defines global, shared state.
// UI layers must treat these stores as read-only signals.
// All mutations originate from the scene layer only.
import { writable } from 'svelte/store';

export type HoveredPart = 'floor' | 'foundation' | 'pillar' | 'roof' | null;
export type AmbientVariant =
	| 'hackgreen'
	| 'blueprint'
	| 'infrared'
	| 'ultraviolet'
	| 'cleanblack';
export type AmbientTokens = {
	backgroundColor: string;
	gridColor: string;
	matrixBase: string;
	matrixHead: string;
	accent: string;
	uiText: string;
	uiLine: string;
};

export const hoveredPart = writable<HoveredPart>(null);
// Security note: progressStep is discrete by design to keep states auditable and deterministic.
export const progressStep = writable(0);
export const pillarStage = writable(0);
export const cubeFocusIndex = writable(0);
export const cubeHoverIndex = writable<number | null>(null);
export const cubeHoverLock = writable(false);
export const knowledgeHoverIndex = writable<number | null>(null);
export const mainScrollStarted = writable(false);
export const lastMainScrollAt = writable(0);
export const stepCommand = writable<'next' | 'prev' | null>(null);

// Scene-owned ambient state; UI reads only. Colors are resolved by the scene layer.
export const ambientVariant = writable<AmbientVariant>('blueprint');
export const ambientTokens = writable<AmbientTokens>({
	backgroundColor: '#0b1a3a',
	gridColor: '#4da6ff',
	matrixBase: '#6fb6ff',
	matrixHead: '#a8d9ff',
	accent: '#6ecbff',
	uiText: '#ffffff',
	uiLine: '#ffffff'
});
