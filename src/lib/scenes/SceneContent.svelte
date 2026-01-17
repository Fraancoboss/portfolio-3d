<script lang="ts">
// Scene owns interaction, focus, and progress. Components are intentionally passive and emit events only.
// Scene does NOT render UI overlays; it only publishes state for UI to read.
import { T, useTask, useThrelte } from '@threlte/core';
import { onMount } from 'svelte';
import { cubicInOut, cubicOut } from 'svelte/easing';
import { tweened } from 'svelte/motion';
import type { Group } from 'three';
import * as THREE from 'three';

import BackgroundGrid from '$lib/scenes/BackgroundGrid.svelte';
import Floor from '$lib/components/Floor.svelte';
import Foundation from '$lib/components/Foundation.svelte';
import Pillar from '$lib/components/Pillar.svelte';
import Roof from '$lib/components/Roof.svelte';
import Cube from '$lib/components/Cube.svelte';
import {
	hoveredPart,
	progressStep,
	pillarStage as pillarStageStore,
	cubeFocusIndex as cubeFocusIndexStore,
	cubeHoverIndex as cubeHoverIndexStore,
	cubeHoverLock as cubeHoverLockStore,
	knowledgeHoverIndex as knowledgeHoverIndexStore
} from '$lib/state/sceneState';
import { viewMode } from '$lib/state/headerState';

	let rootGroup: Group;
	const { camera, canvas } = useThrelte();
	const raycaster = new THREE.Raycaster();
	const pointer = new THREE.Vector2();
	const cubeMeshes: Array<THREE.Mesh | null> = Array(5).fill(null);
	const knowledgeMeshes: Array<THREE.Mesh | null> = Array(5).fill(null);

	let isDragging = false;
	let lastX = 0;
	let currentY = 0;
	let targetY = 0;

