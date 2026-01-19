<script lang="ts">
	import { onMount } from 'svelte';
	import { knowledgeHoverIndex } from '$lib/state/sceneState';
	import { viewMode } from '$lib/state/headerState';

	const copy = [
		{
			title: 'KNOWLEDGE · Execution Environments',
			body:
				'Experiencia trabajando en entornos Linux orientados a seguridad y operaciones reales, incluyendo Ubuntu LTS, Kali, Arch y Parrot, además de Windows 10 & 11 para escenarios mixtos y compatibilidad cross-platform.\n\n' +
				'Uso habitual de Docker y Docker Compose para crear entornos reproducibles, aislar servicios y facilitar pruebas y despliegues locales.\n' +
				'Primeros pasos sólidos en CI/CD con GitLab CI y Jenkins, comprendiendo el pipeline como un control de calidad y seguridad, no solo como automatización.\n\n' +
				'Nivel: Junior'
		},
		{
			title: 'KNOWLEDGE · Low-Level Systems',
			body:
				'Conocimiento práctico de C y Rust enfocado a comprender seguridad en memoria, manejo de procesos, concurrencia y principios básicos de optimización.\n' +
				'Interés especial en el comportamiento determinista del software y en cómo los errores a bajo nivel impactan directamente en seguridad y fiabilidad.\n\n' +
				'Este pilar actúa como base para entender exploits, fallos de diseño y límites reales del sistema, incluso cuando el desarrollo se realiza en capas superiores.\n\n' +
				'Nivel: Junior → Mid (en progresión activa)'
		},
		{
			title: 'KNOWLEDGE · Architecture & Design',
			body:
				'Diseño y desarrollo de backend utilizando Python, Java, Kotlin y TypeScript, con enfoque en modularidad, separación de responsabilidades y claridad de contratos.\n' +
				'Experiencia en frontend con React y Svelte, priorizando interfaces limpias, predecibles y bien estructuradas.\n\n' +
				'Personalización y diseño de herramientas CLI, entendiendo la línea de comandos como una interfaz crítica en entornos técnicos.\n' +
				'Experiencia puntual con FXML y exploración inicial de Swift para comprender otros paradigmas de UI y ecosistemas.\n\n' +
				'Nivel: Junior → Mid'
		},
		{
			title: 'KNOWLEDGE · Data & Trust',
			body:
				'Trabajo con bases de datos SQLite, PostgreSQL, Firebase y MongoDB, comprendiendo las diferencias entre modelos relacionales y NoSQL según el contexto.\n' +
				'Acceso a datos mediante Hibernate (ORM) y formatos de intercambio como JSON y TOON, priorizando contratos claros y validables.\n\n' +
				'Base sólida en criptografía aplicada, incluyendo AES-GCM, Shamir Secret Sharing, rotación de secretos y diseño de flujos donde ningún actor concentra todo el poder criptográfico.\n' +
				'Interés activo en Post-Quantum Cryptography (PQC) como línea de investigación y futuro endurecimiento.\n\n' +
				'Nivel: Junior → Mid'
		},
		{
			title: 'KNOWLEDGE · Applied Intelligence',
			body:
				'Aplicación práctica de ingeniería de prompts, validación de fuentes de verdad y uso responsable de IA como soporte a decisiones técnicas, no como sustituto del criterio humano.\n\n' +
				'Interés en estándares como ISO/IEC 42001, enfocados en seguridad, gobernanza y trazabilidad en sistemas de IA.\n' +
				'Uso intensivo de documentación clara y estructurada como mecanismo de control, auditoría y transmisión de conocimiento.\n\n' +
				'Nivel: Mid'
		}
	] as const;

	let typedTitle = '';
	let typedBody = '';
	let titleTimer: ReturnType<typeof setInterval> | null = null;
	let bodyTimer: ReturnType<typeof setInterval> | null = null;
	let lastKey = '';
	let isMounted = false;
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
		'ISO/IEC 42001',
		'IA'
	] as const;

	const clearTimers = () => {
		if (titleTimer) clearInterval(titleTimer);
		if (bodyTimer) clearInterval(bodyTimer);
		titleTimer = null;
		bodyTimer = null;
	};

	const startTyping = (nextTitle: string, nextBody: string) => {
		clearTimers();
		typedTitle = '';
		typedBody = '';

		let titleIndex = 0;
		titleTimer = setInterval(() => {
			titleIndex += 1;
			typedTitle = nextTitle.slice(0, titleIndex);
			if (titleIndex >= nextTitle.length) {
				clearInterval(titleTimer as ReturnType<typeof setInterval>);
				titleTimer = null;

				let bodyIndex = 0;
				bodyTimer = setInterval(() => {
					bodyIndex += 1;
					typedBody = nextBody.slice(0, bodyIndex);
					if (bodyIndex >= nextBody.length) {
						clearInterval(bodyTimer as ReturnType<typeof setInterval>);
						bodyTimer = null;
					}
				}, 12);
			}
		}, 16);
	};

	const escapeHtml = (value: string) =>
		value.replace(/[&<>"']/g, (char) => {
			if (char === '&') return '&amp;';
			if (char === '<') return '&lt;';
			if (char === '>') return '&gt;';
			if (char === '"') return '&quot;';
			return '&#39;';
		});

	const highlightKeywords = (value: string) => {
		let html = escapeHtml(value);
		html = html.replace(/\n/g, '<br>');
		for (const term of keywordTerms) {
			const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const pattern = term.includes(' ') ? escaped : `\\b${escaped}\\b`;
			const flags = term === 'C' ? 'g' : 'gi';
			html = html.replace(new RegExp(pattern, flags), (match) => `<span class="keyword">${match}</span>`);
		}
		return html;
	};

	onMount(() => {
		isMounted = true;
		return () => {
			clearTimers();
		};
	});

	$: current = $knowledgeHoverIndex !== null ? copy[$knowledgeHoverIndex] : null;
	$: if (current) {
		const lines = current.body.split('\n');
		current = {
			...current,
			body: lines.slice(0, -1).join('\n'),
			level: lines.slice(-1)[0]
		};
	}
	$: if ($viewMode === 'knowledge' && isMounted && current) {
		const key = `${current.title}::${current.body}`;
		if (key !== lastKey) {
			lastKey = key;
			startTyping(current.title, current.body);
		}
	} else {
		lastKey = '';
		clearTimers();
		typedTitle = '';
		typedBody = '';
	}

	$: formattedBody = highlightKeywords(typedBody);
