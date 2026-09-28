# AGENTS.md

## Propósito

Este archivo contiene instrucciones de trabajo generales para el repositorio.

Las decisiones de producto y arquitectura de Vue Skin —incluidos el contrato de adapters, los componentes de v1, accesibilidad, playground y criterios de aceptación— están en [IMPLEMENTATION.md](IMPLEMENTATION.md). Léelo antes de cambiar una API pública, la arquitectura o el comportamiento de un componente.

## Forma de trabajar

- Respeta la arquitectura y la API pública documentadas en `IMPLEMENTATION.md`.
- Mantén los cambios acotados a la tarea; evita refactors no relacionados.
- Conserva Vue 3, JavaScript y Composition API, salvo instrucción explícita en contrario.
- Mantén el monorepo con npm workspaces y las dependencias aisladas por paquete.
- No introduzcas dependencias nuevas si una solución clara con Vue o JavaScript estándar es suficiente.
- Mantén la compatibilidad con Windows; los scripts no deben depender exclusivamente de herramientas Unix.

## Calidad

- Actualiza la documentación cuando cambie una API o decisión arquitectónica.
- Añade o ajusta pruebas para cambios de comportamiento.
- Ejecuta las verificaciones relevantes antes de finalizar y comunica las que no se hayan podido ejecutar.
- Respeta los cambios existentes que no formen parte de la tarea.

## Prioridad de decisiones

1. Solicitud explícita del usuario.
2. `IMPLEMENTATION.md`.
3. Pruebas y convenciones ya existentes en el repositorio.
4. Este archivo.
