# 00 - Introduction

## Purpose
This documentation defines the system architecture, component responsibilities, interaction model, and implementation patterns for a 3D architectural blueprint portfolio built with Svelte, Three.js, and Threlte. It is designed for senior developers to continue development without ambiguity.

## Project Summary
The project is a web 3D portfolio with a technical blueprint aesthetic. The main scene renders a modular architectural structure composed of four elements:
- Floor (flat plane)
- Foundation (low translucent volume)
- Pillar (vertical volume)
- Roof (top plate)

The experience is interaction-driven:
- Drag rotates the structure itself (not the camera)
- Mouse wheel controls a normalized progress value (0 to 1)
- Progress drives sequential construction: floor -> foundation -> pillar -> roof
- Hovering a part triggers transparency changes and UI overlays with contextual data

## Visual Direction
- Dark blue background, white lines
- Translucent volumes
- Visible edges as continuous lines
- Hidden edges as dashed lines

## Scope and Non-Goals
In scope:
- Declarative 3D scene with Threlte
- Modular, reusable 3D components
- Real raycasting for hover
- UI overlays driven by 3D state

Out of scope:
- OrbitControls or camera navigation
- Unrelated visual effects not tied to the blueprint aesthetic
- Generic demo features without architectural purpose

## Core Constraints
- Strict separation of responsibilities: scene vs components vs UI
- No component owns camera or interaction logic
- All interaction state is exposed to Svelte for UI binding

