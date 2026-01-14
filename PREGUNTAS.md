🧊
Building Interactive 3D Apps with Svelte and Threlte
6 fuentes

Esta fuente educativa explica cómo utilizar Threlte, un entorno de trabajo diseñado para integrar la biblioteca Three.js con el ecosistema de Svelte. El autor destaca que este sistema permite transformar el código imperativo y complejo en una estructura declarativa mucho más limpia y fácil de mantener. A través de ejemplos prácticos, el contenido enseña a configurar escenas, añadir iluminación, cámaras y manejar la interactividad mediante complementos especializados. También se exploran herramientas avanzadas para importar modelos 3D animados y el uso de interfaces gráficas para ajustar valores en tiempo real. En resumen, el recurso sirve como una guía completa para que los desarrolladores web creen experiencias inmersivas de alto nivel con mayor eficiencia.
¿Qué ventajas ofrece el enfoque declarativo de Threlte frente al código imperativo de Three.js?
¿Cómo interactúan los componentes principales y los complementos de Threlte para crear escenas interactivas?
¿De qué manera simplifica Threlte la integración de modelos, animaciones y herramientas de depuración?
Hoy • 22:16

“Explain the core concepts of Three.js that are essential for building an interactive architectural 3D scene (scene graph, meshes, geometries, materials, lights, cameras), with a focus on clean, minimal setups for web portfolios.”
Para construir una escena 3D arquitectónica interactiva en la web, especialmente para portafolios que requieren un código limpio y minimalista, es fundamental entender los conceptos básicos de Three.js a través de una lente declarativa (como la que ofrece el framework Threlte). Este enfoque permite evitar la complejidad del código imperativo de WebGL y Three.js "puro", facilitando la escalabilidad y el mantenimiento
.
A continuación, se explican los conceptos esenciales:
1. El Grafo de Escena (Scene Graph)
El grafo de escena es la estructura jerárquica que organiza todos los objetos, luces y cámaras. En un entorno minimalista, se recomienda usar un enfoque declarativo donde cada entidad es un componente
.
• Contenedor Principal: Todo debe vivir dentro de un componente <Canvas>, que configura automáticamente el renderizador, el bucle de fotogramas y el manejo de color
.
• Jerarquía: Los objetos pueden agruparse; por ejemplo, una cámara o una luz pueden ser "hijos" de otro objeto para heredar sus transformaciones de posición y rotación
.
2. Meshes (Mallas), Geometrías y Materiales
Un Mesh es el objeto visual básico en la escena y se compone de dos partes críticas
:
• Geometría (Geometry): Define la forma técnica del objeto (puntos y caras)
. Ejemplos comunes incluyen sphereGeometry para esferas o planeGeometry para suelos y paredes
.
• Material: Define la superficie y cómo reacciona a la luz
. El meshStandardMaterial es el estándar de la industria porque ofrece un sombreado realista basado en propiedades físicas
.
• Tip Minimalista: Para portafolios, se recomienda importar modelos en formato GLB/glTF, que son el estándar de la web por su eficiencia
. Herramientas de CLI pueden convertir estos archivos directamente en componentes reutilizables y legibles
.
3. Luces (Lights)
Sin luces, una escena 3D suele verse completamente negra
.
• Ambient Light: Proporciona una iluminación básica y uniforme en toda la escena ("global illumination" barata) para que las sombras no sean absolutas
.
• Directional Light: Actúa como el sol, emitiendo rayos paralelos en una dirección específica y es capaz de proyectar sombras
.
• Environment Maps (HDRIs): Para una configuración limpia y de alto impacto visual, se pueden usar componentes de entorno que cargan imágenes HDR. Esto proporciona reflejos realistas e iluminación compleja de forma muy económica para el rendimiento
.
4. Cámaras (Cameras)
La cámara define el punto de vista del usuario.
• Perspective Camera: Es la más común, ya que imita el ojo humano con perspectiva (los objetos lejanos se ven más pequeños)
.
• Orthographic Camera: Muy popular en portafolios de arquitectura o dioramas, ya que ignora la perspectiva para crear una vista isométrica donde las líneas paralelas nunca se encuentran
.
5. Interactividad y Control
Para que un portafolio destaque, la escena debe ser interactiva:
• Orbit Controls: Permiten al usuario rotar, hacer zoom y desplazarse alrededor de un objetivo con el ratón
.
• Raycasting: Es la técnica utilizada para detectar qué objeto está tocando el ratón del usuario, permitiendo clics o efectos de hover en partes específicas de un edificio
.
• Animaciones Fluidas: En lugar de movimientos bruscos, se recomienda el uso de springs (resortes) para animar posiciones o escalas, lo que da una sensación más orgánica y profesional
.
Para mantener el proyecto mínimo y profesional, se sugiere utilizar paquetes de utilidades (como @threlte/extras) que ofrecen abstracciones para sombras de contacto, controles de cámara avanzados y carga de modelos sin tener que escribir cientos de líneas de código manual
.
¿Cómo se animan objetos usando resortes y el hook useTask?
¿Cómo convertir modelos 3D en componentes con Threlte glTF CLI?
¿Qué ventajas ofrece usar una cámara ortográfica en escenas arquitectónicas?

