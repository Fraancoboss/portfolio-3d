<script lang="ts">
	import {
		HEADER_HEIGHT,
		MAX_PULL,
		pullDistance,
		isOpen,
		viewMode
	} from '$lib/state/headerState';
	import { ambientTokens, ambientVariant, type AmbientVariant } from '$lib/state/sceneState';

	export let requestAmbientVariant: (variant: AmbientVariant) => void = () => {};

	const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

	// pullDistance is the single source of truth for header translation.
	$: offset = clamp($pullDistance, 0, MAX_PULL) - HEADER_HEIGHT;
	$: showNav = $isOpen;
	$: ambientSwatch = $ambientTokens.accent;

	let ambientOpen = false;
	const ambientOptions = [
		{ variant: 'hackgreen', label: 'Hackgreen', detail: 'green + black' },
		{ variant: 'blueprint', label: 'Blueprint', detail: 'default blue' },
		{ variant: 'infrared', label: 'Infrared', detail: 'red spectrum' },
		{ variant: 'ultraviolet', label: 'Ultraviolet', detail: 'violet spectrum' },
		{ variant: 'cleanblack', label: 'Cleanblack', detail: 'mono black/white' },
		{ variant: 'nukewhite', label: 'Nukewhite', detail: 'white + black' }
	] as const satisfies Array<{
		variant: AmbientVariant;
		label: string;
		detail: string;
	}>;
	const ambientPreview: Record<AmbientVariant, string> = {
		hackgreen: '#3be294',
		blueprint: '#6ecbff',
		infrared: '#ff5a5a',
		ultraviolet: '#b89cff',
		cleanblack: '#e6e6e6',
		nukewhite: '#0b0b0b'
	};
	$: activeTheme =
		ambientOptions.find((option) => option.variant === $ambientVariant) ?? ambientOptions[1];
	const navItems = [
		{ label: 'MAIN', href: '#main', action: 'main' },
		{ label: 'KNOWLEDGE', href: '#technologies', action: 'knowledge' },
		{ label: 'PROYECTS', href: '#proyects', action: 'projects' },
		{ label: 'BLOG', href: '#blog' },
		{ label: 'CONTACT', href: '#contact', action: 'contact' }
	] as const;
	let navTimer: ReturnType<typeof setInterval> | null = null;
	let themeTimer: ReturnType<typeof setTimeout> | null = null;
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

	$: revealDone = showNav && revealProgress.every((value) => value >= 1);
	$: if (revealDone) {
		if (!themeTimer) {
			themeTimer = setTimeout(() => {
				themeVisible = true;
				themeTimer = null;
			}, 120);
		}
	} else {
		if (themeTimer) clearTimeout(themeTimer);
		themeTimer = null;
		themeVisible = false;
	}

	let themeVisible = false;

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
		<div class={`ambient-control ${themeVisible ? 'is-visible' : ''}`}>
			<button
				class="ambient-trigger"
				aria-label="Theme selector"
				style={`--ambient-color: ${ambientSwatch};`}
				on:click={() => (ambientOpen = !ambientOpen)}
			>
				<span class="ambient-dot"></span>
				<span class="ambient-label">{activeTheme.label}</span>
				<span class="ambient-caret">v</span>
			</button>
			{#if ambientOpen}
				<div class="ambient-panel">
					{#each ambientOptions as option}
						<button
							class="ambient-option"
							aria-label={`Theme ${option.label}`}
							data-active={$ambientVariant === option.variant}
							style={`--ambient-color: ${ambientPreview[option.variant]};`}
							on:click={() => {
								requestAmbientVariant(option.variant);
								ambientOpen = false;
							}}
						>
							<span class="ambient-dot"></span>
							<span class="ambient-text">
								<span class="ambient-name">{option.label}</span>
								<span class="ambient-detail">{option.detail}</span>
							</span>
						</button>
					{/each}
				</div>
			{/if}
		</div>
		{#if showNav}
			{#each navItems as item, index}
				<a
					class={`link ${item.action === $viewMode ? 'is-active' : ''}`}
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
		color: var(--ui-text-color, #ffffff);
		/* Liquid glass layer: keep visuals aligned with the footer material. */
		background: rgba(255, 255, 255, 0.008);
		border-bottom: 3px solid var(--header-accent);
		pointer-events: auto;
		transition: transform 180ms ease-out;
		overflow: visible;
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
		z-index: 2;
		display: inline-flex;
		align-items: center;
		opacity: 0;
		transform: translateY(-6px);
		pointer-events: none;
		transition: opacity 220ms ease, transform 220ms ease;
	}

	.ambient-control.is-visible {
		opacity: 1;
		transform: translateY(0);
		pointer-events: auto;
	}

	.ambient-trigger,
	.ambient-option {
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

	.ambient-trigger {
		gap: 10px;
		padding: 6px 14px 6px 8px;
		height: 32px;
		border-radius: 999px;
		background: linear-gradient(
				120deg,
				color-mix(in srgb, var(--ambient-color) 22%, rgba(6, 14, 30, 0.8)) 0%,
				rgba(6, 14, 30, 0.7) 60%
			),
			rgba(6, 14, 30, 0.6);
		box-shadow: 0 0 16px rgba(0, 0, 0, 0.35);
	}

	.ambient-dot {
		width: 12px;
		height: 12px;
		border-radius: 999px;
		background: var(--ambient-color);
		box-shadow: 0 0 8px color-mix(in srgb, var(--ambient-color) 70%, transparent);
	}

	.ambient-label {
		font-size: 11px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ui-text-color, #ffffff);
	}

	.ambient-caret {
		font-size: 12px;
		opacity: 0.7;
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
		top: 40px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 5;
		display: grid;
		gap: 8px;
		padding: 10px;
		min-width: 220px;
		border-radius: 16px;
		background:
			radial-gradient(circle at top, rgba(255, 255, 255, 0.08), transparent 60%),
			rgba(7, 14, 30, 0.82);
		border: 1px solid rgba(255, 255, 255, 0.12);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		box-shadow: 0 20px 38px rgba(0, 0, 0, 0.35);
		animation: ambientPanelIn 160ms ease-out;
	}

	.ambient-option {
		width: 100%;
		justify-content: flex-start;
		gap: 10px;
		padding: 8px 12px;
		border-radius: 12px;
		background: linear-gradient(
			120deg,
			color-mix(in srgb, var(--ambient-color) 18%, rgba(9, 16, 32, 0.9)) 0%,
			rgba(9, 16, 32, 0.5) 65%
		);
	}

	.ambient-option[data-active='true'] {
		border-color: color-mix(in srgb, var(--ambient-color) 75%, white);
		box-shadow:
			0 0 14px color-mix(in srgb, var(--ambient-color) 55%, transparent),
			inset 0 0 0 1px rgba(255, 255, 255, 0.08);
	}

	.ambient-text {
		display: grid;
		gap: 2px;
		text-align: left;
	}

	.ambient-name {
		font-size: 12px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ui-text-color, #ffffff);
	}

	.ambient-detail {
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--ui-text-color, #ffffff) 60%, transparent);
	}

	@keyframes ambientPanelIn {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(-6px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	.link {
		color: var(--ui-text-color, #ffffff);
		text-decoration: none;
		padding: 4px 6px;
		border-radius: 4px;
		pointer-events: auto;
		transition: transform 140ms ease, color 140ms ease;
	}

	.link:hover {
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.35);
	}

	.link.is-active {
		color: var(--ui-text-color, #ffffff);
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 6px;
		transform: scale(1.08);
	}

</style>
