<script lang="ts">
	import { lastMainScrollAt, mainScrollStarted, progressStep } from '$lib/state/sceneState';
	import { ropeInteracted, viewMode } from '$lib/state/headerState';

	type HintState = 'hidden' | 'entering' | 'visible' | 'fading';
	let scrollState: HintState = 'hidden';
	let idleState: HintState = 'hidden';
	let headerState: HintState = 'hidden';
	let scrollTimer: ReturnType<typeof setTimeout> | null = null;
	let headerTimer: ReturnType<typeof setTimeout> | null = null;
	let idleCheckTimer: ReturnType<typeof setInterval> | null = null;
	let scrollHideTimer: ReturnType<typeof setTimeout> | null = null;
	let headerHideTimer: ReturnType<typeof setTimeout> | null = null;
	let idleHideTimer: ReturnType<typeof setTimeout> | null = null;
	let idleShown = false;
	let lastScrollMark = 0;

	const clearScrollTimer = () => {
		if (scrollTimer) clearTimeout(scrollTimer);
		scrollTimer = null;
	};

	const clearHeaderTimer = () => {
		if (headerTimer) clearTimeout(headerTimer);
		headerTimer = null;
	};

	const clearIdleCheckTimer = () => {
		if (idleCheckTimer) clearInterval(idleCheckTimer);
		idleCheckTimer = null;
	};

	const clearScrollHideTimer = () => {
		if (scrollHideTimer) clearTimeout(scrollHideTimer);
		scrollHideTimer = null;
	};

	const clearHeaderHideTimer = () => {
		if (headerHideTimer) clearTimeout(headerHideTimer);
		headerHideTimer = null;
	};

	const clearIdleHideTimer = () => {
		if (idleHideTimer) clearTimeout(idleHideTimer);
		idleHideTimer = null;
	};

	const fadeOutScroll = () => {
		if (scrollState === 'hidden') return;
		scrollState = 'fading';
		clearScrollHideTimer();
		scrollHideTimer = setTimeout(() => {
			scrollState = 'hidden';
			scrollHideTimer = null;
		}, 1200);
	};

	const fadeOutHeader = () => {
		if (headerState === 'hidden') return;
		headerState = 'fading';
		clearHeaderHideTimer();
		headerHideTimer = setTimeout(() => {
			headerState = 'hidden';
			headerHideTimer = null;
		}, 1200);
	};

	const fadeOutIdle = () => {
		if (idleState === 'hidden') return;
		idleState = 'fading';
		clearIdleHideTimer();
		idleHideTimer = setTimeout(() => {
			idleState = 'hidden';
			idleHideTimer = null;
		}, 1200);
	};

	$: if ($viewMode === 'main' && !$mainScrollStarted) {
		if (!scrollTimer) {
			scrollTimer = setTimeout(() => {
				scrollState = 'entering';
				setTimeout(() => {
					scrollState = 'visible';
				}, 20);
				clearScrollHideTimer();
				scrollHideTimer = setTimeout(() => fadeOutScroll(), 2600);
				scrollTimer = null;
			}, 3000);
		}
	} else {
		clearScrollTimer();
		fadeOutScroll();
	}

	$: if ($viewMode === 'main' && $mainScrollStarted && $progressStep === 0) {
		if (!idleCheckTimer) {
			idleCheckTimer = setInterval(() => {
				if (idleShown || !$lastMainScrollAt) return;
				if (Date.now() - $lastMainScrollAt >= 3000) {
					idleShown = true;
					idleState = 'entering';
					setTimeout(() => {
						idleState = 'visible';
					}, 20);
					clearIdleHideTimer();
					idleHideTimer = setTimeout(() => fadeOutIdle(), 2600);
				}
			}, 200);
		}
	} else {
		clearIdleCheckTimer();
		idleShown = false;
		fadeOutIdle();
	}

	$: if ($lastMainScrollAt && $lastMainScrollAt !== lastScrollMark) {
		lastScrollMark = $lastMainScrollAt;
		idleShown = false;
		fadeOutIdle();
	}

	$: if ($viewMode === 'main' && !$ropeInteracted) {
		if (!headerTimer) {
			headerTimer = setTimeout(() => {
				headerState = 'entering';
				setTimeout(() => {
					headerState = 'visible';
				}, 20);
				headerTimer = null;
			}, 3000);
		}
	} else {
		clearHeaderTimer();
		fadeOutHeader();
	}
</script>

