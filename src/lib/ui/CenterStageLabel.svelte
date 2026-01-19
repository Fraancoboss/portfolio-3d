<script lang="ts">
	import { onMount } from 'svelte';
	import { progressStep } from '$lib/state/sceneState';
	import { viewMode } from '$lib/state/headerState';

	const title = 'DISTRIBUTED SYSTEMS';
	const body =
		'Con una arquitectura principal robusta,\n' +
		'se abre la puerta a diseñar\n' +
		'sistemas distribuidos y seguros\n' +
		'para seguir innovando\n' +
		'en la tecnología.';
	const arrows = '<────────>                                   <────────>';

	let typedTitle = '';
	let typedBody = '';
	let typedArrows = '';
	let titleTimer: ReturnType<typeof setInterval> | null = null;
	let bodyTimer: ReturnType<typeof setInterval> | null = null;
	let arrowsTimer: ReturnType<typeof setInterval> | null = null;
	let isMounted = false;
	let lastKey = '';

	const randomBit = () => (Math.random() > 0.5 ? '1' : '0');

	const clearTimers = () => {
		if (titleTimer) clearInterval(titleTimer);
		if (bodyTimer) clearInterval(bodyTimer);
		if (arrowsTimer) clearInterval(arrowsTimer);
		titleTimer = null;
		bodyTimer = null;
		arrowsTimer = null;
	};

	const buildArrowDisplay = (revealed: number) => {
		const revealedText = arrows.slice(0, revealed);
		const rest = arrows
			.slice(revealed)
			.split('')
			.map((char) => (char === ' ' ? ' ' : randomBit()))
			.join('');
		return revealedText + rest;
	};

	const startTyping = () => {
		clearTimers();
		typedTitle = '';
		typedBody = '';
		typedArrows = '';

		let titleIndex = 0;
		titleTimer = setInterval(() => {
			titleIndex += 1;
			typedTitle = title.slice(0, titleIndex);
			if (titleIndex >= title.length) {
				clearInterval(titleTimer as ReturnType<typeof setInterval>);
				titleTimer = null;

				let bodyIndex = 0;
				bodyTimer = setInterval(() => {
					bodyIndex += 1;
					typedBody = body.slice(0, bodyIndex);
					if (bodyIndex >= body.length) {
						clearInterval(bodyTimer as ReturnType<typeof setInterval>);
						bodyTimer = null;
					}
				}, 10);
			}
		}, 14);

		let arrowIndex = 0;
		setTimeout(() => {
			arrowsTimer = setInterval(() => {
				arrowIndex += 1;
				typedArrows = buildArrowDisplay(arrowIndex);
				if (arrowIndex >= arrows.length) {
					clearInterval(arrowsTimer as ReturnType<typeof setInterval>);
					arrowsTimer = null;
					typedArrows = arrows;
				}
			}, 12);
		}, 1220);
	};

	onMount(() => {
		isMounted = true;
		return () => {
			clearTimers();
		};
	});

	$: if ($viewMode === 'main' && $progressStep === -1 && isMounted) {
		const key = `${title}::${body}`;
		if (key !== lastKey) {
			lastKey = key;
			startTyping();
		}
	} else {
		lastKey = '';
		clearTimers();
		typedTitle = '';
		typedBody = '';
		typedArrows = '';
	}
</script>

{#if $viewMode === 'main' && $progressStep === -1}
	<div class="center-label">
		<div class="title">{typedTitle}</div>
		<div class="arrows">{typedArrows}</div>
		<div class="body">
			{typedBody}<span class="cursor" aria-hidden="true"></span>
		</div>
	</div>
{/if}

<style>
	.center-label {
		position: fixed;
		left: 50%;
		top: 22%;
		transform: translateX(-50%);
		z-index: 20;
		padding: 10px 16px;
		color: var(--ui-text-color, #ffffff);
		background: transparent;
		font: 15px/1.4 'JetBrains Mono', 'Fira Code', 'Source Code Pro', Menlo, Consolas, monospace;
		letter-spacing: 0.02em;
		pointer-events: none;
		text-align: center;
	}

	.title {
		font-size: 18px;
		text-transform: uppercase;
		letter-spacing: 0.12em;
	}

	.arrows {
		position: fixed;
		top: calc(22% + 260px);
		left: 0;
		right: 0;
		transform: translateX(-220px);
		white-space: pre;
		letter-spacing: 0.3em;
		text-align: center;
	}

	.body {
		position: absolute;
		top: 500px;
		left: 0;
		right: 0;
		white-space: pre-line;
	}

	.cursor {
		display: inline-block;
		width: 8px;
		height: 16px;
		margin-left: 2px;
		background: var(--ui-text-color, #ffffff);
		animation: blink 1s steps(2, start) infinite;
		vertical-align: -2px;
	}

	@keyframes blink {
		0%,
		49% {
			opacity: 1;
		}
		50%,
		100% {
			opacity: 0;
		}
	}
</style>
