<script lang="ts">
	import { T } from '@threlte/core';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import * as THREE from 'three';

	const geometry = new THREE.BoxGeometry(1.6, 0.18, 1.6);
	const edges = new THREE.EdgesGeometry(geometry);

	export let visible: boolean = true;
	export let opacity: number = 0.18;
	export let hovered: boolean = false;
	export let onEnter: () => void = () => {};
	export let onLeave: () => void = () => {};

	const fade = tweened(0, { duration: 250, easing: cubicOut });

	$: fade.set(visible ? 1 : 0);
	$: faceColor = hovered ? '#00ff88' : '#ffffff';
	$: lineColor = hovered ? '#00ff88' : '#ffffff';
	$: baseFaceOpacity = hovered ? Math.max(opacity * 0.5, 0.1) : opacity;
	$: faceOpacity = baseFaceOpacity * $fade;
	$: lineOpacity = $fade;
</script>

<T.Mesh
	visible={$fade > 0.01}
	position={[0, 0.13, 0]}
	geometry={geometry}
	on:pointerenter={onEnter}
	on:pointerleave={onLeave}
>
	<T.MeshStandardMaterial
		color={faceColor}
		opacity={faceOpacity}
		transparent={true}
		depthWrite={false}
		depthTest={true}
		toneMapped={false}
	/>
</T.Mesh>

<T.LineSegments
	geometry={edges}
	position={[0, 0.13, 0]}
	scale={[1.002, 1.002, 1.002]}
	raycast={() => null}
	visible={$fade > 0.01}
>
	<T.LineBasicMaterial color={lineColor} linewidth={1.5} transparent opacity={lineOpacity} />
</T.LineSegments>

<T.LineSegments
	geometry={edges}
	position={[0, 0.13, 0]}
	scale={[1.002, 1.002, 1.002]}
	raycast={() => null}
	visible={$fade > 0.01}
	on:create={({ object }) => object.computeLineDistances()}
>
	<T.LineDashedMaterial
		color={lineColor}
		dashSize={0.2}
		gapSize={0.12}
		depthTest={false}
		linewidth={1.5}
		transparent
		opacity={lineOpacity}
	/>
</T.LineSegments>