“What are best practices for structuring reusable 3D components (floor, foundation, pillars, roof) in a web project using Three.js or Threlte?”
Para estructurar componentes 3D reutilizables (como suelos, pilares o techos) en un proyecto web, la mejor práctica es adoptar un enfoque declarativo y modular utilizando Threlte. Esto permite que cada elemento arquitectónico sea un componente autónomo, escalable y fácil de mantener
.
A continuación, se detallan las mejores prácticas basadas en las fuentes para organizar estos elementos:
1. Descomposición en Componentes Declarativos
En lugar de escribir código imperativo línea por línea, cada parte de la estructura (pilar, techo, cimentación) debe ser su propio archivo .svelte
.
• Encapsulamiento: Los componentes deben ser autocontenidos y sin efectos secundarios, pero capaces de interoperar entre sí
.
• Uso del componente <T>: Este es el bloque de construcción principal que actúa como un envoltorio para cualquier clase de Three.js (como mesh, geometry o material)
.
2. Flujo de Trabajo con Modelos 3D (CLI)
Para elementos complejos como pilares ornamentados o techos específicos, no es eficiente crearlos mediante código.
• Conversión a componentes: Se recomienda usar la herramienta de línea de comandos @threlte/gltf. Esta convierte archivos GLB/glTF en componentes de Svelte que son introspectables y tipados
.
• Visibilidad de la jerarquía: Al convertir un modelo en componente, puedes ver y manipular individualmente los nodos, mallas y materiales dentro del código Svelte
.
3. Optimización mediante la Reutilización de Recursos
Para elementos repetitivos como los pilares, es vital para el rendimiento no duplicar datos innecesariamente.
• Compartir Geometrías y Materiales: El CLI de Threlte organiza el código para que las geometrías y materiales pesados se definan una vez y se reutilicen en múltiples mallas (meshes)
. Esto reduce drásticamente el uso de memoria y las llamadas de dibujo (draw calls)
.
4. Personalización con "Pierce Props"
Para que un mismo componente de "pilar" pueda tener diferentes alturas o colores en el portafolio, se utilizan las pierce props:
• Manipulación precisa: Permiten acceder a propiedades profundas de un objeto de forma sencilla, por ejemplo: <T.Mesh position.y={5} material.color="red" />
.
• Reactividad: Al pasar valores primitivos (como números o strings) a través de estas propiedades, Threlte puede comparar y actualizar el estado de forma mucho más eficiente que si se pasaran objetos completos
.
5. Organización y Layout en la Escena
• Uso de Grupos: Para mantener el orden, puedes agrupar componentes relacionados (por ejemplo, todos los pilares de una planta) dentro de un componente <T.Group>, lo que permite mover o rotar toda la sección como una sola unidad
.
• Layout 3D: Si la estructura requiere una disposición compleja, el paquete @threlte/flex permite utilizar el motor Yoga para aplicar conceptos de Flexbox directamente en el espacio 3D, facilitando la alineación de componentes arquitectónicos
.
6. Estado Global y Configuración
Para portafolios interactivos (donde el usuario cambia materiales del suelo o techo), se recomienda usar el estado de Svelte (runes). Puedes definir una clase de estado global para los colores o texturas y vincularlos a los componentes mediante las propiedades del material
.
Para una configuración profesional, se sugiere añadir sombras de contacto (contact shadows) desde @threlte/extras para que los pilares y cimientos se sientan "anclados" al suelo de manera realista sin el alto costo de rendimiento de las sombras en tiempo real tradicionales
.
¿Cómo convertir archivos GLB en componentes de Svelte con el CLI?
¿Cómo implementar sombras de contacto para un acabado más realista?
¿Qué diferencias hay entre usar una cámara de perspectiva o isométrica?

“How should responsibilities be divided between a Three.js scene and individual 3D components to keep the codebase clean and scalable?”
Para lograr una base de código limpia y escalable en un proyecto de Three.js (especialmente utilizando un enfoque declarativo como Threlte), es fundamental dividir las responsabilidades entre la escena global y los componentes 3D individuales. Esta separación permite que el código sea reutilizable, introspectable y fácil de mantener
.
A continuación se detalla cómo deben dividirse estas responsabilidades:
1. Responsabilidades de la Escena (Escenario Global)
La escena (generalmente definida en un archivo como Scene.svelte dentro de un componente <Canvas>) debe actuar como el director de orquesta del mundo 3D
. Sus funciones principales son:
• Configuración del Entorno y Renderizado: El componente <Canvas> establece el renderizador, el manejo de color, el suavizado (anti-aliasing) y el bucle de fotogramas
.
• Iluminación Global: La escena debe definir las luces que afectan a todo el entorno, como la AmbientLight (para iluminación base uniforme) o mapas de entorno (HDRIs) para reflejos y luz compleja
.
• Cámaras y Controles: La cámara principal y los sistemas de navegación (como OrbitControls) deben vivir en la escena para definir el punto de vista del usuario sobre todo el conjunto
.
• Orquestación de Componentes: Es el lugar donde se instancian y posicionan los grandes bloques arquitectónicos (suelo, paredes, modelos importados)
.
2. Responsabilidades de los Componentes 3D Individuales
Cada objeto (un pilar, una ventana o un mueble) debe ser un componente autocontenido y sin efectos secundarios
. Sus responsabilidades incluyen:
• Definición de Forma y Superficie: Cada componente encapsula su propia geometría (la forma técnica) y su material (color, textura, reacción a la luz)
.
• Lógica Interna y Animación: Las animaciones específicas de un objeto (como un ventilador que gira o un elemento que flota) deben gestionarse dentro del componente mediante el uso de hooks como useTask o useFrame
.
• Gestión de Activos (CLI): Se recomienda usar herramientas de línea de comandos (como @threlte/gltf) para convertir modelos 3D externos en componentes Svelte. Esto hace que las partes internas del modelo sean introspectables y tipadas, permitiendo manipular nodos específicos desde el código sin afectar al resto de la escena
.
3. Comunicación y Flujo de Datos
Para mantener la escalabilidad, la comunicación entre la escena y los componentes debe seguir reglas claras:
• Estado Global (Runes): Para configuradores arquitectónicos (cambiar colores de paredes o materiales), se debe usar un estado global que los componentes individuales consumen
.
• Pierce Props (Propiedades de Perforación): Al pasar datos a los componentes, es mejor usar la notación de punto (ej. position.y={10}) para pasar valores primitivos. Esto permite que el framework compare cambios de forma más eficiente que si se pasaran objetos completos
.
• Reutilización de Recursos: Los componentes deben estar estructurados para compartir geometrías y materiales pesados si se repiten muchas veces (como múltiples pilares), lo que optimiza el rendimiento al reducir las llamadas de dibujo (draw calls)
.
4. Herramientas para la Escalabilidad
Para no saturar la escena ni los componentes con código manual, se deben delegar tareas complejas a paquetes especializados:
• @threlte/extras: Para utilidades comunes como controles de cámara, sombras de contacto y carga de modelos
.
• @threlte/flex: Si la escena requiere un diseño jerárquico complejo, permite usar Flexbox en el espacio 3D para alinear componentes
.
• @threlte/studio: Proporciona una interfaz visual (GUI) para manipular objetos en tiempo real durante el desarrollo, evitando tener que ajustar valores numéricos a ciegas en el código
.
¿Cómo puedo convertir mis modelos GLB en componentes Svelte automáticamente?
¿Qué ventajas ofrece usar Flexbox para organizar elementos en el espacio 3D?
¿Cómo se implementan las sombras de contacto para mejorar el realismo arquitectónico?