let step = 0;
	let lastWheelTime = 0;
	let pillarStage = 0;

	// Security note:
	// Visual determinism is intentional. Predictable states reduce ambiguous UI behavior
	// and prevent accidental interaction paths that could desync scene state.
	// NOTE: The visual pipeline assumes discrete stages; intermediate values are intentionally not supported.
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
	const knowledgeSpacing = 1.5;
	const knowledgeY = 0.8;
	const knowledgeScale: [number, number, number] = [0.65, 0.65, 0.65];
	const knowledgeAppear = tweened(0, { duration: 420, easing: cubicOut });
	const knowledgePopMin = 0.12;
	const knowledgeHoverTween = { duration: 220, easing: cubicOut };
	const knowledgeHoverScale1 = tweened(1, knowledgeHoverTween);
	const knowledgeHoverScale2 = tweened(1, knowledgeHoverTween);
	const knowledgeHoverScale3 = tweened(1, knowledgeHoverTween);
	const knowledgeHoverScale4 = tweened(1, knowledgeHoverTween);
	const knowledgeHoverScale5 = tweened(1, knowledgeHoverTween);
	const knowledgeHoverOpacity1 = tweened(1, knowledgeHoverTween);
	const knowledgeHoverOpacity2 = tweened(1, knowledgeHoverTween);
	const knowledgeHoverOpacity3 = tweened(1, knowledgeHoverTween);
	const knowledgeHoverOpacity4 = tweened(1, knowledgeHoverTween);
	const knowledgeHoverOpacity5 = tweened(1, knowledgeHoverTween);
	// Intentionally explicit mapping.
	// This avoids premature abstraction and keeps the visual pipeline predictable.
	// Do not generalize unless the interaction model changes.
	const cubeHiddenY = 6.2;
	const cubeCenterY = 2.85;
	const cubeGap = 2.0;
	const cubeTargetX1 = -cubeGap * 2;
	const cubeTargetX2 = -cubeGap;
	const cubeTargetX3 = 0;
	const cubeTargetX4 = cubeGap;
	const cubeTargetX5 = cubeGap * 2;
	const cubeTween = { duration: 520, easing: cubicOut };
	const cubeX1 = tweened(0, cubeTween);
	const cubeX2 = tweened(0, cubeTween);
	const cubeX3 = tweened(0, cubeTween);
	const cubeX4 = tweened(0, cubeTween);
	const cubeX5 = tweened(0, cubeTween);
	const cubeY = tweened(cubeHiddenY, cubeTween);
	const cubeFocusTween = { duration: 260, easing: cubicOut };
	const cubeSmallScale = 0.6;
	const cubeLargeScale = 0.95;
	const cubeSmallOpacity = 0.06;
	const cubeLargeOpacity = 0.22;
	const cubeScale1 = tweened(cubeSmallScale, cubeFocusTween);
	const cubeScale2 = tweened(cubeSmallScale, cubeFocusTween);
	const cubeScale3 = tweened(cubeSmallScale, cubeFocusTween);
	const cubeScale4 = tweened(cubeSmallScale, cubeFocusTween);
	const cubeScale5 = tweened(cubeSmallScale, cubeFocusTween);
	const cubeOpacity1 = tweened(cubeSmallOpacity, cubeFocusTween);
	const cubeOpacity2 = tweened(cubeSmallOpacity, cubeFocusTween);
	const cubeOpacity3 = tweened(cubeSmallOpacity, cubeFocusTween);
	const cubeOpacity4 = tweened(cubeSmallOpacity, cubeFocusTween);
	const cubeOpacity5 = tweened(cubeSmallOpacity, cubeFocusTween);
	let cubeFocusIndex = 0;
	let knowledgeTriggered = false;
	let knowledgeHoverIndex: number | null = null;
	let lastKnowledgeHoverIndex: number | null = null;
	let lastHoveredIndex: number | null = null;

	const applyCubeFocus = (index: number) => {
		const scales = [cubeScale1, cubeScale2, cubeScale3, cubeScale4, cubeScale5];
		const opacities = [cubeOpacity1, cubeOpacity2, cubeOpacity3, cubeOpacity4, cubeOpacity5];
		scales.forEach((store, i) => {
			store.set(i === index ? cubeLargeScale : cubeSmallScale, cubeFocusTween);
		});
		opacities.forEach((store, i) => {
			store.set(i === index ? cubeLargeOpacity : cubeSmallOpacity, cubeFocusTween);
		});
		cubeFocusIndexStore.set(index);
	};

	const clearCubeFocus = () => {
		const scales = [cubeScale1, cubeScale2, cubeScale3, cubeScale4, cubeScale5];
		const opacities = [cubeOpacity1, cubeOpacity2, cubeOpacity3, cubeOpacity4, cubeOpacity5];
		scales.forEach((store) => {
			store.set(cubeSmallScale, cubeFocusTween);
		});
		opacities.forEach((store) => {
			store.set(cubeSmallOpacity, cubeFocusTween);
		});
	};

	const handlePointerDown = (event: PointerEvent) => {
		if (event.button !== 0) return;
		isDragging = true;
		lastX = event.clientX;
	};

	const handlePointerMove = (event: PointerEvent) => {
		if (isDragging) {
			const deltaX = event.clientX - lastX;
			lastX = event.clientX;
			targetY += deltaX * sensitivity;
		}
		updateHoverFromPointer(event);
	};

	const handlePointerUp = () => {
		isDragging = false;
		cubeHoverIndexStore.set(null);
		knowledgeHoverIndex = null;
		knowledgeHoverIndexStore.set(null);
	};

	const updateHoverFromPointer = (event: PointerEvent) => {
		// Raycasting is only meaningful in projects/knowledge; skip work in main view.
		if ($viewMode === 'main') return;
		const currentCamera = camera.current as THREE.Camera | undefined;
		if (!currentCamera || !canvas) return;
		const rect = canvas.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
		pointer.set(x, y);
		raycaster.setFromCamera(pointer, currentCamera);

		if ($viewMode === 'projects') {
			if ($cubeHoverLockStore) return;
			const targets = cubeMeshes.filter((mesh): mesh is THREE.Mesh => Boolean(mesh));
			if (!targets.length) return;
			const hits = raycaster.intersectObjects(targets, false);
			if (hits.length) {
				const hitIndex = targets.indexOf(hits[0].object as THREE.Mesh);
				cubeHoverIndexStore.set(hitIndex >= 0 ? hitIndex : null);
			} else {
				cubeHoverIndexStore.set(null);
			}
			return;
		}

		if ($viewMode === 'knowledge') {
			const targets = knowledgeMeshes.filter((mesh): mesh is THREE.Mesh => Boolean(mesh));
			if (!targets.length) return;
			const hits = raycaster.intersectObjects(targets, false);
			if (hits.length) {
				const hitIndex = targets.indexOf(hits[0].object as THREE.Mesh);
				knowledgeHoverIndex = hitIndex >= 0 ? hitIndex : null;
				knowledgeHoverIndexStore.set(knowledgeHoverIndex);
			} else {
				knowledgeHoverIndex = null;
				knowledgeHoverIndexStore.set(null);
			}
		}
	};

	const handleWheel = (event: WheelEvent) => {
		const now = performance.now();
		if (now - lastWheelTime < wheelCooldownMs) return;
		lastWheelTime = now;

		// Projects is hover-driven; scroll input is intentionally ignored here.
		if ($viewMode === 'projects') return;
		if ($viewMode === 'knowledge') {
			if (event.deltaY > 0 && !knowledgeTriggered) {
				knowledgeTriggered = true;
				knowledgeAppear.set(1);
			} else if (event.deltaY < 0 && knowledgeTriggered) {
				knowledgeTriggered = false;
				knowledgeAppear.set(0);
			}
			return;
		}

		if ($viewMode === 'projects') {
			const direction = event.deltaY > 0 ? 1 : -1;
			cubeFocusIndex = (cubeFocusIndex + direction + 5) % 5;
			applyCubeFocus(cubeFocusIndex);
		}

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

	$: if ($viewMode !== 'knowledge') {
		knowledgeTriggered = false;
		knowledgeAppear.set(0);
		knowledgeHoverIndex = null;
		knowledgeHoverIndexStore.set(null);
	}

	$: if ($viewMode === 'knowledge' && knowledgeHoverIndex !== lastKnowledgeHoverIndex) {
		lastKnowledgeHoverIndex = knowledgeHoverIndex;
		const scales = [
			knowledgeHoverScale1,
			knowledgeHoverScale2,
			knowledgeHoverScale3,
			knowledgeHoverScale4,
			knowledgeHoverScale5
		];
		const opacities = [
			knowledgeHoverOpacity1,
			knowledgeHoverOpacity2,
			knowledgeHoverOpacity3,
			knowledgeHoverOpacity4,
			knowledgeHoverOpacity5
		];
		scales.forEach((store, index) => {
			store.set(knowledgeHoverIndex === index ? 5 : 1, knowledgeHoverTween);
		});
		opacities.forEach((store, index) => {
			store.set(knowledgeHoverIndex === index ? 1.6 : 1, knowledgeHoverTween);
		});
	}

	// Projects mode is hover-driven only; no default or progressive focus exists.
	$: if ($viewMode === 'projects') {
		const projectsActive = $cubeHoverIndexStore !== null || $cubeHoverLockStore;
		if ($cubeHoverIndexStore !== null) {
			lastHoveredIndex = $cubeHoverIndexStore;
		}
		if (projectsActive) {
			const activeIndex = $cubeHoverIndexStore ?? lastHoveredIndex;
			if (activeIndex !== null) applyCubeFocus(activeIndex);
		} else {
			lastHoveredIndex = null;
			clearCubeFocus();
		}
		cubeX1.set(cubeTargetX1, { ...cubeTween, delay: 0 });
		cubeX2.set(cubeTargetX2, { ...cubeTween, delay: 120 });
		cubeX3.set(cubeTargetX3, { ...cubeTween, delay: 240 });
		cubeX4.set(cubeTargetX4, { ...cubeTween, delay: 360 });
		cubeX5.set(cubeTargetX5, { ...cubeTween, delay: 480 });
		cubeY.set(cubeCenterY, { ...cubeTween, delay: 0 });
	} else {
		cubeX1.set(0, { ...cubeTween, delay: 0 });
		cubeX2.set(0, { ...cubeTween, delay: 0 });
		cubeX3.set(0, { ...cubeTween, delay: 0 });
		cubeX4.set(0, { ...cubeTween, delay: 0 });
		cubeX5.set(0, { ...cubeTween, delay: 0 });
		cubeY.set(cubeHiddenY, { ...cubeTween, delay: 0 });
	}
</script>

<T.Color attach="background" args={['#0b1a3a']} />

<T.PerspectiveCamera makeDefault position={[0, 2.5, 6]} fov={45} />

<T.AmbientLight intensity={0.4} />
<T.DirectionalLight position={[4, 6, 3]} intensity={0.6} />

<BackgroundGrid />

{#if $viewMode !== 'knowledge' && $viewMode !== 'projects'}
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
	</T.Group>
{/if}

{#if $viewMode === 'knowledge'}
	<T.Group name="KnowledgeFoundations" position={[0, knowledgeY, 0]}>
		{#each [-2, -1, 0, 1, 2] as slot}
			{@const index = slot + 2}
			<T.Group
				position={[slot * knowledgeSpacing, 0, 0]}
				scale={[
					knowledgeScale[0] * (knowledgePopMin + $knowledgeAppear * (1 - knowledgePopMin)),
					knowledgeScale[1] *
						(knowledgePopMin + $knowledgeAppear * (1 - knowledgePopMin)) *
						(index === 0
							? $knowledgeHoverScale1
							: index === 1
								? $knowledgeHoverScale2
								: index === 2
									? $knowledgeHoverScale3
									: index === 3
										? $knowledgeHoverScale4
										: $knowledgeHoverScale5),
					knowledgeScale[2] * (knowledgePopMin + $knowledgeAppear * (1 - knowledgePopMin))
				]}
			>
				<Foundation
					bind:meshRef={knowledgeMeshes[index]}
					visible={$knowledgeAppear > 0.01}
					opacity={
						0.18 *
						$knowledgeAppear *
						(index === 0
							? $knowledgeHoverOpacity1
							: index === 1
								? $knowledgeHoverOpacity2
								: index === 2
									? $knowledgeHoverOpacity3
									: index === 3
										? $knowledgeHoverOpacity4
										: $knowledgeHoverOpacity5)
					}
				/>
			</T.Group>
		{/each}
	</T.Group>
{/if}

{#if $viewMode === 'projects'}
	<T.Group name="ProjectCubes">
		{#each [0, 1, 2, 3, 4] as i}
			<Cube
				position={[
					i === 0 ? $cubeX1 : i === 1 ? $cubeX2 : i === 2 ? $cubeX3 : i === 3 ? $cubeX4 : $cubeX5,
					$cubeY,
					0
				]}
				bind:meshRef={cubeMeshes[i]}
				glitch={i === 2 || i === 4}
				edgeColor={i === 2 || i === 4 ? '#ff3b30' : '#ffffff'}
				faceBinary={i === 2 || i === 4}
				rotationDir={
					i === 0
						? [1, 1]
						: i === 1
							? [-1, 1]
							: i === 2
								? [1, -1]
								: i === 3
									? [-1, -1]
									: [1, 1]
				}
				scale={
					i === 0
						? $cubeScale1
						: i === 1
							? $cubeScale2
							: i === 2
								? $cubeScale3
								: i === 3
										? $cubeScale4
										: $cubeScale5
				}
				opacity={
					i === 0
						? $cubeOpacity1
						: i === 1
							? $cubeOpacity2
							: i === 2
								? $cubeOpacity3
								: i === 3
										? $cubeOpacity4
										: $cubeOpacity5
				}
			/>
		{/each}
	</T.Group>
{/if}
