<script lang="ts">
	import { onMount } from 'svelte';
	import { T, useTask } from '@threlte/core';
	import type { Group } from 'three';
	import * as THREE from 'three';

	const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
	const edges = new THREE.EdgesGeometry(geometry);

	export let position: [number, number, number] = [0, 4.4, 0];
	export let scale = 1;
	export let opacity = 0.18;
	export let lineOpacity = 0.7;
	export let rotationDir: [number, number] = [1, 1];
	export let edgeColor = '#ffffff';
	export let glitch = false;
	export let faceBinary = false;
	let cubeGroup: Group;
	let rotation = 0;
	let meshMaterial: THREE.MeshStandardMaterial | null = null;
	let faceCanvas: HTMLCanvasElement | null = null;
	let faceTexture: THREE.CanvasTexture | null = null;
	let faceTimer: ReturnType<typeof setInterval> | null = null;
	let glitchActive = false;
	let glitchTimer: ReturnType<typeof setTimeout> | null = null;
	let glitchResetTimer: ReturnType<typeof setTimeout> | null = null;
	let lineOpacityCurrent = lineOpacity;
	let lineColorCurrent = edgeColor;
	export let meshRef: THREE.Mesh | null = null;

	useTask(() => {
		if (!cubeGroup) return;
		rotation += 0.003;
		cubeGroup.rotation.x = rotation * 0.7 * rotationDir[0];
		cubeGroup.rotation.y = rotation * rotationDir[1];
		if (glitch) {
			const jitter = 0.02;
			cubeGroup.position.x = Math.sin(rotation * 30) * jitter;
			cubeGroup.position.y = Math.cos(rotation * 24) * jitter;
			cubeGroup.position.z = Math.sin(rotation * 18) * jitter;
			cubeGroup.rotation.z = Math.sin(rotation * 12) * 0.12;
			if (glitchActive) {
				const jump = 0.28;
				cubeGroup.position.x += (Math.random() - 0.5) * jump;
				cubeGroup.position.y += (Math.random() - 0.5) * jump;
				cubeGroup.position.z += (Math.random() - 0.5) * jump;
			}
		} else {
			cubeGroup.position.set(0, 0, 0);
			cubeGroup.rotation.z = 0;
		}

		if (glitch && glitchActive) {
			lineOpacityCurrent = 0.85 + Math.random() * 0.15;
			lineColorCurrent = '#ff8a80';
			if (meshMaterial) {
				meshMaterial.opacity = Math.min(0.6, opacity + Math.random() * 0.25);
				meshMaterial.emissive.set('#ff3b30');
				meshMaterial.emissiveIntensity = 0.6 + Math.random() * 0.4;
			}
			const scaleJitter = 1 + (Math.random() - 0.5) * 0.08;
			cubeGroup.scale.set(scaleJitter, scaleJitter, scaleJitter);
		} else {
			lineOpacityCurrent = lineOpacity;
			lineColorCurrent = edgeColor;
			if (meshMaterial) {
				meshMaterial.opacity = opacity;
				meshMaterial.emissive.set('#000000');
				meshMaterial.emissiveIntensity = 0;
			}
			cubeGroup.scale.set(1, 1, 1);
		}
	});

	const drawBinaryFace = () => {
		if (!faceCanvas || !faceTexture) return;
		const ctx = faceCanvas.getContext('2d');
		if (!ctx) return;
		const { width, height } = faceCanvas;
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = '#02040a';
		ctx.fillRect(0, 0, width, height);
		const cellWidth = 22;
		const cellHeight = 24;
		ctx.fillStyle = 'rgba(255, 96, 96, 1)';
		ctx.shadowColor = 'rgba(255, 110, 110, 0.95)';
		ctx.shadowBlur = 16;
		ctx.font = "26px 'JetBrains Mono', 'Fira Code', 'Source Code Pro', Menlo, Consolas, monospace";
		ctx.textBaseline = 'top';
		for (let y = 0; y < height; y += cellHeight) {
			for (let x = 0; x < width; x += cellWidth) {
				const bit = Math.random() > 0.5 ? '1' : '0';
				ctx.fillText(bit, x + 2, y + 1);
			}
		}
		faceTexture.needsUpdate = true;
	};

	const startBinaryFace = () => {
		if (faceTimer) clearInterval(faceTimer);
		if (!faceCanvas) {
			faceCanvas = document.createElement('canvas');
			faceCanvas.width = 512;
			faceCanvas.height = 512;
			faceTexture = new THREE.CanvasTexture(faceCanvas);
			faceTexture.minFilter = THREE.LinearFilter;
			faceTexture.magFilter = THREE.LinearFilter;
			faceTexture.colorSpace = THREE.SRGBColorSpace;
		}
		drawBinaryFace();
		faceTimer = setInterval(drawBinaryFace, 120);
	};

	const stopBinaryFace = () => {
		if (faceTimer) clearInterval(faceTimer);
		faceTimer = null;
	};

	onMount(() => {
		if (faceBinary) startBinaryFace();
		if (glitch) {
			const scheduleGlitch = () => {
				if (glitchTimer) clearTimeout(glitchTimer);
				if (glitchResetTimer) clearTimeout(glitchResetTimer);
				const delay = 900 + Math.random() * 1400;
				glitchTimer = setTimeout(() => {
					glitchActive = true;
					const duration = 120 + Math.random() * 180;
					glitchResetTimer = setTimeout(() => {
						glitchActive = false;
						scheduleGlitch();
					}, duration);
				}, delay);
			};
			scheduleGlitch();
		}
		return () => {
			stopBinaryFace();
			if (glitchTimer) clearTimeout(glitchTimer);
			if (glitchResetTimer) clearTimeout(glitchResetTimer);
		};
	});

	$: if (faceBinary) {
		startBinaryFace();
	} else {
		stopBinaryFace();
	}

	$: if (!glitch) {
		glitchActive = false;
		if (glitchTimer) clearTimeout(glitchTimer);
		if (glitchResetTimer) clearTimeout(glitchResetTimer);
		glitchTimer = null;
		glitchResetTimer = null;
	}

</script>

<T.Group position={position} scale={[scale, scale, scale]}>
	<T.Group bind:ref={cubeGroup}>
		<T.Mesh
			geometry={geometry}
			bind:ref={meshRef}
		>
			<T.MeshStandardMaterial
				bind:ref={meshMaterial}
				color="#ffffff"
				transparent
				opacity={opacity}
				depthWrite={false}
				toneMapped={false}
				map={faceBinary ? faceTexture : null}
			/>
		</T.Mesh>
		<T.LineSegments geometry={edges}>
			<T.LineBasicMaterial color={lineColorCurrent} transparent opacity={lineOpacityCurrent} />
		</T.LineSegments>
	</T.Group>
</T.Group>
