<script lang="ts">
// Scene owns interaction, focus, and progress. Components are intentionally passive and emit events only.
// Scene does NOT render UI overlays; it only publishes state for UI to read.
import { T, useTask, useThrelte } from '@threlte/core';
import { onMount } from 'svelte';
import { cubicInOut, cubicOut } from 'svelte/easing';
import { tweened } from 'svelte/motion';
import type { Group } from 'three';
import * as THREE from 'three';

import BackgroundGrid from '$lib/scenes/BackgroundGrid.svelte';
import Floor from '$lib/components/Floor.svelte';
import Foundation from '$lib/components/Foundation.svelte';
import Pillar from '$lib/components/Pillar.svelte';
import Roof from '$lib/components/Roof.svelte';
import Cube from '$lib/components/Cube.svelte';
import ContactScene from '$lib/scenes/ContactScene.svelte';
import KnowledgeTower from '$lib/scenes/KnowledgeTower.svelte';
import {
	hoveredPart,
	progressStep,
	pillarStage as pillarStageStore,
	cubeFocusIndex as cubeFocusIndexStore,
	cubeHoverIndex as cubeHoverIndexStore,
	cubeHoverLock as cubeHoverLockStore,
	knowledgeHoverIndex as knowledgeHoverIndexStore,
	mainScrollStarted,
	lastMainScrollAt,
	stepCommand,
	ambientVariant,
	ambientTokens
} from '$lib/state/sceneState';
import { viewMode } from '$lib/state/headerState';

	let rootGroup: Group;
	let wrapperGroup: Group;
	let sideLeftGroup: Group;
	let sideRightGroup: Group;
	let structureXValue = 0;
	const { camera, canvas } = useThrelte();
	const raycaster = new THREE.Raycaster();
	const pointer = new THREE.Vector2();
	const rotationPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
	const rotationHit = new THREE.Vector3();
	const cubeMeshes: Array<THREE.Mesh | null> = Array(5).fill(null);
	const knowledgeMeshes: Array<THREE.Mesh | null> = Array(5).fill(null);
	const knowledgeTowerMeshes: Array<THREE.Mesh | null> = Array(2).fill(null);
	const contactMeshes: Array<THREE.Mesh | null> = Array(3).fill(null);
	let contactLinks: Array<string | null> = [];
	let contactHoverIndex: number | null = null;
	let knowledgeTowerHoverIndex: number | null = null;

	let isDragging = false;
	let lastX = 0;
	let rootCurrentY = 0;
	let rootTargetY = 0;
	let leftCurrentY = 0;
	let leftTargetY = 0;
	let rightCurrentY = 0;
	let rightTargetY = 0;
	let activeRotation: 'root' | 'left' | 'right' = 'root';

let step = 0;
	let lastWheelTime = 0;
	let pillarStage = 0;

	// Security note:
	// Visual determinism is intentional. Predictable states reduce ambiguous UI behavior
	// and prevent accidental interaction paths that could desync scene state.
	// NOTE: The visual pipeline assumes discrete stages; intermediate values are intentionally not supported.
	const sensitivity = 0.005;
	const damping = 0.12;
	const idleRotationSpeed = 0.002;
	const sideIdleRotationSpeed = 0.0016;
	const wheelCooldownMs = 120;
	const pillarHiddenY = 0.2;
	const pillarVisibleY = -0.25;
	const pillarTween = { duration: 300, easing: cubicOut };
	const foundationHiddenY = 0.4;
	const foundationVisibleY = 0;
const roofHiddenX = 1.6;
const roofVisibleX = 0;
const structureHiddenX = 0;
const structureVisibleX = 2.5;
	const structureLiftY = 0.9;
const stageTween = { duration: 350, easing: cubicOut };
const structureTween = { duration: 700, easing: cubicOut, delay: 0 };
const sceneTween = { duration: 650, easing: cubicInOut };

	const pillarY1 = tweened(pillarHiddenY, pillarTween);
	const pillarY2 = tweened(pillarHiddenY, pillarTween);
	const pillarY3 = tweened(pillarHiddenY, pillarTween);
	const pillarY4 = tweened(pillarHiddenY, pillarTween);
