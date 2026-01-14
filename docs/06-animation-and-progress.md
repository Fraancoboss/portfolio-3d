# 06 - Animation and Progress

## Principles
- Animations are driven by state, not imperative tweens
- Use springs for organic motion and damping
- useTask can handle per-frame updates when needed

## Construction Sequencing
Each component derives visibility and opacity from the same normalized progress value. This keeps the build consistent across meshes.

Example spring usage:

```svelte
<script>
  import { spring } from 'svelte/motion'
  const opacity = spring(0, { stiffness: 0.15, damping: 0.7 })
  $: opacity.set(progress >= 0.5 ? 0.6 : 0)
</script>
```

## Rotation Damping
- Store target rotation from drag input
- Interpolate current rotation toward target each frame
- Keep motion stable and predictable

## Avoiding Visual Jitter
- Do not animate camera
- Keep all animations in the root Group or component materials
- Prefer small opacity and scale changes over large transforms