“What are the different ways to render wireframes in Three.js, and which approaches are best suited for exporting models from Blender and rendering them efficiently on the web?”
Existen diversas formas de renderizar wireframes (estructuras de alambre) en Three.js, variando desde propiedades simples de materiales hasta geometrías dedicadas. Para un flujo de trabajo eficiente desde Blender hacia la web, el uso de formatos optimizados y herramientas de automatización es clave.
Formas de renderizar wireframes en Three.js
Según las fuentes, se pueden identificar principalmente dos enfoques para visualizar la estructura de un objeto:
1. Propiedad de Material: Aunque no se detalla extensamente como componente único, en Three.js es común activar la propiedad wireframe: true en materiales básicos o estándares
.
2. WireframeGeometry: Este es un enfoque más específico donde se crea una geometría de estructura de alambre que se añade como "hijo" de una malla (mesh) principal
.
    ◦ En un entorno declarativo como Threlte, puedes usar el componente T.WireframeGeometry dentro de un T.Mesh
.
    ◦ Para que esto funcione eficientemente, se recomienda usar bind:ref o snippets de Svelte para pasar la referencia de la geometría y el material de la malla principal al objeto de wireframe, asegurando que ambos compartan los mismos datos de vértices
.
Exportación desde Blender y renderizado eficiente
Para llevar modelos de Blender a la web de la manera más optimizada, las fuentes recomiendan seguir estas mejores prácticas:
• Formato Estándar: El formato GLB/glTF es el estándar de la industria para compartir contenido 3D en la web
. Se prefiere el archivo .glb sobre el .gltf porque es binario y ocupa mucho menos espacio
.
• Compresión de Geometría: Durante la exportación desde Blender, es altamente recomendable usar la compresión Draco
. Esto reduce significativamente el peso del modelo, aunque requiere habilitar un decodificador como useDraco en el proyecto web para que pueda ser visualizado
.
• Optimización de Texturas: Al exportar desde Blender, seleccionar JPG para las imágenes de las texturas permite obtener la mayor compresión posible
.
• Uso de CLI para Componentes Reutilizables: En lugar de cargar el archivo GLB de forma imperativa, se sugiere usar la herramienta de línea de comandos @threlte/gltf
. Esta herramienta:
    ◦ Transforma el archivo en un componente de Svelte introspectable y tipado
.
    ◦ Optimiza el rendimiento al reutilizar geometrías y materiales compartidos, recreando solo los elementos que no pueden ser reutilizados, lo cual es la forma más eficiente de manejar archivos glTF
.
• Iluminación Económica: Para portafolios o escenas que deban correr en hardware de bajo rendimiento, el uso de un Environment Map (HDR) es preferible sobre configurar múltiples luces individuales, ya que proporciona una iluminación global y reflejos realistas de forma "barata" en términos de cómputo
.
¿Cómo se configura el motor Rapier para añadir físicas al portafolio?
¿Qué ventajas ofrece Threlte Studio frente a Blender para ajustes finales?
¿Cómo implementar efectos de post-procesamiento como el Bloom en Threlte?

“How do dashed lines work in Three.js (LineDashedMaterial), and how can they be used to represent hidden edges in architectural or technical visualizations?”
Los materiales de líneas discontinuas en Three.js, específicamente mediante LineDashedMaterial, permiten crear representaciones visuales donde los bordes no son continuos, lo cual es vital para planos arquitectónicos y diagramas técnicos. Aunque las fuentes no detallan específicamente las propiedades internas de este material, explican cómo integrar cualquier clase de Three.js en un flujo de trabajo moderno y declarativo.
A continuación, se detalla cómo funcionan y su aplicación para representar bordes ocultos:
Cómo funcionan las líneas discontinuas (LineDashedMaterial)
En el ecosistema de Three.js, y específicamente usando Threlte, puedes instanciar este material utilizando el componente universal <T>, que actúa como un envoltorio para cualquier clase de Three.js
.
• Propiedades clave (Información externa): El LineDashedMaterial se define por propiedades como dashSize (longitud del segmento visible) y gapSize (longitud del espacio vacío).
• Requisito técnico crítico: Para que las líneas discontinuas se rendericen correctamente, es necesario llamar al método computeLineDistances() en la geometría. Esto calcula las distancias a lo largo de la línea para determinar dónde comienzan y terminan los guiones.
• Implementación en Threlte: Siguiendo la lógica de las fuentes, se integraría de forma anidada dentro de un objeto de línea:
Representación de bordes ocultos en visualizaciones técnicas
Para representar bordes ocultos (como las líneas de una estructura que están detrás de una pared), se suelen utilizar dos enfoques principales basados en la jerarquía del grafo de escena:
1. Wireframe como hijo del Mesh: Una técnica común mencionada en las fuentes es incluir la geometría de alambre (wireframe) como un "hijo" de la malla principal
. Al pasar la geometría y el material del mesh al componente de wireframe mediante bind:ref, se asegura que ambos compartan los mismos datos de vértices, permitiendo que la estructura de alambre se superponga perfectamente al objeto sólido
.
2. Visualización técnica y diagramas: En visualizaciones arquitectónicas, las líneas discontinuas se utilizan para mostrar elementos que no son visibles desde el punto de vista actual pero que son estructuralmente importantes.
    ◦ Jerarquía declarativa: Al usar Threlte, puedes reactivamente activar o desactivar estas líneas o cambiar su escala de guiones utilizando pierce props (como material.dashSize={2}) para que el sistema compare los cambios de forma eficiente
.
    ◦ Uso de EdgesGeometry: Para visualizaciones técnicas, es preferible usar EdgesGeometry en lugar de un wireframe completo, ya que solo resalta los bordes donde el ángulo entre las caras supera un umbral, evitando el "ruido" visual de todos los triángulos de la malla.
Optimización para Portafolios Web
Para mantener el rendimiento en un portafolio técnico:
• Reutilización de recursos: Si tienes múltiples elementos con el mismo estilo de línea discontinua, las fuentes recomiendan reutilizar los materiales para reducir el uso de memoria y las llamadas de dibujo (draw calls)
.
• Carga de modelos: Si las líneas discontinuas definen la estructura de un edificio complejo, exporta el modelo desde Blender en formato GLB y utiliza el CLI de Threlte para convertirlo en un componente Svelte. Esto te permitirá acceder a nodos específicos del modelo y aplicarles el LineDashedMaterial de forma individual y tipada
.
Nota: La información sobre las propiedades específicas de LineDashedMaterial y el método computeLineDistances() no proviene directamente de las fuentes proporcionadas y debe verificarse de forma independiente.
¿Cómo se optimiza el rendimiento al renderizar muchas líneas técnicas?
¿Qué herramientas de post-procesamiento realzan la estética de un portafolio?
¿Cómo se configuran las colisiones en escenas arquitectónicas interactivas?

