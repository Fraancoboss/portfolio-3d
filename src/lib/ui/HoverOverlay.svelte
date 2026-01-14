<script lang="ts">
	import { hoveredPart } from '$lib/state/sceneState';

	const labels = {
		floor: {
			name: 'Floor',
			role: 'Base plane',
			tech: 'Reference datum for layout and alignment'
		},
		foundation: {
			name: 'Foundation',
			role: 'Structural footing',
			tech: 'Low volume defining the base load zone'
		},
		pillar: {
			name: 'Pillar',
			role: 'Vertical support',
			tech: 'Load-bearing element in the vertical axis'
		},
		roof: {
			name: 'Roof',
			role: 'Top plate',
			tech: 'Upper boundary that caps the structure'
		}
	} as const;
</script>

{#if $hoveredPart}
	<div class="overlay">
		<div class="title">{labels[$hoveredPart].name}</div>
		<div class="meta">{labels[$hoveredPart].role}</div>
		<div class="tech">{labels[$hoveredPart].tech}</div>
	</div>
{/if}

<style>
	.overlay {
		position: absolute;
		top: 24px;
		left: 24px;
		padding: 12px 14px;
		border: 1px solid rgba(255, 255, 255, 0.25);
		color: #ffffff;
		background: rgba(7, 14, 30, 0.7);
		font: 12px/1.4 'IBM Plex Mono', monospace;
		letter-spacing: 0.02em;
		max-width: 260px;
	}

	.title {
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: 6px;
	}

	.meta {
		font-size: 12px;
		margin-bottom: 4px;
	}

	.tech {
		font-size: 11px;
		opacity: 0.8;
	}
</style>
