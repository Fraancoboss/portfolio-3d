<script lang="ts">
	import {
		HEADER_HEIGHT,
		MAX_PULL,
		pullDistance,
		isOpen,
		viewMode
	} from '$lib/state/headerState';
import { ambientTokens, type AmbientVariant } from '$lib/state/sceneState';

	export let requestAmbientVariant: (variant: AmbientVariant) => void = () => {};

	const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

	// pullDistance is the single source of truth for header translation.
	$: offset = clamp($pullDistance, 0, MAX_PULL) - HEADER_HEIGHT;
	$: showNav = $isOpen;
	$: ambientSwatch = $ambientTokens.accent;

	let ambientOpen = false;
	const ambientOptions: AmbientVariant[] = ['dark-green', 'amber', 'cyan', 'violet', 'mono-white'];
	const ambientPreview: Record<AmbientVariant, string> = {
		'dark-green': '#74e6b8',
		amber: '#f7c76e',
		cyan: '#6ecbff',
		violet: '#b89cff',
		'mono-white': '#d6e3ef'
	};
	const navItems = [
		{ label: 'MAIN', href: '#main', action: 'main' },
		{ label: 'KNOWLEDGE', href: '#technologies', action: 'knowledge' },
		{ label: 'PROYECTS', href: '#proyects', action: 'projects' },
		{ label: 'BLOG', href: '#blog' },
		{ label: 'CONTACT', href: '#contact', action: 'contact' }
	] as const;
	let navTimer: ReturnType<typeof setInterval> | null = null;
	let lastOpen = false;
	let revealLink = 0;
	let revealChar = 0;
	let displayLinks = navItems.map((item) => item.label);
	let revealProgress = navItems.map(() => 0);

	const randomBit = () => (Math.random() > 0.5 ? '1' : '0');

	const buildDisplay = (label: string, revealed: number) => {
		const revealedText = label.slice(0, revealed);
		const rest = label
			.slice(revealed)
			.split('')
			.map((char) => (char === ' ' ? ' ' : randomBit()))
			.join('');
		return revealedText + rest;
	};

	const blendColor = (t: number) => {
		const start = { r: 80, g: 180, b: 255 };
		const end = { r: 255, g: 255, b: 255 };
		const r = Math.round(start.r + (end.r - start.r) * t);
		const g = Math.round(start.g + (end.g - start.g) * t);
		const b = Math.round(start.b + (end.b - start.b) * t);
		return `rgb(${r}, ${g}, ${b})`;
	};

	const startBinaryReveal = () => {
		if (navTimer) clearInterval(navTimer);
		revealLink = 0;
		revealChar = 0;
		displayLinks = navItems.map((item) => buildDisplay(item.label, 0));
		revealProgress = navItems.map(() => 0);
		navTimer = setInterval(() => {
			displayLinks = navItems.map((item, index) => {
				if (index < revealLink) return item.label;
				if (index === revealLink) return buildDisplay(item.label, revealChar);
				return buildDisplay(item.label, 0);
			});

			revealProgress = navItems.map((item, index) => {
				if (index < revealLink) return 1;
				if (index === revealLink) return Math.min(1, revealChar / item.label.length);
				return 0;
			});

			revealChar += 1;
			if (revealChar > navItems[revealLink].label.length) {
				revealLink += 1;
				revealChar = 0;
				if (revealLink >= navItems.length) {
					clearInterval(navTimer as ReturnType<typeof setInterval>);
					navTimer = null;
					displayLinks = navItems.map((item) => item.label);
				}
			}
		}, 40);
	};

	$: if ($isOpen) {
		if (!lastOpen) startBinaryReveal();
		lastOpen = true;
	} else {
		if (navTimer) clearInterval(navTimer);
		navTimer = null;
		displayLinks = navItems.map((item) => item.label);
		revealProgress = navItems.map(() => 1);
		lastOpen = false;
	}

	const handleNavClick = (event: MouseEvent, action?: 'main' | 'projects' | 'knowledge' | 'contact') => {
		if (!action) return;
		viewMode.set(action);
		isOpen.set(false);
		pullDistance.set(0);
	};
</script>

<header
	class="header"
	style={`transform: translateY(${offset}px); height: ${HEADER_HEIGHT}px; --header-accent: ${ambientSwatch};`}
