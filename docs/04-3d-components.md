# 04 - 3D Components

## Component Principles
- Each part is a standalone component
- No camera or input logic inside components
- Pure render logic: geometry + material + local transforms
- Expose props for visibility, opacity, and progress

## Required Components
### Floor
- Plane geometry
- Serves as base reference
- Always present once progress >= first threshold

### Foundation
- Low translucent volume
- Appears after floor
- Can use shared materials with other parts for consistency

### Pillar
- Vertical volume
- Appears after foundation
- Should support reuse if multiple instances are needed later

### Roof
- Top plate
- Appears after pillar

## Wiring Pattern
Components accept normalized progress and compute their own reveal.

Example snippet:

```svelte
<T.Mesh visible={progress >= 0.25}>
  <T.BoxGeometry args={[1, 0.2, 1]} />
  <T.MeshStandardMaterial transparent opacity={opacity} />
</T.Mesh>
```

## Wireframe Overlay Support
Each component should be able to render its solid mesh plus a wireframe overlay. The overlay should share the same geometry reference when possible to avoid extra buffers.

