# Anomalia — Detector de Enlaces Sospechosos

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-v1.1.0-blue?logo=google-chrome)](https://chrome.google.com/webstore/detail/anomalia)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.1.0-green.svg)](https://github.com/RaquelQP/anomalia/releases)
[![Chrome Version](https://img.shields.io/badge/Chrome-88+-green?logo=google-chrome)](https://www.google.com/chrome/)

Una extensión de Chrome que protege tu seguridad en Gmail y Outlook detectando enlaces potencialmente maliciosos en tiempo real.

## 🛡️ Características

- **Detección de acortadores**: Identifica servicios como bit.ly, t.co, goo.gl, etc.
- **Análisis de IPs**: Detecta enlaces que apuntan directamente a direcciones IP
- **Caracteres Unicode sospechosos**: Identifica alfabetos cirílicos, griegos, armenios y otros que pueden camuflarse
- **Camuflaje tipográfico**: Detecta caracteres similares (0/O, 1/l, etc.)
- **Credenciales en URLs**: Alerta sobre URLs que contienen usuario/contraseña
- **Parámetros de redirección**: Detecta parámetros sospechosos como 'redirect', 'url', 'next'
- **Homoglifos**: Identifica caracteres invisibles y de control

## 🎯 Compatibilidad

- ✅ Gmail (mail.google.com)
- ✅ Outlook Web (outlook.live.com)

## ⚙️ Configuración

- **Color de marcado**: Rojo o azul
- **Análisis completo**: Evalúa toda la URL para máxima seguridad
- **Detección de camuflaje**: Activación opcional
- **Mostrar dominio**: Opción para mostrar siempre el dominio real
- **Posición del panel**: 4 posiciones configurables
- **Modo oscuro**: Interfaz adaptativa

## 🔒 Privacidad

- **Sin recopilación de datos**: La extensión no envía información a servidores externos
- **Análisis local**: Todo el procesamiento se realiza en tu navegador
- **Sin tracking**: No se rastrean tus actividades

## 📦 Instalación

1. Descarga la extensión desde Chrome Web Store
2. Activa la extensión en Gmail o Outlook
3. Configura tus preferencias desde el popup
4. ¡Listo! Los enlaces sospechosos se marcarán automáticamente

## 🚀 Uso

1. Abre Gmail o Outlook Web
2. La extensión analizará automáticamente todos los enlaces
3. Los enlaces sospechosos se marcarán con un contorno de color
4. Pasa el mouse sobre un enlace marcado para ver detalles
5. El panel mostrará información sobre por qué el enlace es sospechoso

## 🔧 Desarrollo

Para desarrollo local:
1. Clona este repositorio
2. Abre Chrome y ve a `chrome://extensions/`
3. Activa "Modo desarrollador"
4. Haz clic en "Cargar descomprimida" y selecciona la carpeta del proyecto

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, consulta nuestra [Guía de Contribución](CONTRIBUTING.md) antes de enviar un pull request.

## 🔒 Seguridad

Para reportar vulnerabilidades de seguridad, consulta nuestra [Política de Seguridad](SECURITY.md).

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/RaquelQP/anomalia/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/RaquelQP/anomalia/discussions)
- **Documentación**: [Wiki](https://github.com/RaquelQP/anomalia/wiki)

## 📋 Changelog

Ver [CHANGELOG.md](CHANGELOG.md) para un historial completo de cambios. 

## 🆕 Novedades en la versión 1.1.0

- Nueva ayuda didáctica accesible desde el popup
- Recursos de prueba y ejemplos en la Wiki
- Herramienta generadora de enlaces segura
- Mejoras en la experiencia de usuario y documentación 