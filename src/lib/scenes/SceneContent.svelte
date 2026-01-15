<script lang="ts">
import { T, useTask } from '@threlte/core';
import { onMount } from 'svelte';
import { cubicInOut, cubicOut } from 'svelte/easing';
import { tweened } from 'svelte/motion';
import type { Group } from 'three';

	import Floor from '$lib/components/Floor.svelte';
import Foundation from '$lib/components/Foundation.svelte';
import Pillar from '$lib/components/Pillar.svelte';
import Roof from '$lib/components/Roof.svelte';
import Cube from '$lib/components/Cube.svelte';
import { hoveredPart, progressStep, pillarStage as pillarStageStore } from '$lib/state/sceneState';
import { viewMode } from '$lib/state/headerState';

	let rootGroup: Group;

	let isDragging = false;
	let lastX = 0;
	let currentY = 0;
	let targetY = 0;

let step = 0;
	let lastWheelTime = 0;
	let pillarStage = 0;

	const sensitivity = 0.005;
	const damping = 0.12;
	const idleRotationSpeed = 0.002;
	const wheelCooldownMs = 120;
	const pillarHiddenY = 0.2;
	const pillarVisibleY = -0.25;
	const pillarTween = { duration: 300, easing: cubicOut };
	const foundationHiddenY = 0.4;
	const foundationVisibleY = 0;
	const roofHiddenX = 1.6;
	const roofVisibleX = 0;
	const structureHiddenX = 0;
	const structureVisibleX = 2.5;
const stageTween = { duration: 350, easing: cubicOut };
const structureTween = { duration: 700, easing: cubicOut, delay: 350 };
const sceneTween = { duration: 650, easing: cubicInOut };

	const pillarY1 = tweened(pillarHiddenY, pillarTween);
	const pillarY2 = tweened(pillarHiddenY, pillarTween);
	const pillarY3 = tweened(pillarHiddenY, pillarTween);
	const pillarY4 = tweened(pillarHiddenY, pillarTween);
const foundationY = tweened(foundationHiddenY, stageTween);
const roofX = tweened(roofHiddenX, stageTween);
	const structureX = tweened(structureHiddenX, stageTween);
	const sceneYOffset = tweened(0, sceneTween);
	let cubeVisible = false;
	let cubeTimer: ReturnType<typeof setTimeout> | null = null;

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

		if (event.deltaY > 0) {
			if (step < 3) {
				step = Math.min(3, step + 1);
				progressStep.set(step <= 2 ? step - 1 : 2);
				if (step < 3) {
					pillarStage = 0;
					pillarStageStore.set(pillarStage);
				} else {
					pillarStage = 1;
					pillarStageStore.set(pillarStage);
				}
				return;
			}
			if (step === 3 && pillarStage < 4) {
				pillarStage += 1;
				pillarStageStore.set(pillarStage);
				return;
			}
			step = 4;
			progressStep.set(3);
			pillarStage = 4;
			pillarStageStore.set(pillarStage);
		}
		if (event.deltaY < 0) {
			if (step > 3) {
				step = 3;
				progressStep.set(2);
				pillarStage = 4;
				pillarStageStore.set(pillarStage);
				return;
			}
			if (step === 3 && pillarStage > 0) {
				pillarStage -= 1;
				pillarStageStore.set(pillarStage);
				return;
			}
			step = Math.max(0, step - 1);
			progressStep.set(step <= 2 ? Math.max(0, step - 1) : 2);
			if (step < 3) {
				pillarStage = 0;
				pillarStageStore.set(pillarStage);
			}
		}
	};

