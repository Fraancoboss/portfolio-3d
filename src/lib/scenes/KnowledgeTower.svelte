<script lang="ts">
	import { T } from '@threlte/core';
	import type { CanvasTexture, Mesh, MeshBasicMaterial, MeshStandardMaterial } from 'three';
	import * as THREE from 'three';

	export let title: string;
	export let body: string;
	export let position: [number, number, number];
	export let appear = 1;
	export let hovered: boolean | null = null;
	export let meshRef: Mesh | null = null;
	export let width = 1.8;
	export let height = 2.8;
	export let depth = 1.8;
	export let titlePlaneWidth = 1.9;
	export let titlePlaneHeight = 0.48;
	export let bodyPlaneWidth = 1.6;
	export let bodyPlaneHeight = 1.2;
	export let titleCanvasWidth = 800;
	export let titleCanvasHeight = 180;
	export let bodyCanvasWidth = 900;
	export let bodyCanvasHeight = 700;
	export let titleFontSize = 30;
	export let bodyFontSize = 22;
	export let maxChars = 22;
export let bodyAlign: 'left' | 'center' | 'right' = 'center';
	export let titleOffsetX = 0;
	export let bodyOffsetX = 0;
	export let bodyOffsetY = 0;
	export let typingSpeedMs = 16;
	const titleZ = 0.75;
	const bodyZ = 0.75;
	$: titleY = height * 0.5 + 0.1;
	$: bodyY = 0.05 + bodyOffsetY;
	const keywordColor = '#d9b55c';
	const keywordTerms = [
		'Linux',
		'Ubuntu',
		'Kali',
		'Arch',
		'Parrot',
		'Windows',
		'Docker',
		'Compose',
		'CI/CD',
		'GitLab',
		'Jenkins',
		'C',
		'Rust',
		'Python',
		'Java',
		'Kotlin',
		'TypeScript',
		'React',
		'Svelte',
		'SvelteKit',
		'JavaFX',
		'CLI',
		'FXML',
		'Swift',
		'SQLite',
		'PostgreSQL',
		'Firebase',
		'MongoDB',
		'Hibernate',
		'JSON',
		'TOON',
		'AES-GCM',
		'Shamir',
		'Post-Quantum',
		'PQC',
		'ISO/IEC',
		'ISO',
		'ISO 27001',
		'IA',
		'DevSecOps',
		'Next.js',
		'Node.js',
		'Caddy',
		'SOAR',
		'SIEM',
		'UEBA',
		'EDRs',
		'Elastic',
		'Grafana',
		'Prometheus',
		'SSH',
		'ROS',
		'Arduino',
		'HTTPS',
		'ERP',
		'DAST',
		'SAST',
		'ENS',
		'Tauri',
		'Android',
		'Xcode',
		'DAM'
	] as const;
	const keywordSet = new Set(keywordTerms.map((term) => term.toLowerCase()));

	let towerMaterial: MeshStandardMaterial | null = null;
	let towerGeometry: THREE.BoxGeometry;
	let towerEdges: THREE.EdgesGeometry;
	let titleMaterial: MeshBasicMaterial | null = null;
	let bodyMaterial: MeshBasicMaterial | null = null;
	let titleTexture: CanvasTexture | null = null;
	let bodyTexture: CanvasTexture | null = null;

	let displayBody = '';
	let typingTimer: ReturnType<typeof setInterval> | null = null;
	let typingActive = false;

	const clearTyping = () => {
		if (typingTimer) clearInterval(typingTimer);
		typingTimer = null;
		typingActive = false;
	};

	const startTyping = (value: string) => {
		clearTyping();
		typingActive = true;
		displayBody = '';
		let index = 0;
		typingTimer = setInterval(() => {
			index += 1;
			displayBody = value.slice(0, index);
			if (index >= value.length) {
				clearTyping();
			}
		}, typingSpeedMs);
	};

	const wrapLines = (value: string, maxLineChars: number) => {
		const words = value.split(' ');
		const lines: string[] = [];
		let line = '';
		for (const word of words) {
			const next = line ? `${line} ${word}` : word;
			if (next.length > maxLineChars) {
				if (line) lines.push(line);
				line = word;
			} else {
				line = next;
			}
		}
		if (line) lines.push(line);
		return lines;
	};

	const normalizeToken = (value: string) =>
		value.replace(/[^A-Za-z0-9./+_-]/g, '').toLowerCase();

	const buildTextTexture = (
		value: string,
		fontSize: number,
		width: number,
		height: number,
		align: 'left' | 'center' | 'right' = 'center'
	) => {
		const pixelRatio = Math.min(2, window.devicePixelRatio || 1);
		const canvas = document.createElement('canvas');
		canvas.width = width * pixelRatio;
		canvas.height = height * pixelRatio;
		const ctx = canvas.getContext('2d');
		if (!ctx) return null;
		ctx.scale(pixelRatio, pixelRatio);
		ctx.imageSmoothingEnabled = true;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = `600 ${fontSize}px 'JetBrains Mono', 'Fira Code', 'Source Code Pro', Menlo, Consolas, monospace`;
		const uiRoot = document.querySelector('.viewport') ?? document.documentElement;
		const uiColor =
			getComputedStyle(uiRoot).getPropertyValue('--ui-text-color')?.trim() || '#e6f2ff';
		ctx.fillStyle = uiColor;
		ctx.textAlign = 'left';
		ctx.textBaseline = 'middle';
		const rawLines = value.split('\n');
		const lines = rawLines.flatMap((line) =>
			line.trim() === '' ? [''] : wrapLines(line, maxChars)
		);
		const lineHeight = fontSize * 1.2;
		const startY = height / 2 - (lines.length - 1) * (lineHeight / 2);
		const paddingX = 24;
		lines.forEach((lineText, i) => {
			const tokens = lineText.split(/(\s+)/);
			const tokenWidths = tokens.map((token) => ctx.measureText(token).width);
			const lineWidth = tokenWidths.reduce((sum, width) => sum + width, 0);
			const lineX =
				align === 'right'
					? width - paddingX - lineWidth
					: align === 'center'
						? (width - lineWidth) / 2
						: paddingX;
			let cursorX = lineX;
			tokens.forEach((token, tokenIndex) => {
				if (!token) return;
				const normalized = normalizeToken(token);
				if (normalized && keywordSet.has(normalized)) {
					ctx.fillStyle = keywordColor;
				} else {
					ctx.fillStyle = uiColor;
				}
				ctx.fillText(token, cursorX, startY + i * lineHeight);
				cursorX += tokenWidths[tokenIndex];
			});
		});
		const texture = new THREE.CanvasTexture(canvas);
		texture.generateMipmaps = false;
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		texture.anisotropy = 4;
		return texture;
	};

	$: effectiveHover = hovered ?? false;
	$: if (effectiveHover && appear >= 0.95 && !typingActive && displayBody !== body) {
		startTyping(body);
	} else if (!effectiveHover) {
		clearTyping();
		displayBody = '';
	}

	$: if (typeof window !== 'undefined') {
		titleTexture = buildTextTexture(
			title,
			titleFontSize,
			titleCanvasWidth,
			titleCanvasHeight,
			'center'
		);
		bodyTexture = buildTextTexture(
			displayBody,
			bodyFontSize,
			bodyCanvasWidth,
			bodyCanvasHeight,
			bodyAlign
		);
		if (titleMaterial && titleTexture) {
			titleMaterial.map = titleTexture;
			titleMaterial.needsUpdate = true;
		}
		if (bodyMaterial && bodyTexture) {
			bodyMaterial.map = bodyTexture;
			bodyMaterial.needsUpdate = true;
		}
		if (towerMaterial) {
			towerMaterial.opacity = 0.12 * appear;
			towerMaterial.needsUpdate = true;
		}
	}

	$: {
		towerGeometry = new THREE.BoxGeometry(width, height, depth);
		towerEdges = new THREE.EdgesGeometry(towerGeometry);
	}
</script>

<T.Group position={position} scale={[appear, appear, appear]}>
	<T.Mesh bind:ref={meshRef} geometry={towerGeometry}>
		<T.MeshStandardMaterial
			bind:ref={towerMaterial}
			color="#ffffff"
			opacity={0.12 * appear}
			transparent
			depthWrite={false}
			toneMapped={false}
		/>
	</T.Mesh>
	<T.LineSegments geometry={towerEdges} raycast={() => null}>
		<T.LineBasicMaterial color="#ffffff" transparent opacity={0.7 * appear} />
	</T.LineSegments>
	<T.Mesh position={[titleOffsetX, titleY, titleZ]} raycast={() => null}>
		<T.PlaneGeometry args={[titlePlaneWidth, titlePlaneHeight]} />
		<T.MeshBasicMaterial bind:ref={titleMaterial} transparent />
	</T.Mesh>
	<T.Mesh position={[bodyOffsetX, bodyY, bodyZ]} raycast={() => null}>
		<T.PlaneGeometry args={[bodyPlaneWidth, bodyPlaneHeight]} />
		<T.MeshBasicMaterial bind:ref={bodyMaterial} transparent />
	</T.Mesh>
</T.Group>
