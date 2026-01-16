<script lang="ts">
	import { Canvas } from '@threlte/core';
	import SceneContent from '$lib/scenes/SceneContent.svelte';
	import HoverOverlay from '$lib/ui/HoverOverlay.svelte';
	import StageOverlay from '$lib/ui/StageOverlay.svelte';
	import Header from '$lib/ui/Header.svelte';
	import Rope from '$lib/ui/Rope.svelte';
	import MatrixRain from '$lib/ui/MatrixRain.svelte';
	import { viewMode } from '$lib/state/headerState';

	let handleWheel: (event: WheelEvent) => void;
	let handlePointerDown: (event: PointerEvent) => void;
	let handlePointerMove: (event: PointerEvent) => void;
	let handlePointerUp: () => void;
</script>

<div
	class="viewport"
	on:wheel|preventDefault={(event) => handleWheel?.(event)}
	on:pointerdown={(event) => handlePointerDown?.(event)}
	on:pointermove={(event) => handlePointerMove?.(event)}
	on:pointerup={() => handlePointerUp?.()}
	on:pointerleave={() => handlePointerUp?.()}
>
	<MatrixRain />
	<Canvas>
		<SceneContent
			bind:handleWheel
			bind:handlePointerDown
			bind:handlePointerMove
			bind:handlePointerUp
		/>
	</Canvas>
	<Header />
	<Rope />
	<div class="main-layer" class:projects={$viewMode === 'projects'}>
		<HoverOverlay />
		<StageOverlay />
	</div>
</div>

<style>
	.viewport {
		position: relative;
		width: 100vw;
		height: 100vh;
		touch-action: none;
	}

	.viewport :global(canvas) {
		position: relative;
		inset: 0;
		z-index: 1;
	}

	.main-layer {
		position: absolute;
		inset: 0;
		z-index: 10;
		transition: transform 650ms ease-in-out, opacity 650ms ease-in-out;
	}

	.main-layer.projects {
		transform: translateY(60vh);
		opacity: 0;
	}
</style>
