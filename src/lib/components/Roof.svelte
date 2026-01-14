<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	const geometry = new THREE.BoxGeometry(1.4, 0.08, 1.4);
	const edges = new THREE.EdgesGeometry(geometry);

	export let visible: boolean = true;
	export let opacity: number = 0.14;
	export let hovered: boolean = false;
	export let onEnter: () => void = () => {};
	export let onLeave: () => void = () => {};
</script>

<T.Mesh
	visible={visible}
	position={[0, 2.25, 0]}
	geometry={geometry}
	on:pointerenter={onEnter}
	on:pointerleave={onLeave}
>
	<T.MeshStandardMaterial color="#ffffff" transparent opacity={hovered ? opacity * 0.5 : opacity} />
</T.Mesh>

<T.LineSegments
	geometry={edges}
	position={[0, 2.25, 0]}
	scale={[1.002, 1.002, 1.002]}
	raycast={() => null}
>
	<T.LineBasicMaterial color="#ffffff" />
</T.LineSegments>

<T.LineSegments
	geometry={edges}
	position={[0, 2.25, 0]}
	scale={[1.002, 1.002, 1.002]}
	raycast={() => null}
	on:create={({ object }) => object.computeLineDistances()}
>
	<T.LineDashedMaterial color="#ffffff" dashSize={0.2} gapSize={0.12} depthTest={false} />
</T.LineSegments>
