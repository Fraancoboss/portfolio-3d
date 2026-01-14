<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import type { Group } from 'three';

	import Floor from '$lib/components/Floor.svelte';
	import Foundation from '$lib/components/Foundation.svelte';
	import Pillar from '$lib/components/Pillar.svelte';
	import Roof from '$lib/components/Roof.svelte';
	import { hoveredPart } from '$lib/state/sceneState';

	let rootGroup: Group;

	let isDragging = false;
	let lastX = 0;
	let currentY = 0;
	let targetY = 0;

	let step = 1;
	let lastWheelTime = 0;

	const sensitivity = 0.005;
	const damping = 0.12;
	const wheelCooldownMs = 120;

	const handlePointerDown = (event: PointerEvent) => {
		if (event.button !== 0) return;
		isDragging = true;
		lastX = event.clientX;
	};

	const handlePointerMove = (event: PointerEvent) => {
		if (!isDragging) return;
		const deltaX = event.clientX - lastX;
		lastX = event.clientX;
		targetY += deltaX * sensitivity;
	};

	const handlePointerUp = () => {
		isDragging = false;
	};

	const handleWheel = (event: WheelEvent) => {
		const now = performance.now();
		if (now - lastWheelTime < wheelCooldownMs) return;
		lastWheelTime = now;

		if (event.deltaY > 0) step = Math.min(4, step + 1);
		if (event.deltaY < 0) step = Math.max(0, step - 1);
	};

	export { handleWheel };

	useTask(() => {
		if (!rootGroup) return;
		currentY += (targetY - currentY) * damping;
		rootGroup.rotation.y = currentY;
	});
</script>

<T.Color attach="background" args={['#0b1a3a']} />

<T.PerspectiveCamera makeDefault position={[0, 2.5, 6]} fov={45} />

<T.AmbientLight intensity={0.4} />
<T.DirectionalLight position={[4, 6, 3]} intensity={0.6} />

<T.Group
	name="StructureRoot"
	bind:ref={rootGroup}
	on:pointerdown={handlePointerDown}
	on:pointermove={handlePointerMove}
	on:pointerup={handlePointerUp}
	on:pointerleave={handlePointerUp}
>
	{#if step >= 1}
		<Floor
			hovered={$hoveredPart === 'floor'}
			onEnter={() => hoveredPart.set('floor')}
			onLeave={() => hoveredPart.set(null)}
		/>
	{/if}
	{#if step >= 2}
		<Foundation
			hovered={$hoveredPart === 'foundation'}
			onEnter={() => hoveredPart.set('foundation')}
			onLeave={() => hoveredPart.set(null)}
		/>
	{/if}
	{#if step >= 3}
		<Pillar
			hovered={$hoveredPart === 'pillar'}
			onEnter={() => hoveredPart.set('pillar')}
			onLeave={() => hoveredPart.set(null)}
		/>
	{/if}
	{#if step >= 4}
		<Roof
			hovered={$hoveredPart === 'roof'}
			onEnter={() => hoveredPart.set('roof')}
			onLeave={() => hoveredPart.set(null)}
		/>
	{/if}
</T.Group>