const foundationY = tweened(foundationHiddenY, stageTween);
const roofX = tweened(roofHiddenX, stageTween);
	const structureX = tweened(structureHiddenX, stageTween);
	const structureYOffset = tweened(0, structureTween);
	const sceneYOffset = tweened(0, sceneTween);
	const knowledgeSpacing = 1.5;
	const knowledgeY = 0.8;
	const knowledgeDropDistance = 6.5;
	const towerBaseY = 2.3;
	const towerSpacing = 3.0;
	const reelOffset = 10.5;
	const reelDuration = 520;
	const knowledgeScale: [number, number, number] = [0.65, 0.65, 0.65];
	const knowledgeAppear = tweened(0, { duration: 420, easing: cubicOut });
	const knowledgeDrop = tweened(0, { duration: 520, easing: cubicOut });
	const towerAppear = tweened(0, { duration: 520, easing: cubicOut });
	const reelProgress = tweened(0, { duration: 520, easing: cubicOut });
	const knowledgePopMin = 0.12;
	const knowledgeHoverTween = { duration: 220, easing: cubicOut };
	const knowledgeHoverScale1 = tweened(1, knowledgeHoverTween);
	const knowledgeHoverScale2 = tweened(1, knowledgeHoverTween);
	const knowledgeHoverScale3 = tweened(1, knowledgeHoverTween);
	const knowledgeHoverScale4 = tweened(1, knowledgeHoverTween);
	const knowledgeHoverScale5 = tweened(1, knowledgeHoverTween);
	const knowledgeHoverOpacity1 = tweened(1, knowledgeHoverTween);
	const knowledgeHoverOpacity2 = tweened(1, knowledgeHoverTween);
	const knowledgeHoverOpacity3 = tweened(1, knowledgeHoverTween);
	const knowledgeHoverOpacity4 = tweened(1, knowledgeHoverTween);
	const knowledgeHoverOpacity5 = tweened(1, knowledgeHoverTween);
	const knowledgeTowerConfigs = [
		{
			title: 'EXPERIENCIA',
			body: `Gestión de proyectos técnicos, metodologías de desarrollo y arquitectura limpia en productos reales y entornos de producción.

CI/CD con Jenkins y GitHub; despliegues seguros, reproducibles y auditables.

Redes y sistemas: soporte remoto/presencial, periféricos, servicios y continuidad.

Desarrollo web y multiplataforma.
Backend: Rust, Java, Python, Go. Frontend: SvelteKit, React, JavaFX.

Secure by Design, desarrollo limpio e IA aplicada.
Machine Learning: detección de eventos con Isolation Forest.

SOCs, SOAR, SIEM, UEBA y EDRs (Elastic) en laboratorio.
Métricas y gobernanza con Grafana y Prometheus.

Git/GitHub diario, VPS, backups y rollbacks.
Ubuntu Server 24.04 LTS.

Robótica (ROS 2) y sensores/Arduino.
Frontend orientado a UX y marketing.

Telecomunicaciones seguras, versionado de APIs y certificados HTTPS.
SSH multi‑cuenta y concienciación en seguridad digital.

Interés en DevSecOps, infraestructura y soberanía tecnológica.
Prompt engineering y documentación para desarrollo seguro y auditable.
Ideas para ciberseguridad e infraestructura con agentes de IA.`,
			width: 6.2,
			height: 3.0,
			depth: 1.9,
			titlePlaneWidth: 4.6,
			titlePlaneHeight: 0.78,
			bodyPlaneWidth: 6.0,
			bodyPlaneHeight: 2.2,
			titleCanvasWidth: 2100,
			titleCanvasHeight: 360,
			titleFontSize: 38,
			bodyCanvasWidth: 2200,
			bodyCanvasHeight: 840,
			bodyFontSize: 24,
			maxChars: 110
		},
		{
			title: 'ACTUALMENTE',
			body: `Gestión de una aplicación web en producción para un cliente, desplegada en VPS con Ubuntu, usando Next.js, Node.js y SQLite, con planes definidos de migración a PostgreSQL. Pipeline CI/CD completo con Jenkins, automatización de tareas del servidor y seguridad aplicada mediante Caddy.

Desarrollo de proyectos orientados a la migración de un ERP en una empresa de electromecánica, con el objetivo de automatizar procesos repetitivos, mejorar la claridad de los flujos críticos y sentar las bases para una explotación estadística estratégica del negocio. Visión a medio plazo de integrar inteligencia artificial propia para una gestión de incidencias más profesional y ágil.

Actualmente en búsqueda de prácticas, con el objetivo de adquirir experiencia real en desarrollo en equipo, entornos profesionales y tecnologías vanguardistas. Especial interés en certificaciones y auditorías de seguridad (DAST, SAST, ENS, ISO 27001).`,
			width: 5.8,
			height: 2.9,
			depth: 1.8,
			titlePlaneWidth: 4.2,
			titlePlaneHeight: 0.78,
			bodyPlaneWidth: 5.6,
			bodyPlaneHeight: 2.1,
			titleCanvasWidth: 1900,
			titleCanvasHeight: 360,
			titleFontSize: 38,
			bodyCanvasWidth: 2100,
			bodyCanvasHeight: 800,
			bodyFontSize: 24,
			maxChars: 108
		},
		{
			title: 'OBJETIVOS',
			body: `Seguir creciendo como profesional en el ámbito del desarrollo seguro y la ciberseguridad aplicada al producto, aportando una base sólida y una alta capacidad para comprender sistemas complejos, incluso partiendo de una formación formal compuesta por DAM y un máster en Desarrollo con Inteligencia Artificial.

Busco una experiencia enriquecedora, donde aprender de equipos experimentados, aportar valor desde el primer día y continuar desarrollándome técnica y personalmente, manteniendo siempre una actitud honesta, curiosa y orientada a la divulgación tecnológica.

Además, tengo un interés creciente en el desarrollo multiplataforma con Tauri, explorando su potencial para aplicaciones ligeras y seguras. Cuento con experiencia práctica en Kotlin utilizando Android Studio y conocimientos básicos de Swift en Xcode, lo que me permite comprender los fundamentos del desarrollo móvil nativo y su integración con arquitecturas modernas.`,
			width: 6.0,
			height: 3.0,
			depth: 1.9,
			titlePlaneWidth: 4.4,
			titlePlaneHeight: 0.78,
			bodyPlaneWidth: 5.8,
			bodyPlaneHeight: 2.2,
			titleCanvasWidth: 2000,
			titleCanvasHeight: 360,
			titleFontSize: 38,
			bodyCanvasWidth: 2200,
			bodyCanvasHeight: 840,
			bodyFontSize: 24,
			maxChars: 110,
			bodyAlign: 'left'
		}
	] as const;
	// Intentionally explicit mapping.
	// This avoids premature abstraction and keeps the visual pipeline predictable.
	// Do not generalize unless the interaction model changes.
	const cubeHiddenY = 6.2;
	const cubeCenterY = 2.85;
	const cubeGap = 2.0;
	const cubeTargetX1 = -cubeGap * 2;
	const cubeTargetX2 = -cubeGap;
	const cubeTargetX3 = 0;
	const cubeTargetX4 = cubeGap;
	const cubeTargetX5 = cubeGap * 2;
	const cubeTween = { duration: 520, easing: cubicOut };
	const cubeX1 = tweened(0, cubeTween);
	const cubeX2 = tweened(0, cubeTween);
	const cubeX3 = tweened(0, cubeTween);
	const cubeX4 = tweened(0, cubeTween);
	const cubeX5 = tweened(0, cubeTween);
	const cubeY = tweened(cubeHiddenY, cubeTween);
	const cubeFocusTween = { duration: 260, easing: cubicOut };
	const cubeSmallScale = 0.6;
	const cubeLargeScale = 0.95;
	const cubeSmallOpacity = 0.06;
	const cubeLargeOpacity = 0.22;
	const wrapperSize: [number, number, number] = [2.6, 2.4, 2.6];
	const wrapperHalf: [number, number, number] = [
		wrapperSize[0] * 0.5,
		wrapperSize[1] * 0.5,
		wrapperSize[2] * 0.5
	];
	const sideStructureOffset = 3.2;
	let wrapperRotationSpeed = -0.004;
	const wrapperOffsetY = 0.8;
	let wrapperVisible = false;
	let wrapperTimer: ReturnType<typeof setTimeout> | null = null;
	let wrapperFlashColor: string | null = null;
	let wrapperFlashTimer: ReturnType<typeof setTimeout> | null = null;
	let wrapperLineColor = '#ffffff';
	let wrapperFaceColor = '#ffffff';
	let wrapperFlashDone = false;
	let wrapperSpinReady = false;
	const wrapperOpacity = tweened(0, { duration: 420, easing: cubicOut });
	const wrapperSpin = new THREE.Vector3();
	const wrapperFixedRotation = new THREE.Euler(0.15, 0.9, -0.1);
	const wrapperFixedQuat = new THREE.Quaternion().setFromEuler(wrapperFixedRotation);
	let wrapperSettled = false;
	const cubeScale1 = tweened(cubeSmallScale, cubeFocusTween);
	const cubeScale2 = tweened(cubeSmallScale, cubeFocusTween);
	const cubeScale3 = tweened(cubeSmallScale, cubeFocusTween);
	const cubeScale4 = tweened(cubeSmallScale, cubeFocusTween);
	const cubeScale5 = tweened(cubeSmallScale, cubeFocusTween);
	const cubeOpacity1 = tweened(cubeSmallOpacity, cubeFocusTween);
	const cubeOpacity2 = tweened(cubeSmallOpacity, cubeFocusTween);
	const cubeOpacity3 = tweened(cubeSmallOpacity, cubeFocusTween);
	const cubeOpacity4 = tweened(cubeSmallOpacity, cubeFocusTween);
	const cubeOpacity5 = tweened(cubeSmallOpacity, cubeFocusTween);
	const wrapperGeometry = new THREE.BoxGeometry(...wrapperSize);
	const wrapperEdges = new THREE.EdgesGeometry(wrapperGeometry);
	const particleCount = 140;
	const particlePositions = new Float32Array(particleCount * 3);
	const particleVelocities = new Float32Array(particleCount * 3);
	const particleDrift = new Float32Array(particleCount * 3);
	const particleColors = new Float32Array(particleCount * 3);
	const particleFlash = new Float32Array(particleCount);
	const particleFlashGreen = new Float32Array(particleCount);
	const particleMode = new Int8Array(particleCount);
	const particleExplosion = new Float32Array(particleCount);
	const particleSizes = new Float32Array(particleCount);
	const particleRedLocked = new Uint8Array(particleCount);
	const particleGeometry = new THREE.BufferGeometry();
	const particlePositionAttr = new THREE.BufferAttribute(particlePositions, 3);
	const particleColorAttr = new THREE.BufferAttribute(particleColors, 3);
	const particleSizeAttr = new THREE.BufferAttribute(particleSizes, 1);
	particleGeometry.setAttribute('position', particlePositionAttr);
	particleGeometry.setAttribute('color', particleColorAttr);
	particleGeometry.setAttribute('size', particleSizeAttr);
	let cubeFocusIndex = 0;
	let knowledgeTriggered = false;
	let knowledgeStage = 0;
	let knowledgeTowerIndex = 0;
	let nextTowerIndex: number | null = null;
	let reeling = false;
	let knowledgeHoverIndex: number | null = null;
	let lastKnowledgeHoverIndex: number | null = null;
	let lastHoveredIndex: number | null = null;
	const particleCenter = new THREE.Vector3(0, 0, 0);
	const particleSpawnPad = 10.0;
	const particleOuterPad = 14.0;
	const particleFlashDecay = 0.08;
	const particleFlashGreenDecay = 0.06;
	const particleExplosionDecay = 0.12;
	const particleWiggle = 0.08;
	const particleSizeMin = 0.2;
	const particleBaseColor = new THREE.Color();
	const particleFlashColor = new THREE.Color('#ff3b3b');
	const particleFlashGreenColor = new THREE.Color('#a6ff3a');
	let erosionLevels = [0, 0, 0, 0, 0, 0];
	let particlesActive = false;

	const pickLane = (size: number) => {
		const lanes = 3;
		const gap = size / lanes;
		const lane = Math.floor(Math.random() * lanes);
		return -size / 2 + gap * (lane + 0.5) + (Math.random() - 0.5) * gap * 0.12;
	};

	const particleVertexShader = `
		attribute float size;
		attribute vec3 color;
		varying vec3 vColor;
		void main() {
			vColor = color;
			vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
			gl_PointSize = size * (300.0 / -mvPosition.z);
			gl_Position = projectionMatrix * mvPosition;
		}
	`;

	const particleFragmentShader = `
		precision mediump float;
		varying vec3 vColor;
		void main() {
			float dist = distance(gl_PointCoord, vec2(0.5));
			if (dist > 0.5) discard;
			float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
			gl_FragColor = vec4(vColor, alpha);
		}
	`;

	const respawnParticle = (index: number) => {
		const i = index * 3;
		const halfX = wrapperSize[0] * 0.5 + particleSpawnPad;
		const halfY = wrapperSize[1] * 0.5 + particleSpawnPad;
		const halfZ = wrapperSize[2] * 0.5 + particleSpawnPad;
		particleMode[index] = Math.random() < 0.25 ? 1 : 0;
		const faceOptions = [1, 2, 4];
		const face = faceOptions[Math.floor(Math.random() * faceOptions.length)];
		let x = 0;
		let y = 0;
		let z = 0;
		if (face === 0) {
			x = halfX;
			y = pickLane(wrapperSize[1]);
			z = pickLane(wrapperSize[2]);
		} else if (face === 1) {
			x = -halfX;
			y = pickLane(wrapperSize[1]);
			z = pickLane(wrapperSize[2]);
		} else if (face === 2) {
			y = halfY;
			x = pickLane(wrapperSize[0]);
			z = pickLane(wrapperSize[2]);
		} else if (face === 3) {
			y = -halfY;
			x = pickLane(wrapperSize[0]);
			z = pickLane(wrapperSize[2]);
		} else if (face === 4) {
			z = halfZ;
			x = pickLane(wrapperSize[0]);
			y = pickLane(wrapperSize[1]);
		} else {
			z = -halfZ;
			x = pickLane(wrapperSize[0]);
			y = pickLane(wrapperSize[1]);
		}
		particlePositions[i] = x;
		particlePositions[i + 1] = y;
		particlePositions[i + 2] = z;

		const targetX = particleCenter.x + (Math.random() - 0.5) * 0.25;
		const targetY = particleCenter.y + (Math.random() - 0.5) * 0.25;
		const targetZ = particleCenter.z + (Math.random() - 0.5) * 0.25;
		const dirX = targetX - x;
		const dirY = targetY - y;
		const dirZ = targetZ - z;
		const len = Math.max(0.0001, Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ));
		const speed = 0.018 + Math.random() * 0.012;
		particleVelocities[i] = (dirX / len) * speed;
		particleVelocities[i + 1] = (dirY / len) * speed;
		particleVelocities[i + 2] = (dirZ / len) * speed;
		particleDrift[i] = (Math.random() - 0.5) * 0.006;
		particleDrift[i + 1] = (Math.random() - 0.5) * 0.006;
		particleDrift[i + 2] = (Math.random() - 0.5) * 0.006;
		particleFlash[index] = 0;
		particleFlashGreen[index] = 0;
		particleExplosion[index] = 0;
		particleRedLocked[index] = 0;
		particleSizes[index] = particleSizeMin;
		particleColors[i] = particleBaseColor.r;
		particleColors[i + 1] = particleBaseColor.g;
		particleColors[i + 2] = particleBaseColor.b;
	};

	const resetParticles = () => {
		for (let i = 0; i < particleCount; i += 1) {
			respawnParticle(i);
		}
		erosionLevels = [0, 0, 0, 0, 0, 0];
		particlePositionAttr.needsUpdate = true;
		particleColorAttr.needsUpdate = true;
		particleSizeAttr.needsUpdate = true;
	};

	for (let i = 0; i < particleCount; i += 1) {
		respawnParticle(i);
	}

	const applyCubeFocus = (index: number) => {
		const scales = [cubeScale1, cubeScale2, cubeScale3, cubeScale4, cubeScale5];
		const opacities = [cubeOpacity1, cubeOpacity2, cubeOpacity3, cubeOpacity4, cubeOpacity5];
		scales.forEach((store, i) => {
			store.set(i === index ? cubeLargeScale : cubeSmallScale, cubeFocusTween);
		});
		opacities.forEach((store, i) => {
			store.set(i === index ? cubeLargeOpacity : cubeSmallOpacity, cubeFocusTween);
		});
		cubeFocusIndexStore.set(index);
	};

	const ambientPalette = {
		hackgreen: {
			backgroundColor: '#050d08',
			gridColor: '#2fe28b',
			matrixBase: '#55e7a4',
			matrixHead: '#b7ffe3',
			accent: '#3be294',
			uiText: '#ffffff',
			uiLine: '#ffffff'
		},
		blueprint: {
			backgroundColor: '#0b1a3a',
			gridColor: '#4da6ff',
			matrixBase: '#6fb6ff',
			matrixHead: '#a8d9ff',
			accent: '#6ecbff',
			uiText: '#ffffff',
			uiLine: '#ffffff'
		},
		infrared: {
			backgroundColor: '#170607',
			gridColor: '#ff4d4d',
			matrixBase: '#ff6b6b',
			matrixHead: '#ffd1d1',
			accent: '#ff5a5a',
			uiText: '#ffffff',
			uiLine: '#ffffff'
		},
		ultraviolet: {
			backgroundColor: '#1a0f2a',
			gridColor: '#9f7bff',
			matrixBase: '#b297ff',
			matrixHead: '#e1d3ff',
			accent: '#b89cff',
			uiText: '#ffffff',
			uiLine: '#ffffff'
		},
		cleanblack: {
			backgroundColor: '#0b0b0b',
			gridColor: '#bfc5cc',
			matrixBase: '#dfe3e8',
			matrixHead: '#ffffff',
			accent: '#e6e6e6',
			uiText: '#ffffff',
			uiLine: '#ffffff'
		}
	} as const;

	const requestAmbientVariant = (variant: keyof typeof ambientPalette) => {
		if (!ambientPalette[variant]) return;
		ambientVariant.set(variant);
	};

	const clearCubeFocus = () => {
		const scales = [cubeScale1, cubeScale2, cubeScale3, cubeScale4, cubeScale5];
		const opacities = [cubeOpacity1, cubeOpacity2, cubeOpacity3, cubeOpacity4, cubeOpacity5];
		scales.forEach((store) => {
			store.set(cubeSmallScale, cubeFocusTween);
		});
		opacities.forEach((store) => {
			store.set(cubeSmallOpacity, cubeFocusTween);
		});
	};

	const setProgressForStep = (nextStep: number) => {
		if (nextStep <= 2) {
			progressStep.set(Math.max(0, nextStep - 1));
			return;
		}
		if (nextStep === 3) {
			progressStep.set(2);
			return;
		}
		if (nextStep === 4 || nextStep === 5) {
			progressStep.set(3);
			return;
		}
		if (nextStep === 6) {
			progressStep.set(5);
			return;
		}
		progressStep.set(-1);
	};

	$: currentAmbient = ambientPalette[$ambientVariant] ?? ambientPalette.blueprint;
	$: ambientTokens.set(currentAmbient);
	$: particleBaseColor.set(currentAmbient.matrixHead);
	$: wrapperLineColor = wrapperFlashColor ?? currentAmbient.matrixHead;
	$: wrapperFaceColor = wrapperFlashColor ?? currentAmbient.matrixBase;
	$: structureXValue = $structureX;

	$: if (step >= 5) {
		if (!wrapperVisible && !wrapperTimer) {
			wrapperTimer = setTimeout(() => {
				wrapperVisible = true;
				wrapperOpacity.set(1);
				wrapperTimer = null;
			}, structureTween.delay + structureTween.duration);
		}
	} else {
		if (wrapperTimer) clearTimeout(wrapperTimer);
		wrapperTimer = null;
		wrapperVisible = false;
		wrapperOpacity.set(0);
	}

	$: if (step < 7 && wrapperVisible) {
		wrapperOpacity.set(1);
	}

	$: if (step >= 7 && wrapperVisible) {
		wrapperOpacity.set(0);
	}

	$: if (step === 5) {
		if (wrapperVisible) {
			progressStep.set(4);
		} else {
			progressStep.set(3);
		}
	}

	$: if (step !== 6) {
		particlesActive = false;
	}

	$: if (step === 6 && wrapperVisible && !particlesActive) {
		particlesActive = true;
		resetParticles();
	}

	$: if (step < 6) {
		wrapperRotationSpeed = -0.004;
		wrapperFlashColor = null;
		wrapperFlashDone = false;
		wrapperSpinReady = false;
		wrapperSettled = false;
		if (wrapperFlashTimer) clearTimeout(wrapperFlashTimer);
		wrapperFlashTimer = null;
	}

	$: if (step >= 6) {
		wrapperRotationSpeed = 0;
		// Flash is triggered once the wrapper settles into its fixed pose.
	}

	const handlePointerDown = (event: PointerEvent) => {
		if (event.button !== 0) return;
		if ($viewMode === 'contact' && canvas) {
			const currentCamera = camera.current as THREE.Camera | undefined;
			const rect = canvas.getBoundingClientRect();
			const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
			const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
			pointer.set(x, y);
			if (currentCamera) {
				raycaster.setFromCamera(pointer, currentCamera);
				const targets = contactMeshes
					.map((mesh, index) => (mesh ? { mesh, index } : null))
					.filter((entry): entry is { mesh: THREE.Mesh; index: number } => Boolean(entry));
				if (targets.length) {
					const hits = raycaster.intersectObjects(
						targets.map((entry) => entry.mesh),
						false
					);
					if (hits.length) {
						const match = targets.find((entry) => entry.mesh === hits[0].object);
						const link = match ? contactLinks[match.index] : null;
						if (link && typeof window !== 'undefined') {
							window.open(link, '_blank', 'noopener');
						}
					}
				}
			}
			return;
		}
		isDragging = true;
		lastX = event.clientX;
		if (step >= 7 && canvas) {
			const currentCamera = camera.current as THREE.Camera | undefined;
			const rect = canvas.getBoundingClientRect();
			const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
			const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
			pointer.set(x, y);
			const region =
				x < -0.25 ? 'left' : x > 0.25 ? 'right' : ('root' as typeof activeRotation);
			if (currentCamera) {
				raycaster.setFromCamera(pointer, currentCamera);
				const hit = raycaster.ray.intersectPlane(rotationPlane, rotationHit);
				if (hit) {
					const centerX = structureXValue;
					const leftX = structureXValue - sideStructureOffset;
					const rightX = structureXValue + sideStructureOffset;
					const distLeft = Math.abs(rotationHit.x - leftX);
					const distRight = Math.abs(rotationHit.x - rightX);
					const distCenter = Math.abs(rotationHit.x - centerX);
					if (distLeft <= distCenter && distLeft <= distRight) {
						activeRotation = 'left';
					} else if (distRight <= distCenter) {
						activeRotation = 'right';
					} else {
						activeRotation = 'root';
					}
				} else {
					activeRotation = region;
				}
			} else {
				activeRotation = region;
			}
		} else {
			activeRotation = 'root';
		}
	};

	const handlePointerMove = (event: PointerEvent) => {
		if (isDragging) {
			const deltaX = event.clientX - lastX;
			lastX = event.clientX;
			const delta = deltaX * sensitivity;
			if (activeRotation === 'left') {
				leftTargetY += delta;
			} else if (activeRotation === 'right') {
				rightTargetY += delta;
			} else {
				rootTargetY += delta;
			}
		}
		updateHoverFromPointer(event);
	};

	const handlePointerUp = () => {
		isDragging = false;
		cubeHoverIndexStore.set(null);
		knowledgeHoverIndex = null;
		knowledgeHoverIndexStore.set(null);
		contactHoverIndex = null;
	};

	const startReel = (targetIndex: number) => {
		if (reeling || targetIndex === knowledgeTowerIndex) return;
		reeling = true;
		nextTowerIndex = targetIndex;
		knowledgeTowerHoverIndex = null;
		reelProgress.set(1, { duration: reelDuration, easing: cubicOut });
		setTimeout(() => {
			knowledgeTowerIndex = targetIndex;
			nextTowerIndex = null;
			reeling = false;
			reelProgress.set(0, { duration: 0 });
		}, reelDuration);
	};

	const applyMainStepDelta = (direction: 1 | -1) => {
		if ($viewMode !== 'main') return;
		if (direction > 0) {
			if (step < 3) {
				step = Math.min(3, step + 1);
				setProgressForStep(step);
				if (step < 3) {
					pillarStage = 0;
					pillarStageStore.set(pillarStage);
				} else {
					pillarStage = 1;
					pillarStageStore.set(pillarStage);
				}
				return;
			}
			if (step === 3 && pillarStage < 4) {
				pillarStage += 1;
				pillarStageStore.set(pillarStage);
				return;
			}
			if (step === 3 && pillarStage === 4) {
				step = 4;
				setProgressForStep(step);
				return;
			}
			if (step === 4) {
				step = 5;
				setProgressForStep(step);
				return;
			}
			if (step === 5) {
				step = 6;
				setProgressForStep(step);
				return;
			}
			if (step === 6) {
				step = 7;
				setProgressForStep(step);
				return;
			}
			if (step >= 7) return;
			step = 6;
			setProgressForStep(step);
			return;
		}

		if (step > 6) {
			step = 6;
			setProgressForStep(step);
			return;
		}
		if (step === 4) {
			step = 3;
			setProgressForStep(step);
			pillarStage = 4;
			pillarStageStore.set(pillarStage);
			return;
		}
		if (step === 3 && pillarStage > 0) {
			if (pillarStage === 1) {
				pillarStage = 0;
				pillarStageStore.set(pillarStage);
				step = 2;
				progressStep.set(1);
				return;
			}
			pillarStage -= 1;
			pillarStageStore.set(pillarStage);
			return;
		}
		step = Math.max(0, step - 1);
		setProgressForStep(step);
		if (step < 3) {
			pillarStage = 0;
			pillarStageStore.set(pillarStage);
		}
		if ($viewMode === 'main' && step === 0) {
			mainScrollStarted.set(false);
		}
	};

	const updateHoverFromPointer = (event: PointerEvent) => {
		// Raycasting is only meaningful in projects/knowledge; skip work in main view.
		if ($viewMode === 'main') return;
		const currentCamera = camera.current as THREE.Camera | undefined;
		if (!currentCamera || !canvas) return;
		const rect = canvas.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
		pointer.set(x, y);
		raycaster.setFromCamera(pointer, currentCamera);

		if ($viewMode === 'projects') {
			if ($cubeHoverLockStore) return;
			const targets = cubeMeshes.filter((mesh): mesh is THREE.Mesh => Boolean(mesh));
			if (!targets.length) return;
			const hits = raycaster.intersectObjects(targets, false);
			if (hits.length) {
				const hitIndex = targets.indexOf(hits[0].object as THREE.Mesh);
				cubeHoverIndexStore.set(hitIndex >= 0 ? hitIndex : null);
			} else {
				cubeHoverIndexStore.set(null);
			}
			return;
		}

		if ($viewMode === 'knowledge') {
			if (knowledgeStage >= 2) {
				const targets = knowledgeTowerMeshes.filter((mesh): mesh is THREE.Mesh => Boolean(mesh));
				if (!targets.length) return;
				const hits = raycaster.intersectObjects(targets, false);
				if (hits.length) {
					const hitIndex = targets.indexOf(hits[0].object as THREE.Mesh);
					knowledgeTowerHoverIndex = hitIndex >= 0 ? hitIndex : null;
				} else {
					knowledgeTowerHoverIndex = null;
				}
				return;
			}
			const targets = knowledgeMeshes.filter((mesh): mesh is THREE.Mesh => Boolean(mesh));
			if (!targets.length) return;
			const hits = raycaster.intersectObjects(targets, false);
			if (hits.length) {
				const hitIndex = targets.indexOf(hits[0].object as THREE.Mesh);
				knowledgeHoverIndex = hitIndex >= 0 ? hitIndex : null;
				knowledgeHoverIndexStore.set(knowledgeHoverIndex);
			} else {
				knowledgeHoverIndex = null;
				knowledgeHoverIndexStore.set(null);
			}
			return;
		}

		if ($viewMode === 'contact') {
			const targets = contactMeshes
				.map((mesh, index) => (mesh ? { mesh, index } : null))
				.filter((entry): entry is { mesh: THREE.Mesh; index: number } => Boolean(entry));
			if (!targets.length) {
				contactHoverIndex = null;
				return;
			}
			const hits = raycaster.intersectObjects(
				targets.map((entry) => entry.mesh),
				false
			);
			if (hits.length) {
				const match = targets.find((entry) => entry.mesh === hits[0].object);
				contactHoverIndex = match ? match.index : null;
			} else {
				contactHoverIndex = null;
			}
		}
	};

	const handleWheel = (event: WheelEvent) => {
		const now = performance.now();
		if (now - lastWheelTime < wheelCooldownMs) return;
		lastWheelTime = now;

		// Projects is hover-driven; scroll input is intentionally ignored here.
		if ($viewMode === 'projects') return;
		if ($viewMode === 'knowledge') {
			if (event.deltaY > 0) {
				if (!knowledgeTriggered) {
					knowledgeTriggered = true;
					knowledgeStage = 1;
					knowledgeAppear.set(1);
					knowledgeDrop.set(0);
					towerAppear.set(0);
				} else if (knowledgeStage === 1) {
					knowledgeStage = 2;
					knowledgeDrop.set(1);
					towerAppear.set(1);
					knowledgeHoverIndex = null;
					knowledgeHoverIndexStore.set(null);
				} else if (knowledgeStage === 2) {
					knowledgeStage = 3;
				} else if (knowledgeStage === 3) {
					knowledgeStage = 4;
				}
			} else if (event.deltaY < 0) {
				if (knowledgeStage === 4) {
					knowledgeStage = 3;
				} else if (knowledgeStage === 3) {
					knowledgeStage = 2;
				} else if (knowledgeStage === 2) {
					knowledgeStage = 1;
					knowledgeDrop.set(0);
					towerAppear.set(0);
					knowledgeTowerHoverIndex = null;
				} else if (knowledgeTriggered) {
					knowledgeTriggered = false;
					knowledgeStage = 0;
					knowledgeAppear.set(0);
					knowledgeDrop.set(0);
					towerAppear.set(0);
					knowledgeHoverIndex = null;
					knowledgeHoverIndexStore.set(null);
				}
			}
			return;
		}

	if ($viewMode === 'main') {
		mainScrollStarted.set(true);
		lastMainScrollAt.set(Date.now());
	}

		if ($viewMode === 'projects') {
			const direction = event.deltaY > 0 ? 1 : -1;
			cubeFocusIndex = (cubeFocusIndex + direction + 5) % 5;
			applyCubeFocus(cubeFocusIndex);
		}

		if (event.deltaY > 0) {
			applyMainStepDelta(1);
		}
		if (event.deltaY < 0) {
			applyMainStepDelta(-1);
		}
	};

	$: if ($stepCommand) {
		if ($viewMode === 'main') {
			mainScrollStarted.set(true);
			lastMainScrollAt.set(Date.now());
			applyMainStepDelta($stepCommand === 'next' ? 1 : -1);
		}
		stepCommand.set(null);
	}

