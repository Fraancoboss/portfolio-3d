<script lang="ts">
	import {
		HEADER_HEIGHT,
		MAX_PULL,
		pullDistance,
		isOpen,
		viewMode,
		headerPullStrength
	} from '$lib/state/headerState';

	const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

	$: offset = clamp($pullDistance, 0, MAX_PULL) - HEADER_HEIGHT;
	$: showNav = $isOpen;
	const navItems = [
		{ label: 'MAIN', href: '#main', action: 'main' },
		{ label: 'TECHNOLOGIES', href: '#technologies' },
		{ label: 'PROYECTS', href: '#proyects', action: 'projects' },
		{ label: 'BLOG', href: '#blog' },
		{ label: 'CONTACT', href: '#contact' }
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

	const handleNavClick = (event: MouseEvent, action?: 'main' | 'projects') => {
		if (!action) return;
		viewMode.set(action);
		isOpen.set(false);
		pullDistance.set(0);
	};
</script>

<header class="header" style={`transform: translateY(${offset}px); height: ${HEADER_HEIGHT}px;`}>
	<div class="inner">
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
		background: rgba(255, 255, 255, 0.025);
		border-bottom: 3px solid rgba(28, 52, 92, 0.8);
		pointer-events: auto;
		transition: transform 180ms ease-out;
		overflow: hidden;
		backdrop-filter: blur(10px) saturate(1.8) brightness(1.18);
		-webkit-backdrop-filter: blur(10px) saturate(1.8) brightness(1.18);
		box-shadow:
			0 16px 36px rgba(0, 0, 0, 0.35),
			inset 0 0 0 1px rgba(255, 255, 255, 0.12),
			inset 0 -10px 20px rgba(0, 0, 0, 0.25);
	}

	.header::before {
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
		opacity: 0.9;
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
