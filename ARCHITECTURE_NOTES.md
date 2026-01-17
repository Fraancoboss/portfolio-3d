# Architecture Notes

This project is intentionally structured to keep interaction flow predictable and auditable. The design favors explicit ownership of state over implicit coupling to reduce accidental behavior changes and avoid UI-driven side effects.

## Interaction Ownership

The scene layer is the single owner of interaction, focus, and progression. It receives input, computes state transitions, and publishes the resulting state. This makes the interaction model deterministic and easy to audit.

Reasons:
- Input is processed once, in one place.
- State transitions are observable and reviewable.
- Behavior remains stable even as UI layers evolve.

## Passive 3D Components

3D components are render-only. They do not decide focus, mutate global state, or encode interaction rules. They only render geometry/materials and emit local events.

Reasons:
- Prevents hidden coupling between visuals and state.
- Keeps the pipeline stable under refactors.
- Avoids desync between visual state and global state.

## Read-Only UI Overlays

UI overlays are projections of scene state. They do not drive interaction or mutate global stores.

Reasons:
- Avoids UI-driven state changes that are hard to audit.
- Reduces the attack surface for inconsistent or ambiguous state.
- Keeps UI layers interchangeable without risk to core logic.

## Projects Mode: Hover-Driven Only

Projects mode is intentionally hover-driven. Scroll does not change focus, and no default focus exists without hover.

Reasons:
- Direct mapping between user intent and focus.
- No hidden progression or latent state.
- Eliminates ambiguity between scroll and hover inputs.

## Discrete, Deterministic Progress

Progress is discrete by design. There is no normalized 0..1 progress model. Visual stages map to explicit states.

Reasons:
- Predictable and testable transitions.
- Reduced ambiguity in UI and scene synchronization.
- Higher auditability for interactive behavior.

## Non-Goals

The system intentionally does not support:
- Freeform animation that mutates global state implicitly.
- UI-driven state transitions or hidden coupling to scene logic.
- Generalized interaction abstractions that obscure ownership.

The emphasis is on explicit control, predictable state transitions, and minimal coupling between layers.