onMount(() => {
	setProgressForStep(step);
});

export { handleWheel, handlePointerDown, handlePointerMove, handlePointerUp, requestAmbientVariant };

	useTask(() => {
		if (!rootGroup) return;
		if (!isDragging) {
			rootTargetY += idleRotationSpeed;
			if (step >= 7) {
				leftTargetY += sideIdleRotationSpeed;
				rightTargetY -= sideIdleRotationSpeed;
			}
		}
		rootCurrentY += (rootTargetY - rootCurrentY) * damping;
		rootGroup.rotation.y = rootCurrentY;
		if (wrapperGroup) {
			if (step >= 6) {
				if (wrapperSettled) {
					wrapperGroup.quaternion.copy(wrapperFixedQuat);
					if ($viewMode === 'main' && step === 6) {
						const baseR = particleBaseColor.r;
						const baseG = particleBaseColor.g;
						const baseB = particleBaseColor.b;
						const flashR = particleFlashColor.r;
						const flashG = particleFlashColor.g;
						const flashB = particleFlashColor.b;
						const greenR = particleFlashGreenColor.r;
						const greenG = particleFlashGreenColor.g;
						const greenB = particleFlashGreenColor.b;
						const halfX = wrapperSize[0] * 0.5;
						const halfY = wrapperSize[1] * 0.5;
						const halfZ = wrapperSize[2] * 0.5;
						const outerX = halfX + particleOuterPad;
						const outerY = halfY + particleOuterPad;
						const outerZ = halfZ + particleOuterPad;
						const centerThreshold = 0.08;
						const maxDist = Math.max(outerX, outerY, outerZ);
						for (let i = 0; i < particleCount; i += 1) {
							const idx = i * 3;
							const wiggle = Math.sin((idx + performance.now() * 0.002) * 0.7) * particleWiggle;
							if (particleMode[i] !== 3) {
								particlePositions[idx] += particleVelocities[idx];
								particlePositions[idx + 1] += particleVelocities[idx + 1];
								particlePositions[idx + 2] += particleVelocities[idx + 2];
								particlePositions[idx] += particleDrift[idx] * wiggle;
								particlePositions[idx + 1] += particleDrift[idx + 1] * wiggle;
								particlePositions[idx + 2] += particleDrift[idx + 2] * wiggle;
							}
							const x = particlePositions[idx];
							const y = particlePositions[idx + 1];
							const z = particlePositions[idx + 2];
							if (particleMode[i] === 1) {
								if (Math.abs(x) < halfX && Math.abs(y) < halfY && Math.abs(z) < halfZ) {
									particleMode[i] = 2;
									particleFlashGreen[i] = 1;
									particleVelocities[idx] *= 0.45;
									particleVelocities[idx + 1] *= 0.45;
									particleVelocities[idx + 2] *= 0.45;
								}
							} else if (particleMode[i] === 0) {
								if (Math.abs(x) < halfX && Math.abs(y) < halfY && Math.abs(z) < halfZ) {
									const dx = halfX - Math.abs(x);
									const dy = halfY - Math.abs(y);
									const dz = halfZ - Math.abs(z);
									if (dx <= dy && dx <= dz) {
										particleVelocities[idx] *= -1;
										particlePositions[idx] = Math.sign(x) * halfX;
										erosionLevels[x >= 0 ? 0 : 1] = 1;
									} else if (dy <= dz) {
										particleVelocities[idx + 1] *= -1;
										particlePositions[idx + 1] = Math.sign(y) * halfY;
										erosionLevels[y >= 0 ? 2 : 3] = 1;
									} else {
										particleVelocities[idx + 2] *= -1;
										particlePositions[idx + 2] = Math.sign(z) * halfZ;
										erosionLevels[z >= 0 ? 4 : 5] = 1;
									}
									particleFlash[i] = 1;
									particleRedLocked[i] = 1;
								} else if (Math.abs(x) > outerX || Math.abs(y) > outerY || Math.abs(z) > outerZ) {
									respawnParticle(i);
								}
							} else if (particleMode[i] === 2) {
								const distSq = x * x + y * y + z * z;
								if (distSq < centerThreshold) {
									particleMode[i] = 3;
									particleExplosion[i] = 1;
								} else {
									const dist = Math.max(0.001, Math.sqrt(distSq));
									const accel = 1.025 + (1 - Math.min(1, dist / maxDist)) * 0.05;
									const dirX = -x / dist;
									const dirY = -y / dist;
									const dirZ = -z / dist;
									particleVelocities[idx] = particleVelocities[idx] * 0.92 + dirX * 0.08;
									particleVelocities[idx + 1] = particleVelocities[idx + 1] * 0.92 + dirY * 0.08;
									particleVelocities[idx + 2] = particleVelocities[idx + 2] * 0.92 + dirZ * 0.08;
									particleVelocities[idx] *= accel;
									particleVelocities[idx + 1] *= accel;
									particleVelocities[idx + 2] *= accel;
								}
							}
							if (particleMode[i] === 3) {
								particleExplosion[i] = Math.max(0, particleExplosion[i] - particleExplosionDecay);
								if (particleExplosion[i] === 0) {
									respawnParticle(i);
									continue;
								}
							}
							if (particleMode[i] === 2) {
								particleFlashGreen[i] = Math.max(0, particleFlashGreen[i] - particleFlashGreenDecay);
							}
							if (particleFlashGreen[i] > 0) {
								particleColors[idx] = greenR;
								particleColors[idx + 1] = greenG;
								particleColors[idx + 2] = greenB;
							} else if (particleFlash[i] > 0 || particleRedLocked[i] === 1) {
								particleFlash[i] = Math.max(0, particleFlash[i] - particleFlashDecay);
								particleColors[idx] = flashR;
								particleColors[idx + 1] = flashG;
								particleColors[idx + 2] = flashB;
							} else {
								particleColors[idx] = baseR;
								particleColors[idx + 1] = baseG;
								particleColors[idx + 2] = baseB;
							}
						}
						erosionLevels = erosionLevels.map((level) => Math.max(0, level - 0.06));
						particlePositionAttr.needsUpdate = true;
						particleColorAttr.needsUpdate = true;
					}
					return;
				}
				const currentQuat = wrapperGroup.quaternion;
				currentQuat.slerp(wrapperFixedQuat, 0.04);
				if (currentQuat.angleTo(wrapperFixedQuat) < 0.015) {
					wrapperGroup.quaternion.copy(wrapperFixedQuat);
					wrapperSettled = true;
					if (!wrapperFlashDone) {
						wrapperFlashDone = true;
						wrapperFlashColor = '#7cff3a';
						if (wrapperFlashTimer) clearTimeout(wrapperFlashTimer);
						wrapperFlashTimer = setTimeout(() => {
							wrapperFlashColor = null;
							wrapperFlashTimer = null;
						}, 500);
					}
				}
			} else {
				if (!wrapperSpinReady && wrapperVisible) {
					wrapperSpin.set(
						(0.003 + Math.random() * 0.004) * (Math.random() > 0.5 ? 1 : -1),
						(0.003 + Math.random() * 0.004) * (Math.random() > 0.5 ? 1 : -1),
						(0.002 + Math.random() * 0.003) * (Math.random() > 0.5 ? 1 : -1)
					);
					wrapperSpinReady = true;
				}
				wrapperGroup.rotation.x += wrapperSpin.x;
				wrapperGroup.rotation.y += wrapperSpin.y;
				wrapperGroup.rotation.z += wrapperSpin.z;
			}
		}
		if (step >= 7) {
			if (sideLeftGroup) {
				leftCurrentY += (leftTargetY - leftCurrentY) * damping;
				sideLeftGroup.rotation.y = leftCurrentY;
			}
			if (sideRightGroup) {
				rightCurrentY += (rightTargetY - rightCurrentY) * damping;
				sideRightGroup.rotation.y = rightCurrentY;
			}
		}
	});

	$: pillarY1.set(step >= 3 && pillarStage >= 1 ? pillarVisibleY : pillarHiddenY);
	$: pillarY2.set(step >= 3 && pillarStage >= 2 ? pillarVisibleY : pillarHiddenY);
	$: pillarY3.set(step >= 3 && pillarStage >= 3 ? pillarVisibleY : pillarHiddenY);
	$: pillarY4.set(step >= 3 && pillarStage >= 4 ? pillarVisibleY : pillarHiddenY);
	$: foundationY.set(step >= 2 ? foundationVisibleY : foundationHiddenY);
