# Guía de Contribución

¡Gracias por tu interés en contribuir a Anomalia! Este documento te ayudará a entender cómo puedes participar en el desarrollo de esta extensión.

## 🚀 Cómo Contribuir

### Reportar Bugs

1. **Busca en los issues existentes** para ver si el problema ya ha sido reportado
2. **Crea un nuevo issue** con:
   - Descripción clara del problema
   - Pasos para reproducir el error
   - Comportamiento esperado vs actual
   - Información del sistema (navegador, versión, etc.)

### Solicitar Funcionalidades

1. **Busca en los issues existentes** para ver si la funcionalidad ya ha sido solicitada
2. **Crea un nuevo issue** con:
   - Descripción detallada de la funcionalidad
   - Casos de uso específicos
   - Beneficios para los usuarios

### Contribuir Código

1. **Fork del repositorio**
2. **Crea una rama** para tu feature/fix:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. **Haz tus cambios** siguiendo las convenciones del proyecto
4. **Prueba tu código** en Gmail y Outlook
5. **Commit con mensajes descriptivos**:
   ```bash
   git commit -m "feat: añadir detección de nuevos acortadores"
   ```
6. **Push a tu fork**
7. **Crea un Pull Request**

## 📋 Convenciones del Proyecto

### Estructura de Archivos

```
anomalia-v1.2/
├── manifest.json          # Configuración de la extensión
├── content.js             # Lógica principal de detección
├── background.js          # Service worker
├── popup.html             # Interfaz de configuración
├── popup.js               # Lógica del popup
├── styles/                # Archivos CSS
├── icons/                 # Iconos de la extensión
├── README.md              # Documentación principal
├── LICENSE                # Licencia MIT
├── CONTRIBUTING.md        # Esta guía
└── privacy-policy.md      # Política de privacidad
```

### Convenciones de Código

- **JavaScript**: Usar ES6+, funciones flecha, const/let
- **Comentarios**: En español, claros y concisos
- **Nombres**: Descriptivos y en español cuando sea apropiado
- **Indentación**: 2 espacios
- **Punto y coma**: Sí, al final de cada statement

### Convenciones de Commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan funcionalidad)
- `refactor:` Refactorización de código
- `test:` Añadir o modificar tests
- `chore:` Cambios en build, config, etc.

## 🧪 Testing

Antes de enviar un PR, asegúrate de:

1. **Probar en Gmail**:
   - Enlaces normales (no deben marcarse)
   - Enlaces con acortadores (deben marcarse)
   - Enlaces con caracteres Unicode sospechosos

2. **Probar en Outlook**:
   - Misma funcionalidad que en Gmail

3. **Probar la configuración**:
   - Cambiar colores
   - Activar/desactivar detección de camuflaje
   - Cambiar posición del panel

## 🔒 Seguridad

- **No incluir datos personales** en el código
- **Mantener la privacidad** del usuario como prioridad
- **Reportar vulnerabilidades** de forma responsable

## 📞 Contacto

Si tienes preguntas sobre cómo contribuir:

- Abre un issue en GitHub
- Revisa la documentación existente
- Consulta los issues cerrados para ejemplos

## 🎯 Áreas de Mejora

Algunas ideas para contribuir:

- **Nuevos acortadores**: Añadir más servicios a la lista
- **Mejoras en UI**: Interfaz más intuitiva
- **Nuevas detecciones**: Patrones adicionales de phishing
- **Optimizaciones**: Mejor rendimiento
- **Tests**: Cobertura de pruebas
- **Documentación**: Mejorar README y guías

¡Gracias por contribuir a hacer la web más segura! 🛡️ 