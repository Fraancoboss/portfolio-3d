# 02 - Tech Stack Decisions

## Core Stack
- Svelte / SvelteKit for UI, state, and overlays
- Three.js as conceptual foundation (scene graph, materials, raycasting)
- Threlte as declarative layer over Three.js

## Rationale
- Three.js provides full control over rendering, raycasting, and materials.
- Threlte converts imperative Three.js setup into declarative components aligned with Svelte.
- Svelte handles state reactivity without external state libraries.

## 3D Asset Workflow
- Blender produces GLB/glTF assets when needed.
- Threlte GLTF CLI converts GLB into Svelte components for reuse and inspection.
- Geometry and materials are shared when possible to reduce memory and draw calls.

## Interaction Model Choices
- No OrbitControls: interaction is object-centric, not camera-centric.
- Custom drag rotation on the root Group for precise control.
- Mouse wheel maps to normalized progress for sequential construction.

## Optional Tools (Not Required for MVP)
These are mentioned in sources but only used if they align with the blueprint goals.
- @threlte/extras for utilities like contact shadows
- @threlte/studio for real-time inspection during development
- @threlte/flex for spatial layout if the scene grows

