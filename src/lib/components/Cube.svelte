<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import type { Group } from 'three';
	import * as THREE from 'three';

	const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
	const edges = new THREE.EdgesGeometry(geometry);

	let cubeGroup: Group;
	let rotation = 0;

	useTask(() => {
		if (!cubeGroup) return;
		rotation += 0.003;
		cubeGroup.rotation.x = rotation * 0.7;
		cubeGroup.rotation.y = rotation;
	});
</script>

<T.Group bind:ref={cubeGroup} position={[0, 4.4, 0]}>
	<T.Mesh geometry={geometry}>
		<T.MeshStandardMaterial
			color="#ffffff"
			transparent
			opacity={0.18}
			depthWrite={false}
			toneMapped={false}
		/>
	</T.Mesh>
	<T.LineSegments geometry={edges}>
		<T.LineBasicMaterial color="#ffffff" />
	</T.LineSegments>
</T.Group>
