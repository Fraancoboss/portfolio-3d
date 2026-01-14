# 11 - Development Phases

## Phase 1 - Base Project and Scene
Objective:
- Establish SvelteKit + Threlte scene scaffold

Implement:
- Canvas, scene root, camera, lights
- Root Group containing placeholders

Not yet:
- Final component geometry
- Interaction logic

Completion criteria:
- Scene renders with stable camera and background

## Phase 2 - 3D Components
Objective:
- Create Floor, Foundation, Pillar, Roof components

Implement:
- Geometry and materials per component
- Props for visibility and opacity

Not yet:
- Wireframe overlay
- Interaction or hover logic

Completion criteria:
- All components render in correct layout

## Phase 3 - Wireframe and Blueprint Style
Objective:
- Implement continuous and dashed line rendering

Implement:
- EdgesGeometry for visible edges
- LineDashedMaterial for hidden edges
- Blueprint color palette

Not yet:
- Hover or progress

Completion criteria:
- Lines render correctly with occlusion

## Phase 4 - Basic Interaction
Objective:
- Object rotation via drag

Implement:
- Pointer input handling
- Rotation of root Group with damping

Not yet:
- Progress-driven build
- Hover state

Completion criteria:
- Rotation is smooth and consistent

## Phase 5 - Progressive Construction
Objective:
- Build sequence controlled by wheel progress

Implement:
- Normalized progress state
- Sequential reveal mapping
- Opacity or scale transitions

Not yet:
- Hover overlays

Completion criteria:
- Build order matches progress stages

## Phase 6 - Informative Hover
Objective:
- Real raycasting and UI overlays

Implement:
- Raycast against components
- Hover opacity changes with springs
- UI overlay with metadata

Not yet:
- Polishing and optimization

Completion criteria:
- Hover feedback is stable and accurate

## Phase 7 - Polish, UX, Performance
Objective:
- Stabilize motion, tune visuals, optimize

Implement:
- Damping tweaks
- Performance pass (reuse geometry/materials)
- UI alignment with blueprint aesthetic

Not yet:
- Additional features beyond scope

Completion criteria:
- Smooth interaction, stable frame time, consistent visuals

