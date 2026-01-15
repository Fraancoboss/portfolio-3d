<script lang="ts">
	import { pillarStage, progressStep } from '$lib/state/sceneState';

	const copy = {
		0: { title: 'LOW LEVEL', body: 'Las bases de cualquier sistema sólido se construyen en el bajo nivel. Lenguajes como C y Rust permiten comprender y controlar la memoria, la concurrencia y el rendimiento desde su raíz. Mientras C expone directamente los mecanismos fundamentales del sistema, Rust introduce garantías de seguridad de memoria y concurrencia segura sin sacrificar eficiencia. Dominar estos fundamentos no solo previene errores críticos, sino que habilita una escalabilidad segura, predecible y ágil permitiendo que proyectos complejos crezcan con confianza sobre una base técnica firme.' },
		1: { title: 'LINUX / WINDOWS', body: 'Tras dominar el bajo nivel, es imprescindible una base sólida sobre la que operar. Windows actúa como el estándar empresarial y personal: omnipresente, interoperable y clave en entornos corporativos, desarrollo profesional y sistemas híbridos. Linux, por su parte, ofrece el control y la especialización necesarios para sistemas críticos. Arch Linux permite una personalización total del sistema operativo, ideal para comprender cada capa del entorno. Ubuntu se consolida como el estándar de facto en contenedores y despliegues por su estabilidad versionada, siendo especialmente relevante en robótica y sistemas críticos. Kali Linux completa el cimiento con un ecosistema orientado a detección, observabilidad y ciberdefensa, proporcionando herramientas clave para análisis, auditoría y respuesta ante amenazas. Sobre esta base operativa se construyen sistemas robustos, observables y preparados para entornos reales.' },
		3: { title: 'HIGH LEVEL', body: 'En la capa superior, los lenguajes se abstraen casi por completo del hardware para priorizar productividad, interoperabilidad y orquestación. Python, TypeScript y Java permiten construir sistemas centrados en APIs, flujos de datos y servicios distribuidos sin exponer complejidades de bajo nivel. Esta capa es donde el software se vuelve consumible y automatizable, especialmente a través de APIs modernas y Model Context Protocols (MCP), que habilitan la integración nativa con modelos de inteligencia artificial. Aquí, la lógica ya no se ejecuta solo por usuarios, sino que puede ser invocada, encadenada y operada implícitamente por sistemas inteligentes, cerrando el ciclo desde los cimientos técnicos hasta la automatización avanzada.' },
		4: { title: 'TITULO 4', body: 'Lorem slkdjoaidjla...' }
	} as const;

	const pillarCopy = {
		1: {
			title: 'OBSERVABILITY',
			body: 'Un sistema fiable debe ser observable desde su concepción. La trazabilidad de eventos, métricas y registros permite reconstruir el historial de acciones del sistema a lo largo de todo su ciclo de vida. Esta visibilidad es clave para auditar comportamientos, detectar ataques, identificar errores lógicos y analizar fallos antes de que se conviertan en incidentes críticos. Sin observabilidad no existe control real.'
		},
		2: {
			title: 'SECURE BY DESIGN',
			body: 'La seguridad no debe añadirse como un parche, sino integrarse desde el inicio del diseño. Implementar principios de secure by design implica asumir una mayor carga inicial, pero evita deuda técnica y vulnerabilidades estructurales. Este enfoque facilita la escalabilidad, protege la integridad del sistema y permite que productos serios crezcan de forma sostenible.'
		},
		3: {
			title: 'ZERO TRUST',
			body: 'La confianza implícita es uno de los mayores riesgos en sistemas modernos. El modelo Zero Trust asume que ningún usuario, servicio o dispositivo es fiable por defecto, incluso dentro del perímetro. Cada acceso debe ser verificado, autenticado y autorizado de forma continua. Este enfoque reduce drásticamente la superficie de ataque, limita el movimiento lateral y refuerza la resiliencia del sistema frente a compromisos parciales. Zero Trust no es una herramienta, es una arquitectura de seguridad alineada con entornos distribuidos, cloud y escalables.'
		},
		4: {
			title: 'ISO 27001',
			body: 'La seguridad técnica solo es efectiva cuando se acompaña de marcos normativos y organizativos sólidos. ISO 27001 y el Esquema Nacional de Seguridad (ENS) proporcionan un marco estructurado para la gestión de la seguridad de la información, abarcando procesos, control de riesgos, cumplimiento y mejora continua. Su aplicación garantiza que la seguridad no dependa únicamente de implementaciones técnicas aisladas, sino de una estrategia integral, auditable y alineada con entornos empresariales y administraciones públicas.'
		}
	} as const;

	$: stage = $progressStep === 2 && $pillarStage >= 1 ? pillarCopy[$pillarStage] : copy[$progressStep];

	let typedTitle = '';
	let typedBody = '';
	let titleTimer: ReturnType<typeof setInterval> | null = null;
	let bodyTimer: ReturnType<typeof setInterval> | null = null;
	let lastKey = '';

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

	$: if (stage) {
		const key = `${stage.title}::${stage.body}`;
		if (key !== lastKey) {
			lastKey = key;
			startTyping(stage.title, stage.body);
		}
	} else {
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
