<script lang="ts">
	import { onMount } from 'svelte';
	import { cubeFocusIndex, cubeHoverIndex, cubeHoverLock } from '$lib/state/sceneState';
	import { viewMode } from '$lib/state/headerState';

	const copy = [
		{
			title: 'SECURE COMMUNICATION SYSTEM',
			body: `Sistema de comunicación cliente-servidor
	diseñado bajo confidencialidad fuerte
	y separación estricta de secretos.

	Cifrado autenticado con AES-GCM
	y gestión de claves mediante
	Shamir Secret Sharing.

	Arquitectura resistente a MITM,
	auditable y pensada para
	pruebas de seguridad avanzadas.`
		},
		{
			title: 'SECURE DATA EXCHANGE',
			body: `Plataforma de intercambio seguro
	basada en un modelo zero-trust real.

	Cliente, servidor y auditor
	operan con claves parciales
	y responsabilidades separadas.

	Combina AES-256 efímero,
	Shamir (n=3, t=2), MFA
	y auditoría cifrada.`
		},
		{
			title: 'SOC_MIN_PUB · ROS 2 SECURITY NODE',
			body: `Nodo mínimo reproducible
	escrito en Rust sobre ROS 2 Humble.

	Publica señales de vida
	("SOC heartbeat") para
	SOC distribuidos en robótica.

	Pensado para reproducibilidad,
	ejecución determinista
	y despliegue en contenedores.`
		},
		{
			title: 'RUST AUTHENTICATION',
			body: `Sistema de autenticación
	en Rust con frontend en Svelte.

	Endurecimiento de credenciales
	y defensa activa contra abuso.

	Argon2id, políticas estrictas,
	detección de diccionarios filtrados
	y bloqueo por fuerza bruta.`
		},
		{
			title: 'ROBOCORE · SIEM & EDR',
			body: `Plataforma SIEM/EDR
	para sistemas robóticos
	y entornos ciber-físicos.

	Construida en Rust
	con ingeniería determinista
	como control de seguridad.

	Eventos explícitos,
	serialización estricta
	y observabilidad confiable.`
		}
	] as const;

	const repoLinks = [
		'https://github.com/Fraancoboss/SecureShareVault',
		'https://github.com/Fraancoboss/SecureDataExchange',
		'https://github.com/Fraancoboss/soc-rust-ros2-node',
		'https://github.com/Fraancoboss/login-rust-svelte',
		'https://github.com/Fraancoboss/robocore-siem-edr'
	] as const;

	let typedTitle = '';
	let typedBody = '';
	let titleTimer: ReturnType<typeof setInterval> | null = null;
	let bodyTimer: ReturnType<typeof setInterval> | null = null;
	let buttonTimer: ReturnType<typeof setInterval> | null = null;
	let lastKey = '';
	let lastButtonKey = '';
	let isMounted = false;
	let buttonText = '>> [VER REPOSITORIO] <<';
	let buttonDisplay = buttonText;
	let buttonReveal = 0;

	const clearTimers = () => {
		if (titleTimer) clearInterval(titleTimer);
		if (bodyTimer) clearInterval(bodyTimer);
		if (buttonTimer) clearInterval(buttonTimer);
		titleTimer = null;
		bodyTimer = null;
		buttonTimer = null;
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

	const randomBit = () => (Math.random() > 0.5 ? '1' : '0');

	const buildBinary = (label: string, revealed: number) => {
		const revealedText = label.slice(0, revealed);
		const rest = label
			.slice(revealed)
			.split('')
			.map((char) => (char === ' ' ? ' ' : randomBit()))
			.join('');
		return revealedText + rest;
	};

	const startButtonReveal = () => {
		if (buttonTimer) clearInterval(buttonTimer);
		buttonReveal = 0;
		buttonDisplay = buildBinary(buttonText, 0);
		buttonTimer = setInterval(() => {
			buttonDisplay = buildBinary(buttonText, buttonReveal);
			buttonReveal += 1;
			if (buttonReveal > buttonText.length) {
				clearInterval(buttonTimer as ReturnType<typeof setInterval>);
				buttonTimer = null;
				buttonDisplay = buttonText;
			}
		}, 32);
	};

	onMount(() => {
		isMounted = true;
		return () => {
			clearTimers();
		};
	});

	$: current = copy[$cubeFocusIndex] ?? copy[0];
	$: isPrivate = $cubeFocusIndex === 2 || $cubeFocusIndex === 4;
	$: buttonText = isPrivate ? '>> [REPOSITORIO PRIVADO -> CONTACTAME] <<' : '>> [VER REPOSITORIO] <<';
	$: prompt = `${$cubeFocusIndex + 1}`;
	$: repoHref = repoLinks[$cubeFocusIndex] ?? repoLinks[0];
	$: if ($viewMode === 'projects' && isMounted && current) {
		const key = `${current.title}::${current.body}`;
		if (key !== lastKey) {
			lastKey = key;
			startTyping(current.title, current.body);
		}
		const buttonKey = `${$cubeFocusIndex}::${$viewMode}`;
		if (buttonKey !== lastButtonKey) {
			lastButtonKey = buttonKey;
			startButtonReveal();
		}
	} else if ($viewMode !== 'projects') {
		lastKey = '';
		lastButtonKey = '';
		clearTimers();
		typedTitle = '';
		typedBody = '';
		buttonDisplay = buttonText;
		buttonReveal = 0;
	}
</script>

{#if $viewMode === 'projects'}
	<div
		class="terminal"
		style={`--focus-index:${$cubeFocusIndex};`}
		role="group"
		on:mouseenter={() => {
			cubeHoverLock.set(true);
			cubeHoverIndex.set($cubeFocusIndex);
		}}
		on:mouseleave={() => {
			cubeHoverLock.set(false);
			cubeHoverIndex.set(null);
		}}
	>
		<a class={`repo-button ${isPrivate ? 'private' : ''}`} href={repoHref} target="_blank" rel="noreferrer">
			{buttonDisplay}
		</a>
		<div class="prompt">{prompt}</div>
		<div class="title">{typedTitle}</div>
		<div class="body">{typedBody}<span class="cursor" aria-hidden="true"></span></div>
	</div>
{/if}

<style>
	.terminal {
		--slot: 360px;
		--bias: 12px;
		position: fixed;
		left: 50%;
		top: 68%;
		transform: translateX(
				calc((var(--focus-index) - 2) * var(--slot) + (var(--focus-index) * var(--bias)))
			)
			translateX(-50%) translateY(-55%);
		z-index: 30;
		max-width: 460px;
		padding: 30px 30px;
		color: #ffffff;
		background: transparent;
		border: none;
		font: 15px/1.4 'JetBrains Mono', 'Fira Code', 'Source Code Pro', Menlo, Consolas, monospace;
		letter-spacing: 0.02em;
		pointer-events: auto;
	}

	.repo-button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 12px;
		padding: 7px 12px;
		border: 1px solid rgba(255, 255, 255, 0.35);
		border-radius: 6px;
		background: rgba(7, 14, 30, 0.6);
		color: #ffffff;
		font: 14px/1 'JetBrains Mono', 'Fira Code', 'Source Code Pro', Menlo, Consolas, monospace;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		text-decoration: none;
		box-shadow:
			0 0 18px rgba(110, 203, 255, 0.18),
			inset 0 0 12px rgba(255, 255, 255, 0.08);
		transition:
			box-shadow 180ms ease,
			border-color 180ms ease,
			background 180ms ease,
			transform 180ms ease;
	}

	.repo-button:hover,
	.repo-button:focus-visible {
		border-color: rgba(110, 203, 255, 0.75);
		background: rgba(7, 14, 30, 0.78);
		box-shadow:
			0 0 24px rgba(110, 203, 255, 0.45),
			inset 0 0 16px rgba(255, 255, 255, 0.12);
		transform: translateY(-1px);
	}

	.repo-button.private {
		color: #ff3b30;
		border-color: rgba(255, 59, 48, 0.6);
		box-shadow:
			0 0 18px rgba(255, 59, 48, 0.25),
			inset 0 0 12px rgba(255, 255, 255, 0.08);
	}

	.repo-button.private:hover,
	.repo-button.private:focus-visible {
		border-color: rgba(255, 59, 48, 0.9);
		background: rgba(30, 6, 10, 0.8);
		box-shadow:
			0 0 24px rgba(255, 59, 48, 0.5),
			inset 0 0 16px rgba(255, 255, 255, 0.12);
	}

	.prompt {
		font-size: 12px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		margin-bottom: 10px;
		color: #6ecbff;
		pointer-events: none;
	}

	.title {
		font-size: 18px;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		margin-bottom: 10px;
		pointer-events: none;
	}

	.body {
		font-size: 14px;
		line-height: 1.7;
		text-align: justify;
		word-spacing: 0.04em;
		white-space: pre-wrap;
		pointer-events: none;
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

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
