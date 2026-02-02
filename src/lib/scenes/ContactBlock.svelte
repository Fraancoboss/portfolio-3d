<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import type { CanvasTexture, Group, Mesh, MeshBasicMaterial } from 'three';
	import * as THREE from 'three';
	import Foundation from '$lib/components/Foundation.svelte';

	export let label: string;
	export let hoverText: string | null = null;
	export let position: [number, number, number];
	export let href: string | null = null;
	export let floatPhase = 0;
	export let scale = 1;
	export let hoverDirection: 1 | -1 = 1;
	export let hoverLift = 0.6;
	export let hoverDrop = 0.8;
	export let hoverStretch = 8;
	export let hovered: boolean | null = null;
	export let meshRef: Mesh | null = null;
	export let onHoverChange: (value: boolean) => void = () => {};

	let group: Group | null = null;
	let textMaterial: MeshBasicMaterial | null = null;
	let isHover = false;
	let t = 0;
	let labelTexture: CanvasTexture | null = null;
	let displayText = label;
	let typingTimer: ReturnType<typeof setInterval> | null = null;
	let typingActive = false;
	const hoverProgress = tweened(0, { duration: 220, easing: cubicOut });
	const foundationCenterY = 0.13;

	const handleClick = () => {
		if (!href || typeof window === 'undefined') return;
		window.open(href, '_blank', 'noopener');
	};

	const buildLabelTexture = (value: string) => {
		const canvas = document.createElement('canvas');
		canvas.width = 256;
		canvas.height = 64;
		const ctx = canvas.getContext('2d');
		if (!ctx) return null;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = "600 28px 'JetBrains Mono', 'Fira Code', 'Source Code Pro', Menlo, Consolas, monospace";
		const uiRoot = document.querySelector('.viewport') ?? document.documentElement;
		const uiColor =
			getComputedStyle(uiRoot).getPropertyValue('--ui-text-color')?.trim() || '#e6f2ff';
		ctx.fillStyle = uiColor;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(value, canvas.width / 2, canvas.height / 2);
		return new THREE.CanvasTexture(canvas);
	};

	const clearTyping = () => {
		if (typingTimer) clearInterval(typingTimer);
		typingTimer = null;
		typingActive = false;
	};

	const startTyping = (value: string) => {
		clearTyping();
		typingActive = true;
		displayText = '';
		let index = 0;
		typingTimer = setInterval(() => {
			index += 1;
			displayText = value.slice(0, index);
			if (index >= value.length) {
				clearTyping();
			}
		}, 22);
	};

	$: if (typeof window !== 'undefined') {
		labelTexture = buildLabelTexture(displayText);
		if (textMaterial && labelTexture) {
			textMaterial.map = labelTexture;
			textMaterial.needsUpdate = true;
		}
	}

	$: effectiveHover = hovered ?? isHover;
	$: hoverProgress.set(effectiveHover ? 1 : 0);
	$: foundationStretch = 1 + $hoverProgress * hoverStretch;
	$: hoverTargetText = hoverText ?? label;

	$: if (!effectiveHover) {
		clearTyping();
		displayText = label;
	} else if ($hoverProgress >= 0.98 && !typingActive && displayText !== hoverTargetText) {
		startTyping(hoverTargetText);
	}

	useTask((delta) => {
		if (!group) return;
		t += delta;
		const lift = $hoverProgress * hoverLift * hoverDirection;
		const drop = $hoverProgress * hoverDrop;
		group.position.y = position[1] + Math.sin(t * 1.1 + floatPhase) * 0.08 + lift - drop;
		group.rotation.y = Math.sin(t * 0.6 + floatPhase) * 0.08;
	});
</script>

<T.Group bind:ref={group} position={position} scale={[scale, scale, scale]}>
	<T.Group position={[0, foundationCenterY, 0]}>
		<T.Group scale={[1, foundationStretch, 1]}>
			<Foundation
				visible={true}
				hovered={effectiveHover}
				opacity={0.24}
			onEnter={() => {
				isHover = true;
				onHoverChange(true);
			}}
			onLeave={() => {
				isHover = false;
				onHoverChange(false);
			}}
				onClick={handleClick}
				yOffset={0}
				bind:meshRef={meshRef}
			/>
		</T.Group>
	</T.Group>
	<T.Mesh position={[0, foundationCenterY, 0.02]} raycast={() => null}>
		<T.PlaneGeometry args={[1.2, 0.24]} />
		<T.MeshBasicMaterial bind:ref={textMaterial} transparent />
	</T.Mesh>
</T.Group>
