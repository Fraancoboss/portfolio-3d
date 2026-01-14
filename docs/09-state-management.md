# 09 - State Management

## Global State Shape
State is small and explicit. Example structure:

- progress: number (0..1)
- rotation: { x, y }
- hover: null | 'floor' | 'foundation' | 'pillar' | 'roof'

## Ownership
- Scene owns mutation (input and mapping)
- Components and UI subscribe only

## Reactive Patterns
- Use Svelte stores or runes to keep shared state
- Avoid passing large objects through props; pass primitives
- Use pierce props for deep updates in Threlte where needed

## Synchronization Rules
- Progress controls construction visibility only
- Hover does not change build order
- Rotation updates do not change camera state