“How does depth testing and depth writing work in Three.js, and how can they be used to distinguish visible edges from hidden edges?”
Basado en las fuentes proporcionadas, no se encuentra una definición técnica explícita de los conceptos de "depth testing" (pruebas de profundidad) o "depth writing" (escritura de profundidad). Sin embargo, las fuentes detallan cómo estructurar objetos y materiales en Three.js y Threlte para gestionar la visibilidad de los elementos y sus bordes en escenas complejas.
Para distinguir bordes visibles de bordes ocultos o estructuras internas, se pueden seguir estas prácticas extraídas de las fuentes:
1. Jerarquía de Mallas y Bordes (Nesting)
Una técnica fundamental para representar bordes sobre una superficie sólida es la anidación de objetos en el grafo de escena.
• Wireframes como hijos: En Three.js, un objeto de estructura de alambre (wireframe) puede ser un "hijo" de una malla (mesh) principal
. Esto garantiza que ambos compartan la misma posición y rotación en el espacio 3D.
• Uso de bind:ref: Para que los bordes coincidan exactamente con la geometría del objeto sólido, se recomienda usar la directiva bind:ref en Threlte
. Esto permite capturar la referencia de la geometría y el material de la malla principal y pasarlos como argumentos al componente de wireframe o bordes, asegurando una alineación perfecta
.
2. Definición de Superficie y Material
El comportamiento visual de un objeto depende de la combinación de su geometría y su material
.
• MeshStandardMaterial: Las fuentes sugieren el uso de materiales estándar que reaccionan a la luz para definir la superficie visible
.
• Doble cara: Para asegurar que las superficies sean visibles desde ambos lados (lo cual es crítico en visualizaciones arquitectónicas para evitar que las paredes "desaparezcan" al mirar desde adentro), se puede configurar la propiedad side del material como free.doubleSide
.
3. Técnicas de Visibilidad e Interacción
Para visualizaciones técnicas donde se requiere distinguir entre lo que el usuario ve y lo que está oculto, las fuentes mencionan:
• Mallas invisibles para depuración: Es posible definir mallas (como planos o esferas) como invisibles, cambiando su visibilidad solo cuando sea necesario para tareas de depuración o lógica técnica
.
• Raycasting para intersecciones: Para identificar puntos específicos en una superficie (como una pared o un suelo), se utiliza un raycaster. Este lanza un "rayo" desde la posición del ratón y registra dónde intersecta con los objetos de la escena
.
4. Post-procesamiento y Percepción de Profundidad
Aunque no es una técnica de bordes directa, el uso de efectos de post-procesamiento puede ayudar a distinguir la profundidad de los objetos:
• Efecto Bloom: Se puede aplicar un UnrealBloomPass para resaltar elementos luminosos, lo que ayuda a separar visualmente objetos en primer plano de los del fondo
.
• Sombras de Contacto (contact shadows): Estas ayudan a "anclar" los objetos a las superficies, proporcionando una pista visual clara sobre la profundidad y la posición relativa de los bordes inferiores de una estructura respecto al suelo
.
Nota de información externa: Fuera de lo mencionado en las fuentes, el depth testing determina si un píxel se dibuja basándose en si está más cerca de la cámara que lo ya dibujado, mientras que el depth writing decide si la profundidad de ese píxel debe guardarse en el búfer. Para ver bordes a través de objetos (bordes ocultos), a menudo se desactiva el depth testing en el material de los bordes o se utiliza un desfase (polygon offset) para evitar que los bordes y la superficie sólida compitan por el mismo espacio visual (efecto conocido como z-fighting). Debe verificar esta información de forma independiente.
¿Cómo se usa useTask para animar rotaciones en cada frame?
¿Qué ventajas ofrece Threlte Studio para ajustar escenas en vivo?
¿Cómo aplicar efectos de post-procesamiento como Bloom en Threlte?

“What are the pros and cons of using OrbitControls versus implementing custom mouse interactions for rotating 3D objects in Three.js?”
En el desarrollo con Three.js y Threlte, la elección entre usar OrbitControls o implementar interacciones personalizadas depende del nivel de control y la sensación "orgánica" que se desee para el portafolio. A continuación, se detallan los pros y contras de cada enfoque basados en las fuentes:
OrbitControls (La solución estándar)
Pros:
• Facilidad y rapidez: Es la forma más sencilla de permitir que un usuario orbite alrededor de un objeto con el ratón
. En Threlte, se importa directamente desde @threlte/extras y se añade como un componente simple
.
• Funciones integradas: Incluye por defecto herramientas críticas como damping (amortiguación para un movimiento suave), auto-rotate (rotación automática) y la capacidad de definir un target (punto exacto hacia donde mira la cámara)
.
• Navegación profesional: Facilita la exploración de la escena de manera similar a programas de diseño profesional como Blender
.
Contras:
• Dependencia externa: No forma parte del núcleo principal de Three.js, sino que reside en el directorio de "ejemplos" o "addons", lo que requiere importaciones específicas
.
• Control limitado: Aunque es excelente para mover la cámara alrededor de un objeto, ofrece menos flexibilidad si lo que se busca es rotar un objeto específico en su lugar basado en una lógica de juego o interacción compleja.
Interacciones personalizadas (Raycasting y Springs)
Para un control total, se suelen utilizar técnicas como el Raycasting (lanzar un rayo desde el ratón para detectar colisiones) y sistemas de animación manual
.
Pros:
• Movimiento "orgánico": Al usar sistemas de springs (resortes) con factores de rigidez (stiffness) y amortiguación (damping), se evita el movimiento robótico y se logra una convergencia fluida hacia la posición del ratón
.
• Interactividad precisa: Permite reaccionar a eventos específicos como pointerenter o pointerleave para escalar o rotar objetos individualmente cuando el usuario pasa el ratón sobre ellos
.
• Lógica avanzada: Se pueden implementar "trucos" técnicos, como limitar la aceleración angular o fijar ejes de rotación específicos para que la navegación no sea errática si el ratón está demasiado cerca del centro del modelo
.
Contras:
• Complejidad matemática: Requiere el manejo manual de vectores, productos punto y cálculos de aceleración dentro de un bucle de fotogramas (useTask o useFrame)
.
• Mayor carga de código: A diferencia de una sola línea con OrbitControls, las interacciones personalizadas necesitan configurar escuchadores de eventos (listeners), normalizar las coordenadas del ratón (de -1 a +1) y gestionar el estado de las aceleraciones en cada fotograma
.
Resumen para portafolios
Para un portafolio minimalista, OrbitControls es generalmente la mejor opción por su eficiencia y rapidez de implementación
. Sin embargo, si el objetivo es crear una experiencia de configurador de producto o una escena altamente inmersiva donde los objetos reaccionen de forma elástica al cursor, el uso de interacciones personalizadas con springs proporcionará un acabado mucho más profesional y único
.
¿Cómo se configura una cámara isométrica para un portafolio de arquitectura?
¿Qué ventajas ofrece usar el CLI de Threlte para importar modelos GLB?
¿Cómo puedo crear animaciones orgánicas usando resortes en lugar de movimientos lineales?

