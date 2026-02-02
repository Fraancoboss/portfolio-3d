<script lang="ts">
	import { onMount } from 'svelte';
	import { viewMode } from '$lib/state/headerState';

	const message = 'COMMING SOON';
	let typed = '';
	let timer: ReturnType<typeof setInterval> | null = null;
	let lastActive = false;
	let isMounted = false;

	const clearTimer = () => {
		if (timer) clearInterval(timer);
		timer = null;
	};

	const startTyping = () => {
		clearTimer();
		typed = '';
		let index = 0;
		timer = setInterval(() => {
			index += 1;
			typed = message.slice(0, index);
			if (index >= message.length) {
				clearTimer();
			}
		}, 40);
	};

	onMount(() => {
		isMounted = true;
		return () => clearTimer();
	});

	$: if (isMounted && $viewMode === 'blog' && !lastActive) {
		lastActive = true;
		startTyping();
	} else if ($viewMode !== 'blog') {
		lastActive = false;
		clearTimer();
		typed = '';
	}
</script>

{#if $viewMode === 'blog'}
	<div class="blog-overlay">
		<div class="label">BLOG</div>
		<div class="terminal">
			<span class="prompt">&gt;</span>
			<span class="typed">{typed}</span>
			<span class="cursor" aria-hidden="true"></span>
		</div>
	</div>
{/if}

<style>
	.blog-overlay {
		position: fixed;
		inset: 0;
		z-index: 22;
		display: grid;
		place-content: center;
		gap: 16px;
		color: var(--ui-text-color, #ffffff);
		font: 18px/1.4 'JetBrains Mono', 'Fira Code', 'Source Code Pro', Menlo, Consolas, monospace;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		text-align: center;
		pointer-events: none;
	}

	.label {
		font-size: 14px;
		opacity: 0.7;
		letter-spacing: 0.32em;
	}

	.terminal {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 14px 22px;
		border: 1px solid color-mix(in srgb, var(--ui-line-color, #ffffff) 65%, transparent);
		background: rgba(7, 14, 30, 0.7);
		box-shadow: 0 18px 38px rgba(0, 0, 0, 0.35);
	}

	.prompt {
		color: color-mix(in srgb, var(--ui-text-color, #ffffff) 60%, transparent);
	}

	.cursor {
		display: inline-block;
		width: 0.6em;
		height: 1em;
		background: var(--ui-text-color, #ffffff);
		animation: blink 1s steps(1) infinite;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