</script>

{#if $viewMode === 'knowledge' && $knowledgeHoverIndex !== null}
	<div class="terminal" style={`--focus-index:${$knowledgeHoverIndex};`}>
		<div class="prompt">{current.level}</div>
		<div class="title">{typedTitle}</div>
		<div class="body">
			{@html formattedBody}<span class="cursor" aria-hidden="true"></span>
		</div>
	</div>
{/if}

<style>
	.terminal {
		--slot: 240px;
		position: fixed;
		left: 50%;
		top: 44%;
		transform: translateX(calc((var(--focus-index) - 2) * var(--slot))) translateX(-50%)
			translateY(-50%);
		z-index: 30;
		max-width: 460px;
		padding: 24px 26px;
		color: var(--ui-text-color, #ffffff);
		background: transparent;
		border: none;
		font: 15px/1.4 'JetBrains Mono', 'Fira Code', 'Source Code Pro', Menlo, Consolas, monospace;
		letter-spacing: 0.02em;
		pointer-events: none;
	}

	.prompt {
		font-size: 12px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		margin-bottom: 10px;
		color: #6ecbff;
	}

	.title {
		font-size: 18px;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		margin-bottom: 10px;
	}

	.body {
		font-size: 14px;
		line-height: 1.7;
		text-align: justify;
		word-spacing: 0.04em;
		white-space: pre-wrap;
	}

	:global(.keyword) {
		color: #d9b55c;
		font-weight: 700;
		text-shadow:
			0 0 10px rgba(217, 181, 92, 0.4),
			0 0 18px rgba(217, 181, 92, 0.25);
		animation: keywordGlow 2.6s ease-in-out infinite alternate;
	}

	.cursor {
		display: inline-block;
		width: 0.6em;
		height: 1em;
		margin-left: 0.08em;
		background: var(--ui-text-color, #ffffff);
		vertical-align: -0.1em;
		animation: blink 1s steps(1) infinite;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	@keyframes keywordGlow {
		0% {
			opacity: 0.85;
		}
		100% {
			opacity: 1;
		}
	}
</style>