“How can mouse drag interactions be implemented in Three.js to rotate a group of objects, without moving the camera?”
Para implementar la rotación de un grupo de objetos mediante la interacción de arrastre del ratón sin mover la cámara, se deben combinar varios conceptos de Threlte y Three.js que permiten capturar la posición del puntero y aplicarla a una jerarquía de objetos.
A continuación, se detalla cómo estructurar esta interacción:
1. Agrupar los objetos
El primer paso es colocar todos los elementos que deseas rotar dentro de un componente <T.Group>
. En Three.js, un grupo permite aplicar transformaciones (como la rotación) a todos sus hijos simultáneamente como si fueran una sola unidad
.
2. Capturar la posición del ratón
Para que el sistema sepa cuánto debe rotar, primero debes normalizar la posición del ratón.
• Coordenadas normalizadas: Se debe transformar la posición del ratón en pantalla a un rango de -1 a +1
. En este sistema, la esquina superior derecha es (1, 1) y la inferior izquierda es (-1, -1)
.
• Eventos de puntero: Puedes usar escuchadores de eventos como onpointermove para actualizar una variable que guarde esta posición cada vez que el ratón se mueva
.
3. Implementar la lógica de rotación (useTask)
Para actualizar la rotación en cada fotograma, se utiliza el hook useTask (o useFrame)
.
• Rotación continua: Dentro de este bucle, puedes multiplicar el movimiento del ratón (delta) por un factor de velocidad para ajustar la rotación del eje Y o X del grupo
.
• Diferencia con la cámara: A diferencia de OrbitControls, que mueve la cámara alrededor de la escena
, aquí aplicarás los cambios directamente a la propiedad rotation del componente <T.Group>
.
4. Suavizado con "Springs" (Resortes)
Para evitar que la rotación sea brusca o "robótica", es una mejor práctica utilizar una animación basada en resortes (springs)
.
• Aceleración y Amortiguación: En lugar de cambiar la rotación instantáneamente, se calcula una aceleración angular basada en la distancia entre la rotación actual y el objetivo (la posición del ratón)
.
• Convergencia: Se aplica un factor de amortiguación (damping) (por ejemplo, 0.95) al final de cada fotograma para que el movimiento disminuya gradualmente hasta detenerse en el punto deseado, logrando un efecto mucho más orgánico
.
5. Alternativa: TransformControls
Si buscas una herramienta de manipulación visual más directa (como las flechas de rotación en Blender), puedes usar TransformControls de la librería @threlte/extras
.
• Este componente envuelve al grupo de objetos y permite al usuario arrastrar ejes específicos para rotarlos manualmente, sin afectar la posición de la cámara
.
Resumen Técnico
Para mantener el código limpio y escalable, se recomienda definir el estado de la rotación mediante runes de Svelte 5 (si se usa esa versión) para que los cambios en las variables de posición del ratón se reflejen de manera reactiva en las propiedades del grupo
.
Nota: Aunque las fuentes no proporcionan un script completo de "arrastre" (clic y mover), detallan que la lógica estándar consiste en normalizar el puntero, usar un raycaster para determinar intersecciones si es necesario, y aplicar la física de resortes para el movimiento final
.
¿Cómo se integra el sistema de físicas Rapier en Threlte?
¿Qué ventajas ofrece usar Threlte Studio frente al código manual?
¿Cómo crear animaciones profesionales usando la integración de Theatre.js?

“How can scroll or mouse wheel input be mapped to a normalized progress value to drive staged animations or construction sequences in Three.js?”
Para mapear la entrada del scroll o de la rueda del ratón a un valor de progreso normalizado (de 0 a 1) y así dirigir animaciones o secuencias en Three.js, las fuentes sugieren un enfoque que combina la captura de eventos, la normalización matemática y el uso de herramientas de animación profesional.
A continuación, se detalla el proceso basado en los conceptos de las fuentes:
1. Normalización del Valor de Entrada
La normalización es el proceso de convertir un valor de entrada (como los píxeles desplazados) en un rango estándar, generalmente entre 0 y 1 o -1 y +1
.
• En el caso del ratón, esto se logra transformando la posición en el espacio de la pantalla a un rango normalizado para que el sistema 3D pueda interpretarlo independientemente de la resolución
.
• Para secuencias de construcción o "staged animations", este valor normalizado actúa como el porcentaje de completado de la animación
.
2. Uso de Bibliotecas de Animación de Terceros
Las fuentes mencionan que las aplicaciones de alto nivel suelen integrar bibliotecas externas para gestionar el mapeo del scroll de forma eficiente:
• GSAP y ScrollMagic: Se utilizan para crear experiencias inmersivas donde el desplazamiento del usuario activa cambios en la escena 3D, permitiendo que el contenido progrese a medida que se hace scroll
.
• Theatre.js (@threlte/theatre): Esta es una herramienta de diseño de movimiento profesional que permite crear secuencias de animación complejas que pueden ser controladas por valores externos o estados reactivos
.
3. Suavizado y Comportamiento Orgánico
Para evitar que las animaciones se sientan "robóticas" al reaccionar al scroll, es fundamental aplicar técnicas de suavizado
.
• Springs (Resortes): En lugar de aplicar el valor de progreso de forma lineal, se puede utilizar un sistema de resortes que añade aceleración y amortiguación (damping)
.
• Damping: El uso de un factor de amortiguación (como 0.95) permite que el movimiento converja suavemente hacia el valor objetivo en lugar de detenerse bruscamente
.
• Implementación en el bucle: Estos cálculos se realizan dentro de ganchos como useTask o useFrame, que ejecutan el código en cada fotograma para actualizar las posiciones o rotaciones basándose en el cambio del valor normalizado
.
4. Aplicación en Secuencias de Construcción
Una vez obtenido el valor normalizado, este puede utilizarse para:
• Controlar el estado global: Usar runes de Svelte 5 para manejar el estado (como colores o piezas visibles) y que la escena reaccione automáticamente gracias a la naturaleza declarativa de Threlte
.
• Interpolar transformaciones: Dirigir la traslación en el eje Y o rotaciones específicas de los modelos arquitectónicos para "armar" la estructura a medida que el valor de progreso aumenta
.
• Visibilidad reactiva: Activar o desactivar componentes de forma reactiva según el punto de la secuencia en el que se encuentre el usuario
.
Para portafolios web, las fuentes recomiendan este enfoque declarativo porque facilita la escalabilidad y permite que la estructura y el ciclo de vida de los componentes gestionen automáticamente aspectos que de otro modo tendrían que implementarse manualmente de forma imperativa
.
¿Cómo se aplica el "damping" en OrbitControls para lograr movimientos fluidos?
¿Qué ventajas ofrece Threlte Studio frente al ajuste manual de valores?
¿Cómo se utiliza el CLI de Threlte para importar modelos optimizados?