onMount(() => {
	progressStep.set(step <= 2 ? step - 1 : step === 3 ? 2 : 3);
});

	export { handleWheel, handlePointerDown, handlePointerMove, handlePointerUp };

	useTask(() => {
		if (!rootGroup) return;
		if (!isDragging) {
			targetY += idleRotationSpeed;
		}
		currentY += (targetY - currentY) * damping;
		rootGroup.rotation.y = currentY;
	});

	$: pillarY1.set(step >= 3 && pillarStage >= 1 ? pillarVisibleY : pillarHiddenY);
	$: pillarY2.set(step >= 3 && pillarStage >= 2 ? pillarVisibleY : pillarHiddenY);
	$: pillarY3.set(step >= 3 && pillarStage >= 3 ? pillarVisibleY : pillarHiddenY);
	$: pillarY4.set(step >= 3 && pillarStage >= 4 ? pillarVisibleY : pillarHiddenY);
	$: foundationY.set(step >= 2 ? foundationVisibleY : foundationHiddenY);
	$: roofX.set(step >= 4 ? roofVisibleX : roofHiddenX);
	$: structureX.set(step >= 4 ? structureVisibleX : structureHiddenX, structureTween);
	$: sceneYOffset.set($viewMode === 'projects' ? -2.5 : 0);

	$: if ($viewMode === 'projects') {
		if (!cubeVisible && !cubeTimer) {
			cubeTimer = setTimeout(() => {
				cubeVisible = true;
				cubeTimer = null;
			}, 650);
		}
	} else {
		if (cubeTimer) clearTimeout(cubeTimer);
		cubeTimer = null;
		cubeVisible = false;
	}
</script>

<T.Color attach="background" args={['#0b1a3a']} />

<T.PerspectiveCamera makeDefault position={[0, 2.5, 6]} fov={45} />

<T.AmbientLight intensity={0.4} />
<T.DirectionalLight position={[4, 6, 3]} intensity={0.6} />

<T.Group
	name="StructureRoot"
	bind:ref={rootGroup}
	scale={[0.9, 0.9, 0.9]}
	position={[$structureX, 0.8 + $sceneYOffset, 0]}
>
	<Floor
		visible={step >= 1}
		hovered={$hoveredPart === 'floor'}
		onEnter={() => hoveredPart.set('floor')}
		onLeave={() => hoveredPart.set(null)}
	/>
	<T.Group position={[0, $foundationY, 0]}>
		<Foundation
			visible={step >= 2}
			hovered={$hoveredPart === 'foundation'}
			onEnter={() => hoveredPart.set('foundation')}
			onLeave={() => hoveredPart.set(null)}
		/>
	</T.Group>
	<T.Group position={[-0.6, $pillarY1, -0.6]}>
		<Pillar
			visible={step >= 3 && pillarStage >= 1}
			hovered={$hoveredPart === 'pillar'}
			onEnter={() => hoveredPart.set('pillar')}
			onLeave={() => hoveredPart.set(null)}
		/>
	</T.Group>
	<T.Group position={[0.6, $pillarY2, -0.6]}>
		<Pillar
			visible={step >= 3 && pillarStage >= 2}
			hovered={$hoveredPart === 'pillar'}
			onEnter={() => hoveredPart.set('pillar')}
			onLeave={() => hoveredPart.set(null)}
		/>
	</T.Group>
	<T.Group position={[-0.6, $pillarY3, 0.6]}>
		<Pillar
			visible={step >= 3 && pillarStage >= 3}
			hovered={$hoveredPart === 'pillar'}
			onEnter={() => hoveredPart.set('pillar')}
			onLeave={() => hoveredPart.set(null)}
		/>
	</T.Group>
	<T.Group position={[0.6, $pillarY4, 0.6]}>
		<Pillar
			visible={step >= 3 && pillarStage >= 4}
			hovered={$hoveredPart === 'pillar'}
			onEnter={() => hoveredPart.set('pillar')}
			onLeave={() => hoveredPart.set(null)}
		/>
	</T.Group>
	<T.Group position={[$roofX, 0, 0]}>
		<Roof
			visible={step >= 4}
			hovered={$hoveredPart === 'roof'}
			onEnter={() => hoveredPart.set('roof')}
			onLeave={() => hoveredPart.set(null)}
		/>
	</T.Group>
	{#if cubeVisible}
		<Cube />
	{/if}
</T.Group>
