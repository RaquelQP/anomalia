# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-19

### Añadido
- Detección de acortadores de URL (bit.ly, t.co, goo.gl, etc.)
- Detección de direcciones IP
- Detección de credenciales en URLs
- Detección de caracteres Unicode sospechosos (alfabetos cirílicos, griegos, armenios, etc.)
- Detección de homoglifos y caracteres invisibles
- Detección de parámetros de redirección sospechosos
- Detección de camuflaje tipográfico
- Opción para mostrar siempre el dominio real
- Configuración de posición del panel informativo
- Modo oscuro para la interfaz
- Análisis completo de URLs
- Soporte para Gmail y Outlook Web

### Mejorado
- Interfaz de usuario intuitiva y organizada
- Mejor organización de opciones (visual vs análisis)
- Código optimizado y limpio
- Documentación completa y profesional
- Sistema de paneles informativos
- Gestión de iconos según estado

### Corregido
- Limpieza de estilos al desactivar la extensión
- Manejo mejorado de errores en URLs malformadas
- Comunicación entre componentes optimizada



---

## Notas de Versión

### Versionado
- **MAJOR**: Cambios incompatibles con versiones anteriores
- **MINOR**: Nuevas funcionalidades compatibles
- **PATCH**: Correcciones de bugs compatibles

### Compatibilidad
- Chrome 88+ (Manifest V3)
- Gmail Web
- Outlook Web

### Instalación
1. Descargar desde Chrome Web Store (recomendado)
2. O instalar en modo desarrollador desde el código fuente 

## [1.1.0] - YYYY-MM-DD
### Añadido
- Ayuda didáctica accesible desde el popup
- Recursos de prueba y ejemplos en la Wiki
- Herramienta generadora de enlaces segura
- Mejoras en la experiencia de usuario y documentación 

## [1.2.0] - YYYY-MM-DD
### Añadido
- Detección automática y no configurable de camuflaje tipográfico
- Panel informativo con mensajes claros y diferenciados por nivel de riesgo
- Uso de emojis 🚫 y ⚠️ para distinguir entre peligro y precaución
- Advertencia leve cuando no se pueden obtener datos registrales o el TLD no está soportado
- Sección de ayuda completamente actualizada y adaptada a todos los cambios
- Aviso para usuarios avanzados sobre consulta de datos en la consola
- Soporte RDAP ampliado (incluido TLD .it)

### Mejorado
- Limpieza de opciones y simplificación de la interfaz
- Reducción de falsos positivos y experiencia visual más limpia
- Todos los textos y mensajes en registro formal (usted)
- Eliminados permisos innecesarios y recursos web accesibles no requeridos
- Compatibilidad confirmada con Chrome, Edge y Brave

### Corregido
- Manejo robusto de errores y advertencias en paneles
- Eliminación de mensajes duplicados en advertencias leves