{#if scrollState !== 'hidden'}
	<div
		class={`hint scroll-hint ${scrollState === 'entering' ? '' : 'is-visible'} ${scrollState === 'fading' ? 'is-fading' : ''}`}
	>
		<span class="label wave">
			<span>S</span><span>C</span><span>R</span><span>O</span><span>L</span><span>L</span>
		</span>
		<span class="arrow down" aria-hidden="true"></span>
	</div>
{/if}

{#if idleState !== 'hidden'}
	<div
		class={`hint scroll-hint idle-hint ${idleState === 'entering' ? '' : 'is-visible'} ${idleState === 'fading' ? 'is-fading' : ''}`}
	>
		<span class="label wave spaced">
			<span>C</span><span>O</span><span>N</span><span>T</span><span>I</span><span>N</span><span>U</span><span>E</span>
			<span class="gap"></span>
			<span>S</span><span>C</span><span>R</span><span>O</span><span>L</span><span>L</span><span>I</span><span>N</span><span>G</span>
		</span>
		<span class="arrow down" aria-hidden="true"></span>
	</div>
{/if}

{#if headerState !== 'hidden'}
	<div
		class={`hint header-hint ${headerState === 'entering' ? '' : 'is-visible'} ${headerState === 'fading' ? 'is-fading' : ''}`}
	>
		<span class="arrow up" aria-hidden="true"></span>
		<span class="label wave spaced">
			<span>C</span><span>L</span><span>I</span><span>C</span><span>K</span><span class="gap"></span>
			<span>A</span><span>N</span><span>D</span><span class="gap"></span>
			<span>P</span><span>U</span><span>L</span><span>L</span>
		</span>
	</div>
{/if}

<style>
	.hint {
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		z-index: 22;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		font: 18px/1 'JetBrains Mono', 'Fira Code', 'Source Code Pro', Menlo, Consolas, monospace;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--ui-text-color, #ffffff) 75%, transparent);
		pointer-events: none;
		opacity: 0;
		transform: translateX(-50%) translateY(-6px);
		transition: opacity 420ms ease, transform 420ms ease;
	}

	.scroll-hint {
		top: 18%;
	}

	.idle-hint {
		top: 18%;
	}

	.idle-hint {
		font-size: 14px;
	}

	.idle-hint .arrow {
		width: 14px;
		height: 14px;
	}

	.header-hint {
		top: 44px;
		left: auto;
		right: 0;
		transform: none;
		align-items: flex-end;
	}

	.header-hint .label.wave {
		font-size: 12px;
	}

	.header-hint .arrow {
		width: 12px;
		height: 12px;
	}

	.label {
		position: relative;
		opacity: 0.85;
		text-shadow: 0 0 12px rgba(255, 255, 255, 0.2);
	}

	.label.wave {
		display: inline-flex;
		gap: 2px;
		opacity: 0.8;
		filter: blur(0.2px);
	}

	.label.wave.spaced {
		gap: 3px;
	}

	.label.wave .gap {
		width: 8px;
	}

	.label.wave span {
		display: inline-block;
		animation: waveFloat 2.2s ease-in-out infinite;
		text-shadow:
				0 0 4px rgba(255, 255, 255, 0.18),
				0 0 8px rgba(110, 203, 255, 0.12);
	}

	.label.wave span:nth-child(1) { animation-delay: 0ms; }
	.label.wave span:nth-child(2) { animation-delay: 60ms; }
	.label.wave span:nth-child(3) { animation-delay: 120ms; }
	.label.wave span:nth-child(4) { animation-delay: 180ms; }
	.label.wave span:nth-child(5) { animation-delay: 240ms; }
	.label.wave span:nth-child(6) { animation-delay: 300ms; }
	.label.wave span:nth-child(7) { animation-delay: 360ms; }
	.label.wave span:nth-child(8) { animation-delay: 420ms; }
	.label.wave span:nth-child(9) { animation-delay: 480ms; }
	.label.wave span:nth-child(10) { animation-delay: 540ms; }
	.label.wave span:nth-child(11) { animation-delay: 600ms; }
	.label.wave span:nth-child(12) { animation-delay: 660ms; }
	.label.wave span:nth-child(13) { animation-delay: 720ms; }
	.label.wave span:nth-child(14) { animation-delay: 780ms; }

	@keyframes waveFloat {
		0% {
			transform: translateY(0) scale(0.99);
			text-shadow:
				0 0 4px rgba(255, 255, 255, 0.12),
				0 0 8px rgba(110, 203, 255, 0.08);
		}
		50% {
			transform: translateY(-2px) scale(1.02);
			text-shadow:
				0 0 6px rgba(255, 255, 255, 0.28),
				0 0 12px rgba(110, 203, 255, 0.2);
		}
		100% {
			transform: translateY(0) scale(0.99);
			text-shadow:
				0 0 4px rgba(255, 255, 255, 0.12),
				0 0 8px rgba(110, 203, 255, 0.08);
		}
	}

	.arrow {
		width: 18px;
		height: 18px;
		border-right: 1px solid color-mix(in srgb, var(--ui-line-color, #ffffff) 70%, transparent);
		border-bottom: 1px solid color-mix(in srgb, var(--ui-line-color, #ffffff) 70%, transparent);
		opacity: 0.7;
		animation: arrowPulse 0.9s ease-in-out infinite;
	}

	.arrow.down {
		--arrow-rotation: 45deg;
		transform: rotate(var(--arrow-rotation));
	}

	.arrow.up {
		--arrow-rotation: -135deg;
		transform: rotate(var(--arrow-rotation));
	}

	.hint.is-visible {
		opacity: 1;
		transform: translateX(-50%) translateY(0);
		transition: opacity 420ms ease, transform 420ms ease;
	}

	.hint.is-fading {
		opacity: 0;
		transform: translateX(-50%) translateY(6px);
		transition: opacity 1200ms ease, transform 1200ms ease;
	}

	@keyframes arrowPulse {
		0% {
			transform: translateY(0) rotate(var(--arrow-rotation));
		}
		50% {
			transform: translateY(8px) rotate(var(--arrow-rotation));
		}
		100% {
			transform: translateY(0) rotate(var(--arrow-rotation));
		}
	}
</style>