“What are effective patterns for driving 3D animations in Three.js using a single progress or state variable?”
Para manejar animaciones 3D de manera efectiva utilizando una única variable de progreso o estado en Three.js (especialmente a través del framework Threlte), se deben emplear patrones que integren la reactividad de los frameworks modernos con el bucle de renderizado de gráficos.
Los patrones más efectivos identificados en las fuentes son:
1. Reactividad Declarativa con Estado Global
El uso de Svelte Runes (en Svelte 5) permite definir variables de estado global (como colores o posiciones) que los componentes 3D consumen de forma reactiva
.
• Patrón: Al cambiar una variable de estado (por ejemplo, paintColor), Threlte actualiza automáticamente las propiedades del material en la escena sin necesidad de manipular manualmente el objeto de Three.js
.
• Ventaja: Este enfoque es escalable y evita los efectos secundarios comunes en el código imperativo tradicional de Three.js
.
2. Movimiento Basado en Resortes (Spring-based Motion)
Para que las animaciones impulsadas por una variable de progreso no se sientan "robóticas" o lineales, se utiliza la física de resortes.
• Patrón de Aceleración y Amortiguación: En lugar de mover un objeto directamente de A a B, se utiliza una variable de aceleración que suma la distancia entre la posición actual y el objetivo (el valor de la variable de estado), multiplicada por un factor de rigidez (stiffness)
.
• Damping: Se aplica un factor de amortiguación (comúnmente 0.95) al final de cada fotograma para que el movimiento converja suavemente hacia el objetivo
.
• Svelte Springs: Threlte permite usar el almacén spring de Svelte como una señal para animar escalas o posiciones de forma orgánica
.
3. Sincronización en el Bucle de Fotogramas (useTask)
Cuando una variable de progreso debe mover múltiples elementos simultáneamente (como una secuencia de construcción), se utiliza el hook useTask (o useFrame).
• Patrón: Dentro de este bucle, se toma el valor actual de la variable de progreso y se aplica a las propiedades de transformación (posición, rotación, escala) de los objetos
.
• Interacción con Delta: Para asegurar que la animación sea fluida independientemente de la tasa de refresco del monitor, se multiplica el cambio por el delta (el tiempo transcurrido entre fotogramas)
.
4. Mapeo de Entradas Normalizadas
Si la animación es dirigida por el usuario (ratón o scroll), se debe normalizar la entrada a un rango estándar.
• Normalización: Transformar la posición del ratón o el desplazamiento del scroll a un rango de -1 a +1 o de 0 a 1
.
• Aplicación: Este valor normalizado actúa como la variable de progreso maestra que impulsa rotaciones complejas o transiciones de cámara
.
5. Herramientas de Secuenciación Profesional
Para animaciones de "etapas" complejas, existen integraciones que facilitan el control por variables de estado:
• Theatre.js: Proporciona un conjunto de herramientas de diseño de movimiento profesional que permite crear secuencias complejas controladas por estados reactivos
.
• GSAP y ScrollMagic: Permiten mapear el progreso del desplazamiento de la página (scroll) directamente a la línea de tiempo de la escena 3D, facilitando experiencias inmersivas tipo portafolio
.
• CLI de GLTF: Al convertir modelos 3D en componentes Svelte mediante la CLI de Threlte, se obtienen componentes con animaciones internas ya definidas (como "conducir" o "abrir") que pueden ser disparadas o controladas mediante props reactivas
.
¿Cómo puedo usar Threlte Studio para ajustar valores en tiempo real?
¿Qué ventajas ofrece el formato GLB con compresión Draco en la web?
¿Cómo se integran las físicas de Rapier en una escena arquitectónica?

