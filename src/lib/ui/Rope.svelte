<script lang="ts">
	import {
		isOpen,
		HEADER_HEIGHT,
		MAX_PULL,
		OPEN_POSITION,
		OPEN_THRESHOLD,
		OVERSHOOT,
		pullDistance,
		pullForce
	} from '$lib/state/headerState';

	let isDragging = false;
	let startY = 0;
	let startPull = 0;
	let startX = 0;
	let settleTimer: ReturnType<typeof setTimeout> | null = null;
	const handleSize = 12;
	let handleOffsetX = 0;
	const radToDeg = 180 / Math.PI;

	const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

	const handlePointerDown = (event: PointerEvent) => {
		if (event.button !== 0) return;
		if (settleTimer) {
			clearTimeout(settleTimer);
			settleTimer = null;
		}
		isDragging = true;
		startY = event.clientY;
		startPull = $pullDistance;
		startX = event.clientX;
		event.currentTarget?.setPointerCapture?.(event.pointerId);
	};

	const handlePointerMove = (event: PointerEvent) => {
		if (!isDragging) return;
		const deltaY = event.clientY - startY;
		const deltaX = event.clientX - startX;
		const nextPull = clamp(startPull + deltaY * 0.8, 0, MAX_PULL);
		pullDistance.set(nextPull);
		pullForce.set(nextPull);
		handleOffsetX = clamp(deltaX * 0.4, -24, 24);
	};

	const handlePointerUp = (event: PointerEvent) => {
		if (!isDragging) return;
		isDragging = false;
		event.currentTarget?.releasePointerCapture?.(event.pointerId);
		const shouldToggle = $pullForce >= OPEN_THRESHOLD;
		if (shouldToggle) {
			isOpen.set(!$isOpen);
		}
		const nextOpen = $isOpen;
		const target = nextOpen ? OPEN_POSITION : 0;
		pullDistance.set(target + (nextOpen ? OVERSHOOT : -OVERSHOOT));
		settleTimer = setTimeout(() => {
			pullDistance.set(target);
			settleTimer = null;
		}, 180);
		pullForce.set(0);
		handleOffsetX = 0;
	};

	$: headerOffset = clamp($pullDistance, 0, MAX_PULL) - HEADER_HEIGHT;
	$: handleY = Math.max(0, headerOffset + HEADER_HEIGHT + 18);
	$: lineHeight = Math.hypot(handleOffsetX, handleY);
	$: lineAngle = -Math.atan2(handleOffsetX, Math.max(1, handleY)) * radToDeg;
</script>

<div
	class="rope"
	role="presentation"
>
	<div
		class="line"
		style={`height: ${lineHeight}px; transform: translateX(-50%) rotate(${lineAngle}deg);`}
	></div>
	<div
		class="handle"
		style={`transform: translateX(-50%) translateY(${handleY}px) translateX(${handleOffsetX}px);`}
		on:pointerdown={handlePointerDown}
		on:pointermove={handlePointerMove}
		on:pointerup={handlePointerUp}
		on:pointerleave={handlePointerUp}
	></div>
</div>

<style>
	.rope {
		position: absolute;
		top: 0;
		right: 72px;
		width: 24px;
		height: 100%;
		z-index: 30;
		user-select: none;
		touch-action: none;
	}

	.line {
		position: absolute;
		left: 50%;
		top: 0;
		width: 3px;
		transform: translateX(-50%);
		transform-origin: top center;
		background: #c8a26a;
		transition: transform 220ms ease-out, height 220ms ease-out;
	}

	.handle {
		position: absolute;
		left: 50%;
		top: 0;
		width: 12px;
		height: 12px;
		transform: translateX(-50%);
		border: 2px solid #000000;
		border-radius: 999px;
		background: #b5b5b5;
		cursor: grab;
		transition: transform 220ms ease-out;
	}

	.handle:active {
		cursor: grabbing;
	}
</style>
