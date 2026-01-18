<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	export let lineColor = '#4da6ff';
	export let lineOpacity = 0.095;

	const size = 60;
	const divisions = 60;
	const step = size / divisions;

	const positions: number[] = [];

	for (let i = -size / 2; i <= size / 2; i += step) {
		positions.push(-size / 2, 0, i, size / 2, 0, i);
		positions.push(i, 0, -size / 2, i, 0, size / 2);
	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
</script>

<T.LineSegments geometry={geometry} position={[0, -0.05, 0]} renderOrder={-10}>
	<T.LineBasicMaterial
		color={lineColor}
		transparent
		opacity={lineOpacity}
		depthWrite={false}
		depthTest={false}
	/>
</T.LineSegments>
