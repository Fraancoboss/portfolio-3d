<script lang="ts">
	import { T } from '@threlte/core';
	import CrabModel from '$lib/scenes/CrabModel.svelte';
	import ContactBlock from '$lib/scenes/ContactBlock.svelte';

	export let visible = false;
</script>

<T.Group name="ContactRoot" position={[0, 0, -2]} rotation={[0, 0, 0]} scale={[1, 1, 1]} {visible}>
	<CrabModel />
	<ContactBlock label="CORREO" position={[1.3, 0.1, 0.2]} href="mailto:fran@yourdomain.com" />
	<ContactBlock label="GITHUB" position={[-1.25, 0.35, 0.1]} href="https://github.com/yourhandle" />
	<ContactBlock label="LINKEDIN" position={[0.2, 0.95, -0.1]} href="https://linkedin.com/in/yourhandle" />
</T.Group>
