# Diseño y usabilidad en Vue Skin

Referencia de trabajo inspirada en [Modern Web Guidance](https://github.com/GoogleChrome/modern-web-guidance). Sus guías se pueden leer directamente en GitHub. La instalación en un agente es opcional y Vue Skin puede aplicar estas recomendaciones sin añadir dependencias. Las decisiones vigentes y el contrato público siguen documentados en [IMPLEMENTATION.md](IMPLEMENTATION.md).

Las propuestas de abajo se pueden incorporar por componente. `UiAppLayout` y los demás layouts compartidos resuelven su propia composición con CSS. Los adapters aplican la apariencia del framework elegido y mantienen la semántica y el comportamiento de la API común.

## Prioridades propuestas

| Prioridad | Componente | Propuesta | Cómo comprobarla |
| --- | --- | --- | --- |
| 1 | `UiAppLayout` y `UiSidebar` | Vincular el botón al panel con `aria-controls` y reflejar el estado con `aria-expanded`. Mantener el panel integrado al contenido en escritorio y tratarlo como modal cuando se superpone en móvil. | Abrir con teclado, recorrer el panel con Tab, cerrar con Escape y recuperar el foco en el botón. Cambiar el ancho con el panel abierto y comprobar que el contenido vuelve a ser interactivo al pasar a escritorio. |
| 2 | `UiDataTable` | Probar `@container` sobre el ancho disponible de la tabla. Cuando falte espacio, permitir que el buscador y las acciones pasen a dos filas. Mantener encabezados y celdas semánticos, con desplazamiento horizontal en el contenedor de la tabla. | Comparar una tabla a ancho completo con otra dentro de una card estrecha, en la misma ventana y con el sidebar abierto. La tabla y sus acciones deben seguir disponibles en ambas. |
| 3 | `UiDropdown` | Probar `popover` nativo en un adapter para que el menú pueda salir de un contenedor con `overflow`. Evaluar por separado cómo anclarlo al disparador y qué alternativa usar en los navegadores objetivo. | Abrir dentro de una card con desplazamiento, cerca de un borde y dentro de un modal. Comprobar posición, cierre con Escape, clic fuera, foco y eventos públicos. |

La propuesta responsive de `UiDataTable` se refiere a su propia barra de acciones. El caso de una aplicación que sustituye la tabla por una lista y luego la oculta en escritorio requiere revisar el código de esa aplicación.

Fuentes: [Navigation Drawer](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/navigation-drawer.md), [Container queries](https://web-platform-dx.github.io/web-features-explorer/features/container-queries/), [Popover](https://web-platform-dx.github.io/web-features-explorer/features/popover/) y [CSS Anchor Positioning](https://web-platform-dx.github.io/web-features-explorer/features/anchor-positioning/).

## Otras técnicas de interfaz

Estas son ideas para evaluar cuando resuelvan un problema concreto en un componente. El catálogo reúne las técnicas y enlaza a sus datos de compatibilidad. [Modern Web Guidance](https://github.com/GoogleChrome/modern-web-guidance#whats-included)

| Tema | Aplicación en Vue Skin |
| --- | --- |
| Tipografía | Probar `text-wrap: balance` en títulos cortos y `text-wrap: pretty` en párrafos. Reservar el recorte de líneas para vistas previas con acceso al texto íntegro. Verificar títulos, botones y etiquetas con zoom y textos largos. |
| Color | Evaluar OKLCH para construir paletas y `color-mix()` para fondos y estados. Comprobar contraste de texto y foco en claro, oscuro y colores forzados. Cada adapter puede expresar su paleta con sus propios tokens. |
| Grillas | Probar `subgrid` en tarjetas de `UiDashboard` cuando deban alinearse títulos, contenidos y acciones con longitudes distintas. La grilla debe poder volver a una columna sin perder el orden de lectura. |
| Transiciones de vistas | Evaluar View Transitions en cambios de sección de `UiAppLayout` o de etapa de `UiWizard`. La navegación y el foco deben funcionar también cuando el navegador omite la transición. |
| Entrada y salida | Probar `@starting-style` y transiciones discretas en `UiModal`, `UiDropdown` o `UiToast`. Verificar que cerrar, reabrir y usar Escape mantengan el estado y el foco correctos, con o sin animación. |
| Desplazamiento | Considerar CSS Scroll Snap para un eventual carrusel y animaciones ligadas al scroll para indicadores de progreso. Mantener controles explícitos donde hagan falta y probar con teclado, tacto y movimiento reducido. |
| Barras de desplazamiento | Evaluar `scrollbar-gutter: stable` en sidebar y tablas para evitar saltos al aparecer la barra. Usar `scrollbar-color` donde corresponda al tema y comprobar que el área desplazable siga siendo fácil de identificar. |
| Campos de texto | Evaluar `field-sizing: content` para `UiTextarea`, con altura máxima y desplazamiento interno. Usar `:user-invalid` para revisar cuándo mostrar errores nativos y conservar la presentación de errores que entrega la aplicación. |
| Imágenes adaptables | En ejemplos de `UiCard`, `UiListItem` y encabezados con imágenes, usar `srcset` y `sizes` para tamaños y `<picture>` cuando cambie el encuadre. Definir dimensiones o relación de aspecto para reservar espacio y comprobar textos alternativos. |
| Dirección de lectura | Usar propiedades como `padding-inline`, `margin-block` e `inset-inline-start`. Probar `dir="rtl"` con sidebar, dropdown, toolbar y formularios, incluidos los iconos cuya dirección indique una acción. |

## Criterios para revisar el diseño

- **Composición.** Probar navbar, sidebar y toolbar con etiquetas largas, ventanas estrechas y zoom. Usar flex o grid en el layout que controla la alineación. En barras fijas, comprobar que el contenido y los controles enfocados queden visibles y respeten las áreas seguras.
- **Controles e iconos.** Dar un nombre accesible a los botones que muestran solo un icono. Reservar espacio al icono, conservar un foco visible y comprobar que el texto pueda ocupar más de una línea en controles que lo admitan. Usar `aria-current` para el destino seleccionado en barras de navegación.
- **Formularios y espera.** Mantener una etiqueta asociada a cada campo y vincular sus ayudas y errores. Durante una operación bloqueante, mostrar un mensaje que describa qué está ocurriendo y comprobar que el preloader libera la interacción y restaura el foco al cerrar.
- **Temas y movimiento.** Revisar estados normales, activos, deshabilitados y de foco en claro y oscuro. Respetar `prefers-reduced-motion` en las transiciones sin perder la indicación de estado.
- **Compatibilidad y pruebas.** Consultar el soporte de cada API en los navegadores objetivo. Probar cambios visuales en navegador real con teclado y tamaños distintos. Las pruebas automatizadas pueden verificar atributos, eventos y estado, y el playground permite comparar los cinco adapters.
