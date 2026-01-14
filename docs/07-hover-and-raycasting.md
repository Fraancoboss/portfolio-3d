# 07 - Hover and Raycasting

## Raycasting Strategy
- Use Three.js raycaster through Threlte
- Raycast against the actual mesh objects
- Store hovered target id in global state

## Visual Response
- Hovered mesh becomes more translucent
- Non-hovered meshes remain stable
- Opacity changes are spring-driven

Example pattern:

```svelte
<T.Mesh
  on:pointerenter={() => setHover('pillar')}
  on:pointerleave={() => setHover(null)}
>
  <T.MeshStandardMaterial
    transparent
    opacity={$hovered === 'pillar' ? 0.2 : 0.6}
  />
</T.Mesh>
```

## 3D to UI Communication
- Hover state is stored in Svelte (store or rune)
- UI overlay reads hover state and displays:
  - element name
  - architectural role
  - technical data

## Edge Cases
- Hover should be disabled for invisible components
- Ensure raycast ignores wireframe-only elements

