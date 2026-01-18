<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import type { CanvasTexture, Group, MeshBasicMaterial, MeshStandardMaterial } from 'three';
	import * as THREE from 'three';

	export let label: string;
	export let position: [number, number, number];
	export let href: string | null = null;
	export let floatPhase = 0;

	let group: Group | null = null;
	let panelMaterial: MeshStandardMaterial | null = null;
	let textMaterial: MeshBasicMaterial | null = null;
	let isHover = false;
	let t = 0;
	let labelTexture: CanvasTexture | null = null;

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
		ctx.fillStyle = '#e6f2ff';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(value, canvas.width / 2, canvas.height / 2);
		return new THREE.CanvasTexture(canvas);
	};

	$: if (typeof window !== 'undefined') {
		labelTexture = buildLabelTexture(label);
		if (textMaterial && labelTexture) {
			textMaterial.map = labelTexture;
			textMaterial.needsUpdate = true;
		}
	}

	useTask((delta) => {
		if (!group) return;
		t += delta;
		group.position.y = position[1] + Math.sin(t * 1.1 + floatPhase) * 0.06;
		group.rotation.y = Math.sin(t * 0.6 + floatPhase) * 0.08;
		if (panelMaterial) {
			panelMaterial.emissiveIntensity = isHover ? 0.8 : 0.3;
		}
	});
</script>

<T.Group bind:ref={group} position={position}>
	<T.Mesh
		on:pointerenter={() => (isHover = true)}
		on:pointerleave={() => (isHover = false)}
		on:click={handleClick}
	>
		<T.BoxGeometry args={[0.7, 0.34, 0.12]} />
		<T.MeshStandardMaterial
			bind:ref={panelMaterial}
			color="#0b1428"
			emissive="#4da6ff"
			emissiveIntensity={0.3}
			roughness={0.35}
			metalness={0.2}
		/>
	</T.Mesh>
	<T.Mesh position={[0, 0, 0.085]}>
		<T.PlaneGeometry args={[0.55, 0.14]} />
		<T.MeshBasicMaterial bind:ref={textMaterial} transparent />
	</T.Mesh>
</T.Group>
