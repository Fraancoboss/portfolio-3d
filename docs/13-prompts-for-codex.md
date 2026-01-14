# 13 - Prompts for Codex

Use these prompts to generate code while keeping alignment with the project constraints.

## Prompt - Scene Scaffold
"Create a Threlte Scene.svelte that renders a Canvas with a static camera, basic lights, and a root Group. The Group must contain Floor, Foundation, Pillar, and Roof components. Do not add OrbitControls. Provide clean prop wiring for progress (0..1) and rotation state."

## Prompt - Rotation Interaction
"Implement object-centric rotation: left click + drag should rotate the root Group around Y. Do not move the camera. Add damping so the rotation eases toward a target. Provide Svelte state and the Threlte wiring."

## Prompt - Progress Mapping
"Implement mouse wheel input to control a normalized progress value (0..1). Clamp bounds, and map progress to staged visibility for Floor -> Foundation -> Pillar -> Roof. Provide a small mapping helper and show how each component uses it."

## Prompt - Component Template
"Generate a reusable component for a blueprint part (example: Pillar.svelte). It should render geometry and material only, accept props for opacity and visibility, and optionally render edges lines. No interaction logic inside the component."

## Prompt - Wireframe Rendering
"Show how to render continuous edges and dashed hidden edges for a mesh using Threlte. Use EdgesGeometry and LineDashedMaterial, and ensure computeLineDistances is called. Keep the code minimal and tied to the blueprint aesthetic."

## Prompt - Hover + Raycasting
"Implement hover detection using real raycasting in Threlte. On hover, reduce opacity of the hovered mesh with a spring. Update a Svelte store so a UI overlay can display the hovered element name and metadata."

## Prompt - UI Overlay
"Create a Svelte UI overlay component that reads hover state and renders an info panel with element name, architectural role, and technical data. Style it to match a blueprint theme."

## Prompt - GLB Pipeline
"Explain and implement a minimal pipeline for importing a GLB model into Svelte using the Threlte GLTF CLI. Emphasize reuse of geometry and materials and how to access nodes inside the generated component."

