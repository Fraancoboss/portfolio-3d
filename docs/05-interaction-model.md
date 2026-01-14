# 05 - Interaction Model

## Inputs
- Left click + drag: rotate structure
- Mouse wheel: drive construction progress
- Pointer hover: identify part under cursor

## Rotation (Object-Centric)
- Rotate the root Group around Y axis based on drag delta
- Do not move the camera
- Use damping for smooth motion

## Progress (Construction)
- Normalize wheel input to a 0..1 progress value
- Use clamping to avoid overshoot
- Map progress to sequential reveal stages

Example mapping:
- 0.00 - 0.25: Floor
- 0.25 - 0.50: Foundation
- 0.50 - 0.75: Pillar
- 0.75 - 1.00: Roof

## Hover
- Raycast against component meshes
- Hovered mesh changes opacity via spring
- UI reads hovered target and renders overlay

