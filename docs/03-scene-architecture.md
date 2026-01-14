# 03 - Scene Architecture

## Scene Component Responsibilities
The scene is the orchestrator. It owns:
- <Canvas> configuration (renderer, color, frame loop)
- Global lights and background color
- Camera definition
- Root Group that contains the entire structure
- Event handling (drag, wheel, pointer)
- Global state updates (progress, hover, rotation)

## Root Group
All 3D parts are children of a single Group. Rotation is applied to this Group.

Pseudo layout:

<T.Canvas>
  <T.Scene>
    <Lights />
    <Camera />
    <T.Group bind:ref={rootGroup}>
      <Floor />
      <Foundation />
      <Pillar />
      <Roof />
    </T.Group>
  </T.Scene>
</T.Canvas>

## Camera
The camera is stable and static. Rotation is achieved by rotating the Group, not the camera. This preserves UI consistency and avoids navigation semantics.

## Event Wiring
- Drag: updates rotation target on the root Group.
- Wheel: updates normalized progress state (0 to 1).
- Pointer move: updates hover target via raycasting.

