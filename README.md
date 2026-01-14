# Project Overview
This repository contains a 3D architectural portfolio with a blueprint aesthetic, built with Svelte, Three.js, and Threlte. It presents a modular structure that is constructed progressively and explored through object-centric interaction. The project prioritizes architectural clarity, system design, and maintainability over generic visual effects.

# Design Goals
- Maintain a strict separation of concerns between scene orchestration, 3D components, and UI overlays.
- Keep interaction object-centric (rotate the structure, not the camera).
- Preserve a technical blueprint visual language: dark background, white lines, translucent volumes.
- Favor deterministic, readable behavior over complex camera systems or exploratory navigation.

Constraints:
- No OrbitControls or camera navigation.
- No features outside the blueprint architectural scope.
- No generic demo effects unrelated to the system.

# Core Features
- Modular structure composed of Floor, Foundation, Pillar, and Roof components.
- Progressive construction driven by a normalized state value.
- Object-centric interaction: drag rotation, wheel-based progress, and hover feedback.
- Blueprint rendering style with continuous and dashed edges for visible and hidden geometry.

# Architectural Overview
- Scene / Components / UI separation with explicit responsibilities.
- Three.js as the conceptual base (scene graph, materials, raycasting, depth).
- Threlte as the declarative rendering layer.
- Svelte for global state, reactivity, and UI overlays.

# Interaction Model
- Drag rotation applies to the root Group, not the camera.
- Mouse wheel maps to a normalized progress value (0..1).
- Hover uses real raycasting and updates Svelte state to drive UI overlays.

# Documentation
The full technical documentation is in `docs/`.
Key entry points:
- `docs/00-introduction.md`
- `docs/01-architecture-overview.md`
- `docs/03-scene-architecture.md`
- `docs/05-interaction-model.md`
- `docs/08-wireframe-and-blueprint-style.md`
- `docs/11-development-phases.md`

# Development Status and Phases
The project is organized into explicit phases covering scene setup, component implementation, wireframe styling, interaction, progressive construction, hover overlays, and polish. See `docs/11-development-phases.md` for the current phase definitions and completion criteria.
Current phase: not specified in `docs/11-development-phases.md`.

# Non-Goals
- Camera navigation systems or OrbitControls.
- Effects that dilute the blueprint technical aesthetic.
- Unscoped interactive features not aligned with architectural intent.

# How to Run
Install dependencies:

```sh
npm install
```

Run the development server:

```sh
npm run dev
```

# Audience
This project is intended for engineers and designers who need a clear, maintainable 3D web architecture, and for reviewers evaluating system design, interaction modeling, and technical presentation.
