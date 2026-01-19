<script lang="ts">
	import { onMount } from 'svelte';
	import { progressStep, stepCommand } from '$lib/state/sceneState';
	import { viewMode } from '$lib/state/headerState';

	const totalSteps = 7;
	let infoOpen = false;
	let currentStep = 1;

	const stepMap: Record<number, number> = {
		[-1]: 7,
		0: 1,
		1: 2,
		2: 3,
		3: 4,
		4: 5,
		5: 6,
		6: 7
	};

	const updateStepLabel = (value: number) => {
		const step = stepMap[value] ?? 1;
		currentStep = step;
	};

	$: if ($viewMode === 'main') {
		updateStepLabel($progressStep);
	}

	const closeInfo = () => {
		infoOpen = false;
	};

	onMount(() => {
		const handleKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') closeInfo();
		};
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	});
</script>

{#if $viewMode === 'main'}
	<div class="stepper" aria-live="polite">
		{#each Array(totalSteps) as _, index}
			{@const step = index + 1}
			<div class="stepper-item">
				<div class={`step-dot ${step <= currentStep ? 'is-active' : ''}`}>
					{step}
				</div>
				{#if step < totalSteps}
					<div class="step-line"></div>
				{/if}
			</div>
		{/each}
	</div>
	<button class="info-trigger" type="button" on:click={() => (infoOpen = true)}>(!) INFO</button>
	<div class="nav-controls">
		<button class="nav-button" type="button" on:click={() => stepCommand.set('prev')}>
			BACK
		</button>
		<button class="nav-button" type="button" on:click={() => stepCommand.set('next')}>
			NEXT
		</button>
	</div>
{/if}

{#if infoOpen}
	<div class="info-backdrop" on:click={closeInfo}>
		<div class="info-panel" role="dialog" aria-modal="true" on:click|stopPropagation>
			<div class="info-title">HOW TO NAVIGATE</div>
			<div class="info-body">
				<div>SCROLL to advance the main build sequence.</div>
				<div>DRAG the rope on the right to open the header.</div>
				<div>Use the header to jump to projects, knowledge, or contact.</div>
			</div>
			<button class="info-close" type="button" on:click={closeInfo}>CLOSE</button>
		</div>
	</div>
{/if}

<style>
	.stepper {
		position: fixed;
		bottom: 24px;
		left: 140px;
		z-index: 24;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
		font: 10px/1 'JetBrains Mono', 'Fira Code', 'Source Code Pro', Menlo, Consolas, monospace;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--ui-text-color, #ffffff) 70%, transparent);
		pointer-events: none;
	}

	.stepper-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
	}

	.step-dot {
		width: 20px;
		height: 20px;
		border-radius: 999px;
		display: grid;
		place-items: center;
		border: 1px solid color-mix(in srgb, var(--ui-line-color, #ffffff) 25%, transparent);
		background: rgba(8, 14, 28, 0.6);
		color: color-mix(in srgb, var(--ui-text-color, #ffffff) 60%, transparent);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
	}

	.step-dot.is-active {
		color: #00ff88;
		border-color: rgba(0, 255, 136, 0.65);
		box-shadow:
			0 0 12px rgba(0, 255, 136, 0.35),
			inset 0 0 0 1px rgba(255, 255, 255, 0.1);
	}

	.step-line {
		width: 18px;
		height: 2px;
		background: color-mix(in srgb, var(--ui-line-color, #ffffff) 20%, transparent);
		border-radius: 2px;
	}

	.info-trigger {
		position: fixed;
		left: 24px;
		bottom: 22px;
		z-index: 24;
		border: 1px solid color-mix(in srgb, var(--ui-line-color, #ffffff) 35%, transparent);
		border-radius: 999px;
		padding: 8px 14px;
		background: rgba(7, 14, 30, 0.6);
		color: var(--ui-text-color, #ffffff);
		font: 12px/1 'JetBrains Mono', 'Fira Code', 'Source Code Pro', Menlo, Consolas, monospace;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		cursor: pointer;
	}

	.info-trigger:hover {
		border-color: color-mix(in srgb, var(--ui-line-color, #ffffff) 60%, transparent);
		box-shadow: 0 0 12px rgba(110, 203, 255, 0.2);
	}

	.nav-controls {
		position: fixed;
		right: 24px;
		bottom: 22px;
		z-index: 24;
		display: inline-flex;
		gap: 10px;
	}

	.nav-button {
		border: 1px solid color-mix(in srgb, var(--ui-line-color, #ffffff) 35%, transparent);
		border-radius: 999px;
		padding: 8px 14px;
		background: rgba(7, 14, 30, 0.6);
		color: var(--ui-text-color, #ffffff);
		font: 12px/1 'JetBrains Mono', 'Fira Code', 'Source Code Pro', Menlo, Consolas, monospace;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		cursor: pointer;
	}

	.nav-button:hover {
		border-color: color-mix(in srgb, var(--ui-line-color, #ffffff) 60%, transparent);
		box-shadow: 0 0 12px rgba(110, 203, 255, 0.2);
	}

	.info-backdrop {
		position: fixed;
		inset: 0;
		z-index: 40;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(6, 10, 18, 0.72);
		backdrop-filter: blur(6px);
		-webkit-backdrop-filter: blur(6px);
	}

	.info-panel {
		width: min(520px, 90vw);
		border-radius: 16px;
		padding: 22px 24px;
		background: rgba(8, 14, 28, 0.92);
		border: 1px solid color-mix(in srgb, var(--ui-line-color, #ffffff) 16%, transparent);
		box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
		color: var(--ui-text-color, #ffffff);
		font: 14px/1.5 'JetBrains Mono', 'Fira Code', 'Source Code Pro', Menlo, Consolas, monospace;
		letter-spacing: 0.03em;
		text-transform: uppercase;
	}

	.info-title {
		font-size: 16px;
		letter-spacing: 0.18em;
		margin-bottom: 12px;
	}

	.info-body {
		display: grid;
		gap: 10px;
		opacity: 0.85;
	}

	.info-close {
		margin-top: 16px;
		border: 1px solid color-mix(in srgb, var(--ui-line-color, #ffffff) 35%, transparent);
		border-radius: 8px;
		padding: 8px 12px;
		background: rgba(7, 14, 30, 0.6);
		color: var(--ui-text-color, #ffffff);
		font: 12px/1 'JetBrains Mono', 'Fira Code', 'Source Code Pro', Menlo, Consolas, monospace;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		cursor: pointer;
	}

	.info-close:hover {
		border-color: color-mix(in srgb, var(--ui-line-color, #ffffff) 60%, transparent);
		box-shadow: 0 0 12px rgba(110, 203, 255, 0.2);
	}
</style>
