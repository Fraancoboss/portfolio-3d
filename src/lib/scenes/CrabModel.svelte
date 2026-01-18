<script lang="ts">
	import { T, useLoader, useTask } from '@threlte/core';
	import type { Group, Material, Mesh } from 'three';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

	const { load } = useLoader(GLTFLoader, {
		extend(loader) {
			loader.setMeshoptDecoder(MeshoptDecoder);
		}
	});
	const gltf = load('/models/ferris3d_v1.0.opt.glb');

	let container: Group | null = null;
	let attached = false;
	let materialsFixed = false;
	let t = 0;

	$: if ($gltf?.scene && !materialsFixed) {
		$gltf.scene.traverse((obj) => {
			const mesh = obj as Mesh;
			if (!mesh.isMesh) return;
			const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
			materials.forEach((mat) => {
				const material = mat as Material & {
					transparent?: boolean;
					opacity?: number;
					depthWrite?: boolean;
					depthTest?: boolean;
					alphaTest?: number;
					blending?: number;
					alphaMap?: THREE.Texture | null;
					colorWrite?: boolean;
					transmission?: number;
					thickness?: number;
					needsUpdate?: boolean;
				};
				material.transparent = false;
				material.opacity = 1;
				material.depthWrite = true;
				material.depthTest = true;
				material.alphaTest = 0;
				material.blending = THREE.NormalBlending;
				material.alphaMap = null;
				material.colorWrite = true;
				material.transmission = 0;
				material.thickness = 0;
				material.needsUpdate = true;
			});
		});
		materialsFixed = true;
	}

	$: if (container && $gltf?.scene && !attached) {
		container.add($gltf.scene);
		attached = true;
	}

	useTask((delta) => {
		if (!$gltf?.scene || !container) return;
		t += delta;
		container.position.y = 1.1 + Math.sin(t * 1.2) * 0.08;
		container.rotation.y += delta * 0.4;
	});
</script>

<T.Group bind:ref={container} scale={[1.6, 1.6, 1.6]} />