“What techniques are commonly used in Three.js to smoothly reveal or construct objects over time (scaling, opacity, position interpolation)?”
Para revelar o construir objetos de forma fluida en Three.js, especialmente utilizando el ecosistema de Threlte, se emplean diversas técnicas que van desde la interpolación matemática básica hasta el uso de herramientas de diseño de movimiento profesional.
A continuación, se detallan las técnicas más comunes según las fuentes:
1. Animaciones basadas en resortes (Spring-based motion)
Para evitar movimientos robóticos y lograr una sensación orgánica en el escalado o posicionamiento, se utiliza la física de resortes (springs).
• Escalado reactivo: Se puede usar el componente spring de Svelte como una señal para animar la escala de un objeto (por ejemplo, al entrar o salir el puntero), logrando que el objeto crezca o se encoja de forma elástica
.
• Interpolación de posición: En lugar de una traslación lineal simple de un punto A a un punto B, se calcula una aceleración basada en la distancia entre la posición actual y el objetivo, multiplicada por un factor de rigidez (stiffness)
.
• Amortiguación (Damping): Para que el objeto converja en su destino y no oscile perpetuamente, se aplica un factor de amortiguación (comúnmente 0.95) al final de cada fotograma, lo que reduce gradualmente la aceleración
.
2. Uso del bucle de fotogramas (useTask / useFrame)
Tanto para la construcción progresiva como para el movimiento continuo, se utiliza el hook useTask (o useFrame), que ejecuta código en cada fotograma.
• Rotación y Traslación: Dentro de este bucle, se puede aplicar una rotación o cambio de posición constante multiplicando el valor por el delta (el tiempo transcurrido entre fotogramas) para asegurar que la animación sea fluida independientemente de la velocidad del monitor
.
• Funciones matemáticas (Seno/Coseno): Para efectos de "revelado" cíclicos, como hacer que un objeto flote suavemente mientras aparece, se utilizan funciones de math.sin o math.cos aplicadas a la posición Y, lo que genera una oscilación armónica basada en el tiempo
.
3. Secuenciación y Post-procesamiento
Para construcciones más complejas o "staged animations" (animaciones por etapas), se integran herramientas especializadas:
• Theatre.js: Es una biblioteca de animación con un conjunto de herramientas de diseño de movimiento profesional (similar a After Effects para la web) que permite crear secuencias de construcción complejas de manera visual
.
• GSAP y ScrollMagic: Estas bibliotecas se utilizan frecuentemente para mapear el progreso del desplazamiento (scroll) del usuario a la línea de tiempo de la escena 3D, permitiendo que los objetos se construyan o revelen a medida que el usuario navega por la página
.
• Efecto Bloom: Para un "revelado" visualmente impactante, el uso de UnrealBloomPass puede hacer que los objetos que aparecen o emiten luz tengan un resplandor luminoso, mejorando la estética de la construcción
.
4. Control a nivel de nodo (CLI de glTF)
Una técnica fundamental para animar partes individuales de un objeto arquitectónico es convertir los archivos 3D (GLB/glTF) mediante el CLI de Threlte (@threlte/gltf). Esto transforma el modelo en un componente de Svelte donde cada parte es introspectable, permitiendo aplicar escalado, posición u opacidad a piezas específicas del modelo de forma independiente durante su "construcción" en la escena
.
¿Cómo puedo combinar la opacidad con resortes para desvanecer objetos?
¿Cómo afectan las pierce props al rendimiento de las animaciones?
¿Es posible animar materiales importados desde Blender con un solo estado?

“What are the main challenges and best practices when integrating Three.js with reactive frameworks like Svelte?”
La integración de Three.js con frameworks reactivos como Svelte presenta una tensión fundamental entre el estilo imperativo de la biblioteca gráfica y la naturaleza declarativa del framework
. A continuación, se detallan los principales desafíos y las mejores prácticas para abordar esta unión de forma escalable.
Principales Desafíos
1. Código Imperativo vs. Declarativo: Three.js requiere instrucciones paso a paso (crear escena, cámara, renderizador, y manipular el DOM manualmente), similar a la API de manipulación de JavaScript antigua
. Esto se vuelve problemático y difícil de escalar a medida que la aplicación crece en complejidad
.
2. Gestión del Ciclo de Vida: En Three.js puro, el desarrollador debe encargarse manualmente de instanciar objetos, añadirlos al padre y, lo más crítico, realizar la limpieza (unmount) para evitar fugas de memoria
.
3. Contexto y SSR: Frameworks como SvelteKit ejecutan código en el servidor, pero Three.js depende de APIs del navegador
. Además, bibliotecas como Threlte dependen fuertemente de la API de Contexto de Svelte, lo que significa que cualquier lógica 3D debe ocurrir estrictamente dentro del componente <Canvas>
.
4. Bucle de Fotogramas (Frame Loop): A diferencia de una web tradicional, los gráficos 3D funcionan en un bucle continuo
. Sincronizar el estado reactivo de Svelte con este bucle sin sacrificar el rendimiento es un reto técnico constante
.
Mejores Prácticas de Integración
1. Adopción de un enfoque declarativo (Threlte) La mejor práctica es utilizar una abstracción como Threlte, que permite usar Three.js a través de componentes
.
• Componente <T>: Es el bloque básico que envuelve cualquier clase de Three.js, encargándose automáticamente de la instanciación, aplicación de propiedades y limpieza cuando el componente se destruye
.
• Separación de archivos: Se recomienda crear un archivo Scene.svelte separado para contener toda la lógica 3D, asegurando que esté dentro del contexto del Canvas
.
2. Uso de herramientas de tubería de activos (CLI) Trabajar con archivos 3D (glTF/GLB) como "cajas negras" es ineficiente.
• CLI de Threlte: Se debe utilizar la herramienta @threlte/gltf para transformar archivos 3D en componentes de Svelte reutilizables, introspectables y tipados
.
• Reutilización de recursos: Esta herramienta permite reutilizar geometrías y materiales, recreando solo lo necesario, lo que optimiza el uso de memoria y las peticiones de red
.
3. Gestión de Estado con Runes y Pierce Props
• Estado Global: Con Svelte 5, se pueden usar runes (clases con getters/setters) para manejar el estado global (como colores o posiciones) que la escena 3D consume reactivamente
.
• Pierce Props: Para pasar valores a los componentes, se recomienda la notación de punto (ej. position.y={5}). Esto pasa valores primitivos, lo que permite que el framework compare cambios de forma mucho más eficiente que con objetos complejos
.
4. Animaciones Orgánicas y Físicas
• Evitar interpolaciones lineales: Para que el movimiento no sea "robótico", se deben usar resortes (springs) con factores de rigidez (stiffness) y amortiguación (damping)
.
• Uso de useTask: Para lógica que requiere ejecutarse en cada fotograma (como rotaciones continuas), se debe usar el hook useTask, multiplicando los movimientos por el delta para mantener la fluidez independientemente de la velocidad del monitor
.
5. Flujo de Trabajo y Depuración
• GUI en tiempo real: Integrar herramientas como Tweakpane permite manipular valores (posiciones, intensidades de luz) visualmente en el navegador, evitando el proceso lento de "adivinar números" en el código
.
• Carga Optimizada: Utilizar hooks como useDraco para manejar modelos comprimidos y Environment para iluminaciones globales económicas que funcionen en hardware de bajo rendimiento
.
¿Cómo puedo optimizar el rendimiento al renderizar múltiples pilares arquitectónicos?
¿Qué herramientas de Threlte facilitan la alineación de componentes complejos?
¿Cómo se aplican animaciones de construcción usando resortes y amortiguación?

