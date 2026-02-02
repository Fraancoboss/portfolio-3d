<script lang="ts">
	import { T } from '@threlte/core';
	import type { Mesh } from 'three';
	import CrabModel from '$lib/scenes/CrabModel.svelte';
	import ContactBlock from '$lib/scenes/ContactBlock.svelte';

	export let visible = false;
	export let hoverIndex: number | null = null;
	export let contactMeshes: Array<Mesh | null> = [];
	export let contactLinks: Array<string | null> = [];
	let mesh0: Mesh | null = null;
	let mesh1: Mesh | null = null;
	let mesh2: Mesh | null = null;
	let localHoverIndex: number | null = null;

	$: contactMeshes[0] = mesh0;
	$: contactMeshes[1] = mesh1;
	$: contactMeshes[2] = mesh2;
	const links = [
		'mailto:fraancoboss@gmail.com',
		'https://github.com/Fraancoboss',
		'https://www.linkedin.com/in/fran-cobos-rodriguez'
	];
	$: contactLinks = links;

	const baseY = 1.6;
	const baseX = [-2.9, 0, 2.9] as const;
	const spreadOffset = 1.2;
	$: activeHover = hoverIndex ?? localHoverIndex;
	const getX = (index: 0 | 1 | 2) => {
		if (activeHover === 0) return baseX[index] + (index === 0 ? 0 : spreadOffset);
		if (activeHover === 1)
			return baseX[index] + (index === 0 ? -spreadOffset : index === 2 ? spreadOffset : 0);
		if (activeHover === 2) return baseX[index] - (index === 2 ? 0 : spreadOffset);
		return baseX[index];
	};

	const handleHover = (index: 0 | 1 | 2, value: boolean) => {
		if (value) {
			localHoverIndex = index;
			return;
		}
		if (localHoverIndex === index) {
			localHoverIndex = null;
		}
	};
</script>

<T.Group name="ContactRoot" position={[0, 0, -2]} rotation={[0, 0, 0]} scale={[1, 1, 1]} {visible}>
	<ContactBlock
		label="GMAIL"
		hoverText="[link]"
		position={[getX(0), baseY, 0.1]}
		scale={1.3}
		hoverDirection={1}
		hoverLift={0}
		hoverDrop={0}
		floatPhase={0.2}
		hovered={hoverIndex === 0}
		bind:meshRef={mesh0}
		onHoverChange={(value) => handleHover(0, value)}
		href={links[0]}
	/>
	<ContactBlock
		label="GITHUB"
		hoverText="[link]"
		position={[getX(1), baseY, 0.1]}
		scale={1.3}
		hoverDirection={-1}
		hoverLift={0}
		hoverDrop={0}
		floatPhase={1.1}
		hovered={hoverIndex === 1}
		bind:meshRef={mesh1}
		onHoverChange={(value) => handleHover(1, value)}
		href={links[1]}
	/>
	<ContactBlock
		label="LINKEDIN"
		hoverText="[link]"
		position={[getX(2), baseY, 0.1]}
		scale={1.3}
		hoverDirection={-1}
		hoverLift={0}
		hoverDrop={0}
		floatPhase={2.3}
		hovered={hoverIndex === 2}
		bind:meshRef={mesh2}
		onHoverChange={(value) => handleHover(2, value)}
		href={links[2]}
	/>
</T.Group>
