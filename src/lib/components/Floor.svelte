<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	const geometry = new THREE.PlaneGeometry(2, 2);
	const edges = new THREE.EdgesGeometry(geometry);

	export let visible: boolean = true;
	export let opacity: number = 0.12;
	export let hovered: boolean = false;
	export let onEnter: () => void = () => {};
	export let onLeave: () => void = () => {};
</script>

<T.Mesh
	visible={visible}
	rotation={[-Math.PI / 2, 0, 0]}
	geometry={geometry}
	on:pointerenter={onEnter}
	on:pointerleave={onLeave}
>
	<T.MeshStandardMaterial color="#ffffff" transparent opacity={hovered ? opacity * 0.5 : opacity} />
</T.Mesh>

<T.LineSegments geometry={edges} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
	<T.LineBasicMaterial color="#ffffff" />
</T.LineSegments>

<T.LineSegments
	geometry={edges}
	rotation={[-Math.PI / 2, 0, 0]}
	raycast={() => null}
	on:create={({ object }) => object.computeLineDistances()}
>
	<T.LineDashedMaterial color="#ffffff" dashSize={0.2} gapSize={0.12} depthTest={false} />
</T.LineSegments>
