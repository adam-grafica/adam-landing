# Adam Landing — Sistema de Agendamiento Dinámico

## Arquitectura del Proyecto
El proyecto está basado en **Vite + React + TypeScript**. La estructura principal se encuentra en la raíz del repositorio (carpeta `src/`), mientras que la carpeta `app/` contiene una versión secundaria o de respaldo del sitio.

### Componentes Clave
- **ModalForm.tsx**: Componente central que maneja el flujo de captura de leads. Implementa un sistema de 5 pasos con validación estricta.
- **n8n Integration**: El sistema consulta disponibilidad en tiempo real a través de un webhook de n8n definido por la variable de entorno `VITE_N8N_DISPONIBILIDAD_URL`.

## Features Implementadas
1. **Calendario Mensual Unificado**: Interfaz premium para selección de fecha.
2. **Slots de Tiempo Dinámicos**: Consulta en tiempo real a Google Calendar vía n8n.
3. **Sistema de Fallback**: Si el servidor n8n no responde o la URL no está configurada, el sistema permite agendar solo la fecha (marcando la hora como "pendiente de confirmación").
4. **Diseño Minimalista & Responsive**: Rediseño completo para evitar desbordamientos en móviles, con scroll interno y sin elementos distractores (emojis eliminados).
5. **Captura de WhatsApp**: Integrado en el paso 2 para asegurar prioridad en el contacto.

## Configuración de Producción (CapRover)
- Se utiliza el `Dockerfile` de la raíz.
- Inyección de variables en tiempo de construcción mediante `ARG` y `ENV` para asegurar que Vite capture la URL de n8n.
- Configuración de Nginx para servicio de SPA.

## Historial de Cambios Recientes
- [2026-04-09] Rediseño minimalista del Modal.
- [2026-04-09] Mejora de resiliencia en carga de slots y feedback de error.
- [2026-04-09] Habilitación de variables de entorno en Dockerfile para CapRover.
