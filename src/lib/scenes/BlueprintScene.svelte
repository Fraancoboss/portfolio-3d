<script lang="ts">
	import { Canvas } from '@threlte/core';
	import SceneContent from '$lib/scenes/SceneContent.svelte';
	import HoverOverlay from '$lib/ui/HoverOverlay.svelte';

	let handleWheel: (event: WheelEvent) => void;
</script>

<div class="viewport" on:wheel|preventDefault={(event) => handleWheel?.(event)}>
	<Canvas>
		<SceneContent bind:handleWheel />
	</Canvas>
	<HoverOverlay />
</div>

<style>
	.viewport {
		width: 100vw;
		height: 100vh;
		touch-action: none;
	}
</style>
