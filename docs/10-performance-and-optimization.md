# 10 - Performance and Optimization

## Geometry and Material Reuse
- Share geometry and materials across repeated parts
- Avoid duplicating heavy buffers for identical meshes

## GLB Pipeline
- Prefer GLB over GLTF for compact binary assets
- Use Draco compression when exporting from Blender
- Use Threlte GLTF CLI to generate reusable components

## Lighting Strategy
- Keep lighting minimal and consistent with blueprint style
- Use environment maps only if they align with the visual intent

## Render Loop
- Avoid unnecessary per-frame allocations
- Use useTask only when motion must be updated each frame
- Prefer derived values from Svelte state when possible

## Raycasting Cost
- Raycast only against visible meshes
- Exclude wireframe-only objects to reduce checks

