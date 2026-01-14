<script lang="ts">
	import BlueprintScene from '$lib/scenes/BlueprintScene.svelte';
</script>

<main class="viewport">
	<BlueprintScene />
</main>

<style>
	:global(body) {
		margin: 0;
	}

	.viewport {
		width: 100vw;
		height: 100vh;
	}
</style>
