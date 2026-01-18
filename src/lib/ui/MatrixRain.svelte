<script lang="ts">
	import { onMount } from 'svelte';
	import { ambientTokens } from '$lib/state/sceneState';

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null = null;
	let frameId = 0;
	let lastTime = 0;

	type Column = {
		x: number;
		y: number;
		speed: number;
		length: number;
		seed: number;
		phase: number;
	};

	const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+-*/[]{}<>|=';
	const fontStack = "12px 'JetBrains Mono', 'Fira Code', 'Source Code Pro', Menlo, Consolas, monospace";
	let baseColor = '#6fb6ff';
	let headColor = '#a8d9ff';
	const baseAlpha = 0.18;
	const spacing = 16;

	let columns: Column[] = [];

	$: if ($ambientTokens) {
		baseColor = $ambientTokens.matrixBase;
		headColor = $ambientTokens.matrixHead;
	}

	const buildColumns = (width: number, height: number) => {
		const count = Math.max(18, Math.floor(width / 40));
		const gap = width / count;
		columns = Array.from({ length: count }, (_, index) => {
			const jitter = (Math.random() - 0.5) * gap * 0.35;
			return {
				x: gap * index + gap * 0.5 + jitter,
				y: Math.random() * height,
				speed: 60 + Math.random() * 40,
				length: 10 + Math.floor(Math.random() * 10),
				seed: Math.floor(Math.random() * glyphs.length),
				phase: Math.random() * Math.PI * 2
			};
		});
	};

	const resizeCanvas = () => {
		if (!canvas || !context) return;
		const rect = canvas.getBoundingClientRect();
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;
		context.setTransform(dpr, 0, 0, dpr, 0, 0);
		context.font = fontStack;
		context.textBaseline = 'top';
		buildColumns(rect.width, rect.height);
	};

	const draw = (time: number) => {
		if (!context || !canvas) return;
		const rect = canvas.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;
		const dt = lastTime ? (time - lastTime) / 1000 : 0;
		lastTime = time;

		context.clearRect(0, 0, width, height);

		for (const column of columns) {
			column.y += column.speed * dt;

			for (let i = 0; i < column.length; i += 1) {
				const y = column.y - i * spacing;
				if (y < -spacing || y > height + spacing) continue;

				const pulse = 0.6 + 0.4 * Math.sin(time * 0.001 + column.phase);
				const alpha = baseAlpha * pulse * (1 - i / (column.length + 1));
				const index =
					(Math.floor((column.y + i * 5) / 8) + column.seed + i) % glyphs.length;
				const glyph = glyphs[index];

				context.globalAlpha = i === 0 ? Math.min(alpha * 1.6, 0.12) : alpha;
				context.fillStyle = i === 0 ? headColor : baseColor;
				context.fillText(glyph, column.x, y);
			}

			if (column.y - column.length * spacing > height + spacing) {
				column.y = -Math.random() * height * 0.6;
			}
		}

		context.globalAlpha = 1;
		frameId = requestAnimationFrame(draw);
	};

	onMount(() => {
		context = canvas.getContext('2d');
		if (!context) return;

		resizeCanvas();
		const handleResize = () => resizeCanvas();
		window.addEventListener('resize', handleResize);
		frameId = requestAnimationFrame(draw);

		return () => {
			window.removeEventListener('resize', handleResize);
			cancelAnimationFrame(frameId);
		};
	});
</script>

<div class="matrix">
	<canvas bind:this={canvas} aria-hidden="true"></canvas>
</div>

<style>
	.matrix {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: none;
		z-index: 5;
	}

	.matrix canvas {
		width: 100%;
		height: 100%;
		display: block;
	}
</style>