$: roofX.set(step >= 4 ? roofVisibleX : roofHiddenX);
$: structureX.set(step >= 7 ? structureHiddenX : step >= 5 ? structureVisibleX : structureHiddenX, structureTween);
$: structureYOffset.set(step >= 5 ? structureLiftY : 0, structureTween);
	$: sceneYOffset.set($viewMode === 'projects' ? -2.5 : 0);

	$: if ($viewMode !== 'knowledge') {
		knowledgeTriggered = false;
		knowledgeStage = 0;
		knowledgeAppear.set(0);
		knowledgeDrop.set(0);
		towerAppear.set(0);
		reelProgress.set(0, { duration: 0 });
		reeling = false;
		knowledgeTowerIndex = 0;
		nextTowerIndex = null;
		knowledgeHoverIndex = null;
		knowledgeHoverIndexStore.set(null);
		knowledgeTowerHoverIndex = null;
	}

	$: if ($viewMode === 'knowledge' && knowledgeStage >= 2) {
		const desiredIndex = Math.min(knowledgeStage - 2, 2);
		startReel(desiredIndex);
	}

	$: if ($viewMode !== 'contact') {
		contactHoverIndex = null;
	}

	$: if ($viewMode === 'knowledge' && knowledgeHoverIndex !== lastKnowledgeHoverIndex) {
		lastKnowledgeHoverIndex = knowledgeHoverIndex;
		const scales = [
			knowledgeHoverScale1,
			knowledgeHoverScale2,
			knowledgeHoverScale3,
			knowledgeHoverScale4,
			knowledgeHoverScale5
		];
		const opacities = [
			knowledgeHoverOpacity1,
			knowledgeHoverOpacity2,
			knowledgeHoverOpacity3,
			knowledgeHoverOpacity4,
			knowledgeHoverOpacity5
		];
		scales.forEach((store, index) => {
			store.set(knowledgeHoverIndex === index ? 5 : 1, knowledgeHoverTween);
		});
		opacities.forEach((store, index) => {
			store.set(knowledgeHoverIndex === index ? 1.6 : 1, knowledgeHoverTween);
		});
	}

	// Projects mode is hover-driven only; no default or progressive focus exists.
	$: if ($viewMode === 'projects') {
		const projectsActive = $cubeHoverIndexStore !== null || $cubeHoverLockStore;
		if ($cubeHoverIndexStore !== null) {
			lastHoveredIndex = $cubeHoverIndexStore;
		}
		if (projectsActive) {
			const activeIndex = $cubeHoverIndexStore ?? lastHoveredIndex;
			if (activeIndex !== null) applyCubeFocus(activeIndex);
		} else {
			lastHoveredIndex = null;
			clearCubeFocus();
		}
		cubeX1.set(cubeTargetX1, { ...cubeTween, delay: 0 });
		cubeX2.set(cubeTargetX2, { ...cubeTween, delay: 120 });
		cubeX3.set(cubeTargetX3, { ...cubeTween, delay: 240 });
		cubeX4.set(cubeTargetX4, { ...cubeTween, delay: 360 });
		cubeX5.set(cubeTargetX5, { ...cubeTween, delay: 480 });
		cubeY.set(cubeCenterY, { ...cubeTween, delay: 0 });
	} else {
		cubeX1.set(0, { ...cubeTween, delay: 0 });
		cubeX2.set(0, { ...cubeTween, delay: 0 });
		cubeX3.set(0, { ...cubeTween, delay: 0 });
		cubeX4.set(0, { ...cubeTween, delay: 0 });
		cubeX5.set(0, { ...cubeTween, delay: 0 });
		cubeY.set(cubeHiddenY, { ...cubeTween, delay: 0 });
	}
