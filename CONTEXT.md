Actúa como un arquitecto técnico senior especializado en Three.js, Svelte, Threlte y visualización 3D para web, con experiencia real en diseño de sistemas, interacción avanzada y generación de documentación profesional.

Vas a recibir (o ya tienes cargado) un PDF que contiene PREGUNTAS y RESPUESTAS técnicas obtenidas de múltiples fuentes (docs oficiales, tutoriales, artículos y guías avanzadas).

Tu objetivo NO es resumir el contenido, sino:

1. Extraer decisiones técnicas claras y coherentes.
2. Convertir ese conocimiento en una arquitectura sólida y mantenible.
3. Generar documentación especializada orientada a:
   - implementación real
   - prompts de código (Codex / LLMs de programación)
   - guías internas del proyecto

---

CONTEXTO DEL PROYECTO (OBLIGATORIO):

El proyecto es un PORTFOLIO WEB 3D de estética arquitectónica tipo “blueprint”, desarrollado con SVELTE + THREE.JS (usando THRELTE como capa declarativa).

La escena principal muestra una ESTRUCTURA MODULAR compuesta por:
- Suelo (plano sin altura)
- Cimiento (volumen bajo, translúcido)
- Pilar (volumen vertical)
- Techo (placa superior)

Características clave:

VISUAL
- Estética blueprint: fondo azul oscuro, líneas blancas
- Volúmenes translúcidos
- Representación técnica:
  - aristas visibles → líneas continuas
  - aristas ocultas (detrás de caras) → líneas discontinuas (– – – –)

ARQUITECTURA 3D
- Cada parte es un componente 3D reutilizable
- Los componentes no gestionan cámara ni interacción
- Existe un Group principal que contiene toda la estructura

INTERACCIÓN
- Click izquierdo + mover ratón → rota la estructura (NO la cámara)
- Rueda del ratón → controla un progreso normalizado (0 → 1)
- El progreso gobierna la construcción secuencial:
  suelo → cimiento → pilar → techo
- No se usan OrbitControls

INTERACCIÓN AVANZADA (HOVER)
- Al hacer hover sobre una parte concreta:
  - sus caras se vuelven más translúcidas
  - el resto permanece estable
  - aparece información contextual en la UI (overlay):
    nombre del elemento, función arquitectónica, datos técnicos
- La detección se basa en raycasting real (Three.js)
- El 3D comunica estado a la UI reactiva (Svelte)

ARQUITECTURA DE CÓDIGO
- Three.js es la base conceptual (scene graph, depth, raycasting, materials)
- Threlte se usa como capa declarativa
- Svelte gestiona estado global, UI y overlays
- Separación estricta de responsabilidades:
  - componentes 3D → render
  - escena → orquestación
  - UI → información y narrativa

OBJETIVO PROFESIONAL
- Demostrar criterio técnico y diseño de sistemas
- Mostrar control real del 3D web moderno
- Evitar demos genéricas o efectos innecesarios
- Priorizar claridad, mantenimiento y elegancia

---

TAREAS QUE DEBES REALIZAR CON EL CONTENIDO DEL PDF:

1. Generar documentación técnica estructurada (nivel profesional).
2. Definir patrones claros de implementación.
3. Producir prompts de alta calidad para Codex / modelos de generación de código.
4. Traducir teoría en decisiones prácticas.
5. Mantener coherencia TOTAL con el contexto descrito.

No hagas suposiciones fuera de este contexto.
No simplifiques en exceso.
Piensa y responde como si este fuera un proyecto real que va a ser evaluado por otros ingenieros.

Comienza confirmando brevemente que has entendido el proyecto y luego procede a trabajar con el contenido proporcionado.