>
	<div class="inner">
		<div class="ambient-control">
			<button
				class="ambient-trigger"
				aria-label="Ambient variant"
				style={`--ambient-color: ${ambientSwatch};`}
				on:click={() => (ambientOpen = !ambientOpen)}
			>
				<span class="ambient-dot"></span>
			</button>
			{#if ambientOpen}
				<div class="ambient-panel">
					{#each ambientOptions as option}
						<button
							class="ambient-option"
							aria-label={`Ambient ${option}`}
							style={`--ambient-color: ${ambientPreview[option]};`}
							on:click={() => {
								requestAmbientVariant(option);
								ambientOpen = false;
							}}
						>
							<span class="ambient-dot"></span>
						</button>
					{/each}
				</div>
			{/if}
		</div>
		{#if showNav}
			{#each navItems as item, index}
				<a
					class="link"
					href={item.href}
					style={`color: ${blendColor(revealProgress[index])}`}
					on:click={(event) => handleNavClick(event, item.action)}
				>
					{displayLinks[index]}
				</a>
			{/each}
		{/if}
	</div>
</header>

<style>
	:global(:root) {
		/* Shared base tone for header glass and legacy overlays. */
		--header-bg: #060c1a;
	}

	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 25;
		height: 120px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ffffff;
		/* Liquid glass layer: keep visuals aligned with the footer material. */
		background: rgba(255, 255, 255, 0.008);
		border-bottom: 3px solid var(--header-accent);
		pointer-events: auto;
		transition: transform 180ms ease-out;
		overflow: hidden;
		backdrop-filter: blur(10px) saturate(1.8) brightness(1.18);
		-webkit-backdrop-filter: blur(10px) saturate(1.8) brightness(1.18);
		box-shadow:
			0 16px 36px rgba(0, 0, 0, 0.28),
			inset 0 0 0 1px rgba(255, 255, 255, 0.08),
			inset 0 -10px 20px rgba(0, 0, 0, 0.18);
	}

	.header::before {
		/* Specular highlight layer to keep depth consistent with glass UI. */
		content: '';
		position: absolute;
		inset: 0;
		background:
			linear-gradient(
				180deg,
				rgba(255, 255, 255, 0.22) 0%,
				rgba(255, 255, 255, 0.08) 32%,
				rgba(255, 255, 255, 0.02) 55%,
				rgba(0, 0, 0, 0.15) 100%
			);
		mix-blend-mode: overlay;
		opacity: 0.7;
		pointer-events: none;
	}

	.header::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.35),
			inset 0 -1px 0 rgba(255, 255, 255, 0.12);
		pointer-events: none;
	}

	.inner {
		display: flex;
		align-items: center;
		gap: 96px;
		font: 16px/1 'JetBrains Mono', 'Fira Code', 'Source Code Pro', Menlo, Consolas, monospace;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		pointer-events: auto;
	}

	.ambient-control {
		position: relative;
		display: inline-flex;
		align-items: center;
	}

	.ambient-trigger,
	.ambient-option {
		width: 26px;
		height: 26px;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.25);
		background: rgba(7, 14, 30, 0.6);
		padding: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: box-shadow 80ms ease, border-color 80ms ease, transform 80ms ease;
	}

	.ambient-dot {
		width: 12px;
		height: 12px;
		border-radius: 999px;
		background: var(--ambient-color);
		box-shadow: 0 0 8px color-mix(in srgb, var(--ambient-color) 70%, transparent);
	}

	.ambient-trigger:hover,
	.ambient-option:hover {
		border-color: rgba(255, 255, 255, 0.5);
		box-shadow: 0 0 12px rgba(110, 203, 255, 0.25);
	}

	.ambient-trigger:active,
	.ambient-option:active {
		transform: scale(0.95);
	}

	.ambient-panel {
		position: absolute;
		top: 34px;
		left: 50%;
		transform: translateX(-50%);
		display: grid;
		grid-auto-flow: column;
		gap: 8px;
		padding: 6px 8px;
		border-radius: 999px;
		background: rgba(7, 14, 30, 0.7);
		border: 1px solid rgba(255, 255, 255, 0.12);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}

	.link {
		color: #ffffff;
		text-decoration: none;
		padding: 4px 6px;
		border-radius: 4px;
		pointer-events: auto;
	}

	.link:hover {
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.35);
	}

</style>
