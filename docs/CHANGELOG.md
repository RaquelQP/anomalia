# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.4] - 2025-07-20

### Mejorado
- **Cobertura de ataques:** Detección completa de técnicas de camuflaje de dominios (Unicode + punycode + subdominios + URLs largas + TLDs peligrosos + HTTP + puertos)
- **Protección contra homoglifos:** Ahora detecta tanto caracteres Unicode como codificación punycode
- **Prevención de evasión:** Detección de técnicas de evasión usando subdominios excesivos, URLs largas, TLDs de alto riesgo, conexiones no seguras y puertos no estándar
- **Detección de redirecciones:** Lista expandida de parámetros sospechosos para mejor cobertura de ataques de redirección
- **Organización de documentación:** Reorganización completa de archivos de documentación en carpeta `docs/`
- **Estructura del proyecto:** Mejor organización con documentación centralizada y README.md en raíz
- **Mantenimiento:** Código optimizado y profesional para producción
- **Documentación actualizada:** Ayuda HTML actualizada con lista expandida de acortadores y homoglifos
- **README mejorado:** Características actualizadas para reflejar detección expandida
- **Detección de homoglifos:** Lista expandida y optimizada con 60+ caracteres de control e invisibles
- **Detección de acortadores:** Lista expandida de ~20 a ~45 acortadores de riesgo real confirmado
- **Prevención de phishing:** Cobertura completa de espacios invisibles, marcas direccionales y caracteres de control
- **Caracteres de control:** Detección de conectores de ancho cero, separadores invisibles y marcas de formato
- **Espacios invisibles:** Detección de todos los tipos de espacios Unicode que pueden ocultar contenido malicioso

### Añadido
- **Detección de punycode:** Nueva funcionalidad para detectar dominios que usan codificación punycode (xn--)
- **Detección de subdominios excesivos:** Nueva funcionalidad para detectar dominios con más de 3 subdominios
- **Detección de URLs excesivamente largas:** Nueva funcionalidad para detectar URLs con más de 200 caracteres
- **Detección de TLDs de alto riesgo:** Nueva funcionalidad para detectar dominios con TLDs gratuitos o muy baratos
- **Detección de conexiones no seguras:** Nueva funcionalidad para detectar enlaces HTTP (sin HTTPS)
- **Detección de puertos no estándar:** Nueva funcionalidad para detectar enlaces con puertos sospechosos
- **Parámetros de redirección expandidos:** Lista ampliada de parámetros sospechosos de redirección
- **Carpeta docs/:** Nueva estructura organizativa para toda la documentación
- **Subcarpeta html/:** Archivos de ayuda y generador organizados
- **Referencias actualizadas:** Todos los enlaces internos actualizados para la nueva estructura
- **Documentación de acortadores:** Categorización por riesgo (públicos, maliciosos, semi-controlados)
- **Documentación de homoglifos:** Explicación detallada de más de 60 caracteres detectados
- **Documentación de Unicode:** Inclusión de símbolos de letras y múltiples rangos
- **Acortadores públicos:** Servicios donde cualquiera puede crear enlaces (bit.ly, tinyurl.com, goo.gl, etc.)
- **Acortadores maliciosos:** Servicios conocidos por distribuir malware (adf.ly, sh.st, bc.vc, etc.)
- **Acortadores semi-controlados:** Servicios con restricciones parciales (fb.me, lnkd.in)
- **Protección mejorada:** Cobertura ampliada de servicios de acortamiento de URLs
- **Espacios invisibles:** 11 tipos diferentes de espacios Unicode (0x2000-0x200A, 0x00A0, 0x3000, etc.)
- **Marcas direccionales:** Caracteres para cambiar el orden de lectura (0x202A-0x202D, 0x206A-0x206F)
- **Conectores invisibles:** ZERO WIDTH JOINER, ZERO WIDTH NON-JOINER y otros conectores de ancho cero
- **Caracteres de control:** Separadores de línea, caracteres braille en blanco y marcas de formato
- **Caracteres de puntuación confusos:** Comillas y líneas que pueden confundir en URLs

### Mantenido
- **Logs de RDAP:** Conservados para usuarios avanzados en content.js
- **Funcionalidad completa:** Sin cambios en la lógica principal de la extensión
- **Compatibilidad:** Mantenida con todas las versiones anteriores

### Técnico
- **Reorganización de archivos:** Movidos CHANGELOG.md, CONTRIBUTING.md, SECURITY.md, privacy-policy.md y LICENSE a docs/
- **Actualización de enlaces:** README.md y popup.html actualizados con nuevas rutas
- **Estructura estándar:** Seguimiento de convenciones de proyectos open source
- **Documentación sincronizada:** Ayuda HTML actualizada para reflejar funcionalidades actuales
- **Lista optimizada:** Enfoque en acortadores de riesgo real para reducir falsos positivos
- **Organización por categorías:** Espacios invisibles, marcas direccionales, caracteres de control y puntuación
- **Compatibilidad:** Mantenida con todos los caracteres originales y añadidos nuevos relevantes
- **Reorganización de código:** Todas las constantes movidas al inicio del archivo para mejor mantenibilidad y rendimiento
- **Constantes centralizadas:** Configuración de opciones, patrones de detección, servidores RDAP y selectores DOM organizados por secciones
- **Consistencia mejorada:** Uso uniforme de constantes en lugar de valores hardcodeados en funciones
- **Formato de logs mejorado:** Logs para usuarios avanzados con prefijo `[Anomalia][USUARIO]` para facilitar identificación

## [1.3.3] - 2025-07-19

### Mejorado
- **Detección de caracteres Unicode:** Añadido rango de símbolos de letras (0x2100-0x214F)
- **Cobertura completa:** Ahora detecta todos los caracteres del generador, incluyendo ⅼ (script small l)
- **Prevención de phishing:** Mejorada la detección de homoglifos y caracteres confusos

### Técnico
- **Nuevo bloque Unicode:** "Símbolos de letras" para detectar caracteres como ⅼ, ℓ, ℎ, etc.
- **Compatibilidad:** Mantenida con todos los rangos Unicode existentes

## [1.3.2] - 2025-07-19
### Mejorado
- Interfaz del popup optimizada con mejor espaciado y posicionamiento de elementos
- Botón de ayuda reposicionado para mejor accesibilidad visual
- Documentación de ayuda actualizada con secciones de dominio nuevo y dominio caducado
- Eliminación de alertas naranjas (solo se mantienen alertas rojas)
- Espaciado mejorado en la sección de falta de datos registrales

### Corregido
- Eliminación de código sobrante y funciones no utilizadas
- Eliminación de archivo ayuda.html duplicado en la raíz
- Función `esCamuflajePeligroso` no utilizada eliminada

### Mantenido
- Console.logs informativos para usuarios avanzados (detectores de TLD)
- Funcionalidad completa de la extensión sin cambios en la lógica principal

## [1.3.0] - 2024-06-21
### Mejoras y cambios
- Separación de motivos de alerta para parámetros y ruta sospechosa.
- Robustez en la detección de motivos de alerta, incluso con caché RDAP.
- Truncado automático de URLs largas en el panel para evitar desbordes.
- Mejor gestión de advertencias RDAP solo en desarrollo.
- Mejoras menores de compatibilidad y experiencia de usuario.

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

## [1.1.0] - YYYY-MM-DD
### Añadido
- Ayuda didáctica accesible desde el popup
- Recursos de prueba y ejemplos en la Wiki
- Herramienta generadora de enlaces segura
- Mejoras en la experiencia de usuario y documentación 

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