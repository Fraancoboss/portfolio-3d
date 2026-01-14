# 08 - Wireframe and Blueprint Style

## Blueprint Visual Rules
- Background: dark blue
- Lines: white
- Volumes: translucent
- Visible edges: continuous lines
- Hidden edges: dashed lines

## Continuous Lines
Use edges geometry for clean line extraction, not full triangle wireframes.

## Dashed Lines
Hidden edges are represented using LineDashedMaterial. Line distances must be computed for dashed lines to render.

Snippet:

```svelte
<T.Line>
  <T.EdgesGeometry args={[geometry, 1]} />
  <T.LineDashedMaterial dashSize={0.2} gapSize={0.1} />
  <T.LineSegments on:create={({ object }) => object.computeLineDistances()} />
</T.Line>
```

## Depth and Visibility
- Depth test should be enabled for correct occlusion
- Dashed lines represent edges behind faces
- Adjust render order if needed to keep dashed lines visible without overpowering the solid mesh

## Performance Considerations
- Share geometry between mesh and line when possible
- Avoid per-frame line recalculation

