<script lang="ts">
	import { onMount } from 'svelte';
	import { pillarStage, progressStep } from '$lib/state/sceneState';

	const copy = {
		0: {
			title: 'LOW LEVEL',
			body:
				'Las bases de un sistema sólido\n' +
				'nacen en el bajo nivel.\n\n' +
				'Control de memoria.\n' +
				'Control de concurrencia.\n' +
				'Rendimiento predecible.\n\n' +
				'C expone los mecanismos del sistema.\n' +
				'Rust introduce memory safety\n' +
				'y concurrencia segura.\n\n' +
				'Estos fundamentos previenen fallos críticos\n' +
				'y sostienen escalabilidad técnica.'
		},
		1: {
			title: 'LINUX / WINDOWS',
			body:
				'Tras el bajo nivel,\n' +
				'la base operativa define el entorno.\n\n' +
				'Windows: estándar empresarial,\n' +
				'interoperable y dominante.\n\n' +
				'Linux: control y especialización.\n' +
				'Arch Linux para comprensión total.\n' +
				'Ubuntu como base de contenedores y despliegues.\n' +
				'Kali Linux orientado a detección,\n' +
				'observabilidad y ciberdefensa.\n\n' +
				'Con esta base se construyen sistemas\n' +
				'robustos, auditables y listos para producción.'
		},
		3: {
			title: 'HIGH LEVEL',
			body:
				'En la capa superior\n' +
				'la abstracción domina.\n\n' +
				'Python, TypeScript y Java\n' +
				'operan sobre APIs y flujos de datos\n' +
				'sin exponer complejidad de bajo nivel.\n\n' +
				'Las APIs modernas y los MCP\n' +
				'habilitan integración nativa con IA.\n\n' +
				'La lógica se invoca, se encadena\n' +
				'y se opera en sistemas distribuidos.'
		},
		4: { title: 'TITULO 4', body: 'Lorem slkdjoaidjla...' }
	} as const;

	const pillarCopy = {
		1: {
			title: 'OBSERVABILITY',
			body:
				'Un sistema fiable debe ser observable\n' +
				'desde su concepción.\n\n' +
				'Trazabilidad de eventos,\n' +
				'métricas y registros.\n\n' +
				'Permite auditar comportamientos,\n' +
				'detectar ataques y errores lógicos, necesario\n' +
				'para anticipar incidentes críticos.\n\n' +
				'Sin observability no hay control real.'
		},
		2: {
			title: 'SECURE BY DESIGN',
			body:
				'La seguridad no es un parche.\n' +
				'Se integra desde el diseño.\n\n' +
				'secure by design implica\n' +
				'mayor carga inicial,\n' +
				'menos deuda técnica\n' +
				'y menos vulnerabilidades.\n\n' +
				'Protege la integridad del sistema\n' +
				'y sostiene crecimiento sostenible.'
		},
		3: {
			title: 'ZERO TRUST',
			body:
				'La confianza implícita\n' +
				'es un riesgo estructural.\n\n' +
				'Zero Trust asume que ningún actor\n' +
				'es fiable por defecto.\n\n' +
				'Cada acceso se verifica,\n' +
				'se autentica y se autoriza\n' +
				'de forma continua.\n\n' +
				'Reduce superficie de ataque,\n' +
				'limita movimiento lateral\n' +
				'y refuerza resiliencia.\n\n' +
				'Zero Trust es arquitectura,\n' +
				'no una herramienta.'
		},
		4: {
			title: 'ISO 27001 / ENS',
			body:
				'La seguridad técnica requiere\n' +
				'marcos organizativos sólidos.\n\n' +
				'ISO 27001 y ENS estructuran\n' +
				'la gestión de seguridad:\n' +
				'procesos, riesgos, cumplimiento\n' +
				'y mejora continua.\n\n' +
				'Evitan depender de controles aislados\n' +
				'y permiten auditoría consistente\n' +
				'en entornos empresariales y públicos.'
		}
	} as const;

	$: stage = $progressStep === 2 && $pillarStage >= 1 ? pillarCopy[$pillarStage] : copy[$progressStep];

	let typedTitle = '';
	let typedBody = '';
	let titleTimer: ReturnType<typeof setInterval> | null = null;
	let bodyTimer: ReturnType<typeof setInterval> | null = null;
	let lastKey = '';
	let isMounted = false;

	const keywordTerms = [
		'C',
		'Rust',
		'Python',
		'TypeScript',
		'Java',
		'Zero Trust',
		'Secure by Design',
		'ISO 27001',
		'ENS',
		'memory safety',
		'concurrency',
		'observability',
		'APIs',
		'MCP'
	] as const;

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
			html = html.replace(new RegExp(pattern, 'gi'), (match) => `<span class="keyword">${match}</span>`);
		}
		return html;
	};

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
				}, 10);
			}
		}, 14);
	};

	onMount(() => {
		isMounted = true;
		return () => {
			clearTimers();
		};
	});

	$: if (stage && isMounted) {
		const key = `${stage.title}::${stage.body}`;
		if (key !== lastKey) {
			lastKey = key;
			startTyping(stage.title, stage.body);
		}
	} else if (!stage) {
		lastKey = '';
		clearTimers();
		typedTitle = '';
		typedBody = '';
	}

	$: highlightedBody = highlightKeywords(typedBody);
</script>

{#if stage}
	<div class="stage">
		<div class="title">{typedTitle}</div>
		<div class="body">
			{@html highlightedBody}<span class="cursor" aria-hidden="true"></span>
		</div>
	</div>
{/if}

<style>
	.stage {
		position: fixed;
		left: 28px;
		top: 50%;
		transform: translateY(-50%);
		z-index: 20;
		max-width: 560px;
		padding: 18px 20px;
		color: #ffffff;
		background: transparent;
		border: none;
		font: 15px/1.4 'JetBrains Mono', 'Fira Code', 'Source Code Pro', Menlo, Consolas, monospace;
		letter-spacing: 0.02em;
		pointer-events: none;
	}

	.title {
		font-size: 18px;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		margin-bottom: 14px;
	}

	.body {
		font-size: 14px;
		line-height: 1.7;
		text-align: justify;
		word-spacing: 0.04em;
	}

	.cursor {
		display: inline-block;
		width: 0.6em;
		height: 1em;
		margin-left: 0.08em;
		background: #ffffff;
		vertical-align: -0.1em;
		animation: blink 1s steps(1) infinite;
	}

	.keyword {
		color: #6ecbff;
		font-weight: 700;
		animation: keywordPulse 2.6s ease-in-out infinite alternate;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	@keyframes keywordPulse {
		0% {
			color: #6ecbff;
		}
		100% {
			color: #e0f6ff;
		}
	}
</style>
