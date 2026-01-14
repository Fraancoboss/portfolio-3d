# 01 - Architecture Overview

## System Layers
The system is composed of three layers with explicit responsibilities.

ASCII overview:

+---------------------+       +------------------------+
|        UI           |       |     3D Components      |
| Svelte overlays     |<----->| Floor/Foundation/...   |
| state, narrative    |       | geometry + material    |
+----------+----------+       +-----------+------------+
           ^                              ^
           |                              |
           |                              |
+----------+----------+                   |
|        Scene        |-------------------+
| Canvas, lights      |
| camera, group root  |
| interaction wiring  |
+---------------------+

## Data Flow
- Input events (drag, wheel, pointer) are handled at the scene level.
- The scene updates global state (progress, hover target, rotation).
- 3D components read state via props or stores and update their visuals.
- UI overlays read the same state to display labels and metadata.

## Responsibility Map
Scene:
- Owns <Canvas>, renderer config, lights, camera, root Group
- Owns input handling and mapping to normalized values
- Orchestrates order of construction

Components:
- Encapsulate geometry and material only
- Accept props for visibility, opacity, and build progress
- No direct event handling or camera logic

UI:
- Renders overlays based on hover target
- Presents architectural metadata
- Does not depend on 3D internals beyond exposed state