</script>

<T.Color attach="background" args={[currentAmbient.backgroundColor]} />

<T.PerspectiveCamera makeDefault position={[0, 2.5, 6]} fov={45} />

<T.AmbientLight intensity={0.4} />
<T.DirectionalLight position={[4, 6, 3]} intensity={0.6} />

<BackgroundGrid lineColor={currentAmbient.gridColor} />

<T.Group
	name="StructureRoot"
	bind:ref={rootGroup}
	visible={$viewMode === 'main'}
	scale={[0.9, 0.9, 0.9]}
	position={[$structureX, 0.8 + $sceneYOffset + $structureYOffset, 0]}
>
	<Floor
		visible={step >= 1}
		hovered={$hoveredPart === 'floor'}
		onEnter={() => hoveredPart.set('floor')}
		onLeave={() => hoveredPart.set(null)}
	/>
	<T.Group position={[0, $foundationY, 0]}>
		<Foundation
			visible={step >= 2}
			hovered={$hoveredPart === 'foundation'}
			onEnter={() => hoveredPart.set('foundation')}
			onLeave={() => hoveredPart.set(null)}
		/>
	</T.Group>
	<T.Group position={[-0.6, $pillarY1, -0.6]}>
		<Pillar
			visible={step >= 3 && pillarStage >= 1}
			hovered={$hoveredPart === 'pillar'}
			onEnter={() => hoveredPart.set('pillar')}
			onLeave={() => hoveredPart.set(null)}
		/>
	</T.Group>
	<T.Group position={[0.6, $pillarY2, -0.6]}>
		<Pillar
			visible={step >= 3 && pillarStage >= 2}
			hovered={$hoveredPart === 'pillar'}
			onEnter={() => hoveredPart.set('pillar')}
			onLeave={() => hoveredPart.set(null)}
		/>
	</T.Group>
	<T.Group position={[-0.6, $pillarY3, 0.6]}>
		<Pillar
			visible={step >= 3 && pillarStage >= 3}
			hovered={$hoveredPart === 'pillar'}
			onEnter={() => hoveredPart.set('pillar')}
			onLeave={() => hoveredPart.set(null)}
		/>
	</T.Group>
	<T.Group position={[0.6, $pillarY4, 0.6]}>
		<Pillar
			visible={step >= 3 && pillarStage >= 4}
			hovered={$hoveredPart === 'pillar'}
			onEnter={() => hoveredPart.set('pillar')}
			onLeave={() => hoveredPart.set(null)}
		/>
	</T.Group>
	<T.Group position={[$roofX, 0, 0]}>
		<Roof
			visible={step >= 4}
			hovered={$hoveredPart === 'roof'}
			onEnter={() => hoveredPart.set('roof')}
			onLeave={() => hoveredPart.set(null)}
		/>
	</T.Group>
