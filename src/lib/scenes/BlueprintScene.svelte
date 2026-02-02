<script lang="ts">
	import { Canvas } from '@threlte/core';
	import SceneContent from '$lib/scenes/SceneContent.svelte';
	import HoverOverlay from '$lib/ui/HoverOverlay.svelte';
	import StageOverlay from '$lib/ui/StageOverlay.svelte';
	import CenterStageLabel from '$lib/ui/CenterStageLabel.svelte';
	import ProjectTextOverlay from '$lib/ui/ProjectTextOverlay.svelte';
	import KnowledgeTextOverlay from '$lib/ui/KnowledgeTextOverlay.svelte';
	import BlogOverlay from '$lib/ui/BlogOverlay.svelte';
	import ScrollHints from '$lib/ui/ScrollHints.svelte';
	import PortfolioGuide from '$lib/ui/PortfolioGuide.svelte';
	import Header from '$lib/ui/Header.svelte';
	import Rope from '$lib/ui/Rope.svelte';
	import MatrixRain from '$lib/ui/MatrixRain.svelte';
	import { viewMode } from '$lib/state/headerState';
	import { ambientTokens, type AmbientVariant } from '$lib/state/sceneState';

	let handleWheel: (event: WheelEvent) => void;
	let handlePointerDown: (event: PointerEvent) => void;
	let handlePointerMove: (event: PointerEvent) => void;
	let handlePointerUp: () => void;
	let requestAmbientVariant: (variant: AmbientVariant) => void;
</script>

<div
	class="viewport"
	style={`--ui-text-color: ${$ambientTokens.uiText}; --ui-line-color: ${$ambientTokens.uiLine};`}
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
			bind:requestAmbientVariant
		/>
	</Canvas>
	<Header {requestAmbientVariant} />
	<ScrollHints />
	<PortfolioGuide />
	<Rope />
	<div
		class="main-layer"
		class:projects={$viewMode === 'projects'}
		class:knowledge={$viewMode === 'knowledge'}
		class:blog={$viewMode === 'blog'}
	>
		<HoverOverlay />
		<StageOverlay />
		<CenterStageLabel />
	</div>
	<ProjectTextOverlay />
	<KnowledgeTextOverlay />
	<BlogOverlay />
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
		pointer-events: none;
	}

	.main-layer.projects {
		transform: translateY(120vh);
		opacity: 0;
	}

	.main-layer.knowledge {
		opacity: 0;
	}

	.main-layer.blog {
		opacity: 0;
	}
</style>