“How does Threlte abstract Three.js, and which parts of Three.js should still be handled imperatively when building custom interactions?”
Threlte abstrae Three.js al transformar una API inherentemente imperativa (similar a la manipulación directa del DOM de JavaScript) en un sistema declarativo y orientado al estado dentro de Svelte
. Esta abstracción permite representar escenas 3D mediante componentes que gestionan automáticamente aspectos complejos del ciclo de vida de los objetos
.
Cómo Threlte abstrae Three.js
• El componente <T>: Es el bloque de construcción fundamental
. Actúa como un envoltorio delgado que puede instanciar cualquier clase de Three.js de forma declarativa. Por ejemplo, en lugar de escribir new THREE.Mesh(), simplemente se usa <T.Mesh>
.
• Gestión automática del ciclo de vida: Threlte se encarga de instanciar el objeto, añadirlo al objeto padre en el grafo de escena y, lo más importante, realizar la limpieza y disposición (cleanup) de los recursos cuando el componente se desmonta
.
• Reactividad y Props: Threlte aplica propiedades de forma reactiva. Utiliza "pierce props" (notación de punto como position.y={10}) para pasar valores primitivos, lo que facilita al motor comparar cambios de forma eficiente bajo el capó
.
• Contexto de Escena: El componente <Canvas> establece automáticamente el renderizador, la gestión de color, el suavizado (anti-aliasing) y el contexto necesario para que todos los componentes hijos funcionen correctamente
.
Partes de Three.js que deben manejarse de forma imperativa
Aunque la estructura de la escena es declarativa, las interacciones personalizadas y la lógica de tiempo real a menudo requieren un enfoque imperativo para mantener la escalabilidad y el rendimiento
.
• Bucle de fotogramas (Frame Loop): Las animaciones continuas y la lógica de los juegos se gestionan mejor de forma imperativa dentro de ganchos como useTask o useFrame
. Aquí es donde se aplican cálculos matemáticos (como deltas de tiempo) para actualizar posiciones o rotaciones en cada fotograma
.
• Lógica de Interacción Completa (Raycasting): Para detectar dónde toca el ratón un objeto en el espacio 3D, se utiliza imperativamente un objeto Raycaster
. El proceso de normalizar las coordenadas del puntero y calcular las intersecciones se realiza mediante funciones y escuchadores de eventos manuales
.
• Física y Animaciones de Resorte: Implementar movimientos orgánicos (no robóticos) requiere manipular variables de aceleración, rigidez (stiffness) y amortiguación (damping) manualmente en cada fotograma para que los objetos converjan suavemente hacia un objetivo
.
• Llamadas a Métodos de Objetos: Acciones específicas como iniciar una animación cargada desde un modelo glTF (actions[nombre].play()) o reconfigurar manualmente una cámara suelen ejecutarse imperativamente dentro de efectos de Svelte o funciones de respuesta a eventos
.
• Instancias Manuales: Si se necesita un objeto de Three.js que no tiene una representación directa en el espacio de nombres (como algunos auxiliares complejos), se instancia manualmente y se pasa a Threlte mediante la propiedad is del componente <T>
.
¿Cómo puedo automatizar la creación de componentes desde modelos 3D?
¿Cuál es la mejor manera de optimizar texturas para portafolios?
¿Cómo influye la amortiguación en la fluidez de las animaciones?

“How can raycasting and pointer events be used in Three.js to detect hover interactions on individual 3D components, and how can those interactions be used to temporarily change material properties (such as opacity) while triggering external UI overlays with contextual information?”
Para detectar interacciones de desplazamiento (hover) y modificar dinámicamente propiedades de objetos en Three.js utilizando Threlte, se combinan técnicas de raycasting, eventos de puntero y gestión de estado reactivo.
Aquí te detallo cómo implementar este flujo basándome en las fuentes:
1. Detección de Hover mediante Interactividad
En el ecosistema de Threlte, la forma más eficiente de detectar el cursor sobre un objeto es mediante el plugin de interactividad de @threlte/extras
.
• Raycasting: Internamente, el sistema utiliza un raycaster que lanza un rayo desde la posición de la cámara hacia la posición del ratón en la escena
.
• Coordenadas Normalizadas: Para que el raycasting funcione, las coordenadas del ratón en la pantalla se transforman a un rango normalizado de -1 a +1 (donde el centro es 0,0)
.
• Eventos Declarativos: Una vez activado el plugin, puedes usar escuchadores de eventos directamente sobre la malla (mesh), como onpointerenter (cuando el ratón entra en el objeto) y onpointerleave (cuando sale)
.
2. Cambio Temporal de Propiedades del Material
Para modificar propiedades como la opacidad o el color durante el hover, se recomienda el uso de resortes (springs) de Svelte para que la transición sea fluida y no brusca
.
• Uso de Springs: Puedes definir un resorte que controle un valor (por ejemplo, de 0.5 a 1.0) y vincularlo a la propiedad del material
.
• Pierce Props: Threlte permite usar la notación de punto (ej. material.opacity) para acceder directamente a propiedades internas del objeto de Three.js y actualizarlas de forma reactiva
.
• Ejemplo de lógica: Al dispararse onpointerenter, se establece el valor del resorte a 0.5; al dispararse onpointerleave, se devuelve a 1.0
.
3. Activación de UI Externa con Información Contextual
Para mostrar superposiciones de UI (overlays) con información técnica o contextual, se integra la lógica 3D con el estado global de Svelte.
• Estado Reactivo (Runes): Se pueden utilizar runes de Svelte 5 para almacenar qué objeto está siendo seleccionado o resaltado actualmente
.
• Sincronización: El evento onpointerenter actualiza una variable de estado (por ejemplo, hoveredItem = "Motor Eléctrico"). Esta variable es consumida por un componente HTML convencional de Svelte que se encuentra fuera del <Canvas>, activando su visibilidad y mostrando la información correspondiente
.
• HTML en la Escena: Alternativamente, se pueden usar componentes específicos de @threlte/extras que permiten renderizar HTML directamente dentro de la escena 3D, vinculando etiquetas informativas a puntos específicos de los modelos
.
Resumen Técnico
Este enfoque aprovecha la naturaleza declarativa de Threlte para manejar la estructura (qué objetos existen y cómo se ven) y un enfoque imperativo controlado (a través de eventos) para la interactividad y la lógica de negocio
. Al usar componentes de glTF procesados por CLI, cada parte de un modelo (como el asiento o el motor de un scooter) se vuelve un componente independiente y tipado, facilitando la aplicación de estas interacciones a piezas individuales del diseño
.
¿Cómo se usa un Raycaster para crear botones en 3D?
¿Cómo se animan materiales mediante resortes para efectos suaves?
¿Cómo integrar interfaces HTML sobre componentes específicos de la escena?