</T.Group>

{#if $viewMode !== 'knowledge' && $viewMode !== 'projects' && $viewMode !== 'contact' && $viewMode !== 'blog' && step >= 7}
	<T.Group
		bind:ref={sideRightGroup}
		position={[
			$structureX + sideStructureOffset,
			0.8 + $sceneYOffset + $structureYOffset,
			0
		]}
		scale={[0.9, 0.9, 0.9]}
	>
		<Floor visible={step >= 1} />
		<T.Group position={[0, $foundationY, 0]}>
			<Foundation visible={step >= 2} />
		</T.Group>
		<T.Group position={[-0.6, $pillarY1, -0.6]}>
			<Pillar visible={step >= 3 && pillarStage >= 1} />
		</T.Group>
		<T.Group position={[0.6, $pillarY2, -0.6]}>
			<Pillar visible={step >= 3 && pillarStage >= 2} />
		</T.Group>
		<T.Group position={[-0.6, $pillarY3, 0.6]}>
			<Pillar visible={step >= 3 && pillarStage >= 3} />
		</T.Group>
		<T.Group position={[0.6, $pillarY4, 0.6]}>
			<Pillar visible={step >= 3 && pillarStage >= 4} />
		</T.Group>
		<T.Group position={[$roofX, 0, 0]}>
			<Roof visible={step >= 4} />
		</T.Group>
	</T.Group>
	<T.Group
		bind:ref={sideLeftGroup}
		position={[
			$structureX - sideStructureOffset,
			0.8 + $sceneYOffset + $structureYOffset,
			0
		]}
		scale={[0.9, 0.9, 0.9]}
	>
		<Floor visible={step >= 1} />
		<T.Group position={[0, $foundationY, 0]}>
			<Foundation visible={step >= 2} />
		</T.Group>
		<T.Group position={[-0.6, $pillarY1, -0.6]}>
			<Pillar visible={step >= 3 && pillarStage >= 1} />
		</T.Group>
		<T.Group position={[0.6, $pillarY2, -0.6]}>
			<Pillar visible={step >= 3 && pillarStage >= 2} />
		</T.Group>
		<T.Group position={[-0.6, $pillarY3, 0.6]}>
			<Pillar visible={step >= 3 && pillarStage >= 3} />
		</T.Group>
		<T.Group position={[0.6, $pillarY4, 0.6]}>
			<Pillar visible={step >= 3 && pillarStage >= 4} />
		</T.Group>
		<T.Group position={[$roofX, 0, 0]}>
			<Roof visible={step >= 4} />
		</T.Group>
	</T.Group>
{/if}

{#if $viewMode === 'main' && wrapperVisible}
	<T.Group
		bind:ref={wrapperGroup}
		position={[$structureX, 0.8 + $sceneYOffset + $structureYOffset + wrapperOffsetY, 0]}
	>
		<T.LineSegments geometry={wrapperEdges} raycast={() => null}>
			<T.LineBasicMaterial
				color={wrapperLineColor}
				transparent
				opacity={0.7 * $wrapperOpacity}
			/>
		</T.LineSegments>
		<T.Mesh position={[0, 0, wrapperHalf[2]]} raycast={() => null}>
			<T.PlaneGeometry args={[wrapperSize[0], wrapperSize[1]]} />
			<T.MeshStandardMaterial
				color={wrapperFaceColor}
				emissive={wrapperFaceColor}
				emissiveIntensity={0.5 + erosionLevels[4] * 0.9}
				transparent
				opacity={(0.12 + erosionLevels[4] * 0.12) * $wrapperOpacity}
				depthWrite={false}
			/>
		</T.Mesh>
		<T.Mesh position={[0, 0, -wrapperHalf[2]]} rotation={[0, Math.PI, 0]} raycast={() => null}>
			<T.PlaneGeometry args={[wrapperSize[0], wrapperSize[1]]} />
			<T.MeshStandardMaterial
				color={wrapperFaceColor}
				emissive={wrapperFaceColor}
				emissiveIntensity={0.5 + erosionLevels[5] * 0.9}
				transparent
				opacity={(0.12 + erosionLevels[5] * 0.12) * $wrapperOpacity}
				depthWrite={false}
			/>
		</T.Mesh>
		<T.Mesh position={[wrapperHalf[0], 0, 0]} rotation={[0, Math.PI / 2, 0]} raycast={() => null}>
			<T.PlaneGeometry args={[wrapperSize[2], wrapperSize[1]]} />
			<T.MeshStandardMaterial
				color={wrapperFaceColor}
				emissive={wrapperFaceColor}
				emissiveIntensity={0.5 + erosionLevels[0] * 0.9}
				transparent
				opacity={(0.12 + erosionLevels[0] * 0.12) * $wrapperOpacity}
				depthWrite={false}
			/>
		</T.Mesh>
		<T.Mesh position={[-wrapperHalf[0], 0, 0]} rotation={[0, -Math.PI / 2, 0]} raycast={() => null}>
			<T.PlaneGeometry args={[wrapperSize[2], wrapperSize[1]]} />
			<T.MeshStandardMaterial
				color={wrapperFaceColor}
				emissive={wrapperFaceColor}
				emissiveIntensity={0.5 + erosionLevels[1] * 0.9}
				transparent
				opacity={(0.12 + erosionLevels[1] * 0.12) * $wrapperOpacity}
				depthWrite={false}
			/>
		</T.Mesh>
		<T.Mesh position={[0, wrapperHalf[1], 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
			<T.PlaneGeometry args={[wrapperSize[0], wrapperSize[2]]} />
			<T.MeshStandardMaterial
				color={wrapperFaceColor}
				emissive={wrapperFaceColor}
				emissiveIntensity={0.5 + erosionLevels[2] * 0.9}
				transparent
				opacity={(0.12 + erosionLevels[2] * 0.12) * $wrapperOpacity}
				depthWrite={false}
			/>
		</T.Mesh>
		<T.Mesh position={[0, -wrapperHalf[1], 0]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
			<T.PlaneGeometry args={[wrapperSize[0], wrapperSize[2]]} />
			<T.MeshStandardMaterial
				color={wrapperFaceColor}
				emissive={wrapperFaceColor}
				emissiveIntensity={0.5 + erosionLevels[3] * 0.9}
				transparent
				opacity={(0.12 + erosionLevels[3] * 0.12) * $wrapperOpacity}
				depthWrite={false}
			/>
		</T.Mesh>
	</T.Group>
{/if}

{#if $viewMode === 'main' && step === 6 && wrapperVisible}
	<T.Points
		geometry={particleGeometry}
		position={[$structureX, 0.8 + $sceneYOffset + $structureYOffset + wrapperOffsetY, 0]}
		raycast={() => null}
	>
		<T.ShaderMaterial
			vertexShader={particleVertexShader}
			fragmentShader={particleFragmentShader}
			transparent
			depthWrite={false}
		/>
	</T.Points>
{/if}

<ContactScene
	visible={$viewMode === 'contact'}
	hoverIndex={contactHoverIndex}
	contactMeshes={contactMeshes}
	bind:contactLinks
/>

{#if $viewMode === 'knowledge'}
	{@const dropFactor = 1 - $knowledgeDrop}
	<T.Group
		name="KnowledgeFoundations"
		position={[0, knowledgeY - $knowledgeDrop * knowledgeDropDistance, 0]}
	>
		{#each [-2, -1, 0, 1, 2] as slot}
			{@const index = slot + 2}
			<T.Group
				position={[slot * knowledgeSpacing, 0, 0]}
				scale={[
					knowledgeScale[0] * (knowledgePopMin + $knowledgeAppear * (1 - knowledgePopMin)),
					knowledgeScale[1] *
						(knowledgePopMin + $knowledgeAppear * (1 - knowledgePopMin)) *
						(index === 0
							? $knowledgeHoverScale1
							: index === 1
								? $knowledgeHoverScale2
								: index === 2
									? $knowledgeHoverScale3
									: index === 3
										? $knowledgeHoverScale4
										: $knowledgeHoverScale5),
					knowledgeScale[2] * (knowledgePopMin + $knowledgeAppear * (1 - knowledgePopMin))
				]}
			>
				<Foundation
					bind:meshRef={knowledgeMeshes[index]}
					visible={$knowledgeAppear > 0.01 && dropFactor > 0.02}
					opacity={
						0.18 *
						$knowledgeAppear *
						dropFactor *
						(index === 0
							? $knowledgeHoverOpacity1
							: index === 1
								? $knowledgeHoverOpacity2
								: index === 2
									? $knowledgeHoverOpacity3
									: index === 3
										? $knowledgeHoverOpacity4
										: $knowledgeHoverOpacity5)
					}
				/>
			</T.Group>
		{/each}
	</T.Group>
	{#if knowledgeStage >= 2}
		{@const currentConfig = knowledgeTowerConfigs[knowledgeTowerIndex]}
		{@const direction =
			nextTowerIndex !== null && nextTowerIndex < knowledgeTowerIndex ? -1 : 1}
		{@const t = $reelProgress}
		{@const currentX = reeling ? t * reelOffset * direction : 0}
		{@const nextX = reeling && nextTowerIndex !== null ? (t - 1) * reelOffset * direction : 0}
		<T.Group
			name="KnowledgeTowers"
			position={[0, towerBaseY + (1 - $towerAppear) * -4, 0.2]}
		>
			<KnowledgeTower
				title={currentConfig.title}
				body={currentConfig.body}
				position={[currentX, 0, 0]}
				appear={$towerAppear}
				hovered={knowledgeTowerHoverIndex === 0}
				bind:meshRef={knowledgeTowerMeshes[0]}
				width={currentConfig.width}
				height={currentConfig.height}
				depth={currentConfig.depth}
				titlePlaneWidth={currentConfig.titlePlaneWidth}
				bodyPlaneWidth={currentConfig.bodyPlaneWidth}
				bodyPlaneHeight={currentConfig.bodyPlaneHeight}
				titleCanvasWidth={currentConfig.titleCanvasWidth ?? 800}
				titleCanvasHeight={currentConfig.titleCanvasHeight ?? 180}
				titleFontSize={currentConfig.titleFontSize ?? 30}
				bodyCanvasWidth={currentConfig.bodyCanvasWidth ?? 900}
				bodyCanvasHeight={currentConfig.bodyCanvasHeight ?? 700}
				bodyFontSize={currentConfig.bodyFontSize}
				maxChars={currentConfig.maxChars}
				bodyAlign={currentConfig.bodyAlign ?? 'left'}
				titleOffsetX={0}
				bodyOffsetX={0.7}
				bodyOffsetY={0.02}
				typingSpeedMs={4}
			/>
			{#if nextTowerIndex !== null}
				{@const nextConfig = knowledgeTowerConfigs[nextTowerIndex]}
				<KnowledgeTower
					title={nextConfig.title}
					body={nextConfig.body}
					position={[nextX, 0, 0]}
					appear={$towerAppear}
					hovered={knowledgeTowerHoverIndex === 1}
					bind:meshRef={knowledgeTowerMeshes[1]}
					width={nextConfig.width}
					height={nextConfig.height}
					depth={nextConfig.depth}
					titlePlaneWidth={nextConfig.titlePlaneWidth}
					bodyPlaneWidth={nextConfig.bodyPlaneWidth}
					bodyPlaneHeight={nextConfig.bodyPlaneHeight}
					titleCanvasWidth={nextConfig.titleCanvasWidth ?? 800}
					titleCanvasHeight={nextConfig.titleCanvasHeight ?? 180}
					titleFontSize={nextConfig.titleFontSize ?? 30}
					bodyCanvasWidth={nextConfig.bodyCanvasWidth ?? 900}
					bodyCanvasHeight={nextConfig.bodyCanvasHeight ?? 700}
					bodyFontSize={nextConfig.bodyFontSize}
					maxChars={nextConfig.maxChars}
					bodyAlign={nextConfig.bodyAlign ?? 'left'}
					titleOffsetX={0}
					bodyOffsetX={0.7}
					bodyOffsetY={0.02}
					typingSpeedMs={4}
				/>
			{/if}
		</T.Group>
	{/if}
{/if}

{#if $viewMode === 'projects'}
	<T.Group name="ProjectCubes">
		{#each [0, 1, 2, 3, 4] as i}
			<Cube
				position={[
					i === 0 ? $cubeX1 : i === 1 ? $cubeX2 : i === 2 ? $cubeX3 : i === 3 ? $cubeX4 : $cubeX5,
					$cubeY,
					0
				]}
				bind:meshRef={cubeMeshes[i]}
				glitch={i === 2 || i === 4}
				edgeColor={i === 2 || i === 4 ? '#ff3b30' : '#ffffff'}
				faceBinary={i === 2 || i === 4}
				rotationDir={
					i === 0
						? [1, 1]
						: i === 1
							? [-1, 1]
							: i === 2
								? [1, -1]
								: i === 3
									? [-1, -1]
									: [1, 1]
				}
				scale={
					i === 0
						? $cubeScale1
						: i === 1
							? $cubeScale2
							: i === 2
								? $cubeScale3
								: i === 3
										? $cubeScale4
										: $cubeScale5
				}
				opacity={
					i === 0
						? $cubeOpacity1
						: i === 1
							? $cubeOpacity2
							: i === 2
								? $cubeOpacity3
								: i === 3
										? $cubeOpacity4
										: $cubeOpacity5
				}
			/>
		{/each}
	</T.Group>
{/if}
