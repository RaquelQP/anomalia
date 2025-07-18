# Anomalia — Detector de Enlaces Sospechosos

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Version](https://img.shields.io/badge/version-1.2.0-green.svg)](https://github.com/RaquelQP/anomalia/releases)
[![Chrome Version](https://img.shields.io/badge/Chrome-88+-green?logo=google-chrome)](https://www.google.com/chrome/)

Una extensión de Chrome que protege su seguridad en Gmail y Outlook detectando enlaces potencialmente maliciosos en tiempo real.

## 🛡️ Características

- **Detección de acortadores**: Identifica servicios como bit.ly, t.co, goo.gl, etc.
- **Análisis de IPs**: Detecta enlaces que apuntan directamente a direcciones IP
- **Caracteres Unicode sospechosos**: Identifica alfabetos cirílicos, griegos, armenios y otros que pueden camuflarse
- **Camuflaje tipográfico**: Detección automática de caracteres similares (0/O, 1/l, etc.)
- **Credenciales en URLs**: Alerta sobre URLs que contienen usuario/contraseña
- **Parámetros de redirección**: Detecta parámetros sospechosos como 'redirect', 'url', 'next'
- **Homoglifos**: Identifica caracteres invisibles y de control
- **Análisis de datos registrales (RDAP)**: Consulta y analiza registro, renovación y expiración de dominios para los TLDs más populares (.com, .net, .org, .es, .io, .ai, .co, .it, etc.)
- **Panel informativo con emojis**: Mensajes claros y diferenciados por nivel de riesgo con 🚫 (peligro) y ⚠️ (precaución)
- **Advertencia leve**: Si no se pueden obtener datos registrales o el TLD no está soportado
- **Búsqueda automática de servidores RDAP**: Si un TLD no está en la lista, la extensión lo busca automáticamente y lo recuerda para el usuario.
- **Aviso de nueva versión**: El popup muestra un aviso si hay una nueva versión disponible en GitHub.

## 🎯 Compatibilidad

- ✅ Chrome
- ✅ Edge
- ✅ Brave
- ✅ Gmail (mail.google.com)
- ✅ Outlook Web (outlook.live.com)

## ⚙️ Configuración

- **Color de marcado**: Rojo o azul
- **Mostrar siempre el dominio**: Opción para mostrar siempre el dominio real
- **Posición del panel**: 4 posiciones configurables
- **Modo oscuro**: Interfaz adaptativa

## 🔒 Privacidad

- **Sin recopilación de datos**: La extensión no envía información a servidores externos
- **Análisis local**: Todo el procesamiento se realiza en su navegador
- **Sin tracking**: No se rastrean sus actividades

## 📦 Instalación

1. Descargue o clone este repositorio
2. Abra Chrome y vaya a `chrome://extensions/`
3. Active "Modo desarrollador"
4. Haga clic en "Cargar descomprimida" y seleccione la carpeta del proyecto
5. Active la extensión en Gmail o Outlook
6. Configure sus preferencias desde el popup
7. ¡Listo! Los enlaces sospechosos se marcarán automáticamente

## 🚀 Uso

1. Abra Gmail o Outlook Web
2. La extensión analizará automáticamente todos los enlaces
3. Los enlaces sospechosos se marcarán con un contorno de color
4. Pase el mouse sobre un enlace marcado para ver detalles
5. El panel mostrará información sobre por qué el enlace es sospechoso
6. **Emojis en el panel:**
   - 🚫 Peligro: Evite hacer clic, el enlace es muy sospechoso
   - ⚠️ Precaución: Examine el enlace con atención, puede ser peligroso
   - Sin emoji: No se ha podido evaluar el riesgo por falta de datos
7. Si aparece una advertencia leve, revise el dominio cuidadosamente antes de hacer clic
8. Usuarios avanzados pueden consultar los datos registrales y técnicos en la consola del navegador (F12 → Consola)

## 🔧 Desarrollo

Para desarrollo local:
1. Clone este repositorio
2. Abra Chrome y vaya a `chrome://extensions/`
3. Active "Modo desarrollador"
4. Haga clic en "Cargar descomprimida" y seleccione la carpeta del proyecto

## Licencia

Este proyecto está licenciado bajo la Licencia Pública General GNU v3.0 (GPL v3). Consulte el archivo LICENSE para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, consulte nuestra [Guía de Contribución](CONTRIBUTING.md) antes de enviar un pull request.

## 🔒 Seguridad

Para reportar vulnerabilidades de seguridad, consulte nuestra [Política de Seguridad](SECURITY.md).

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/RaquelQP/anomalia/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/RaquelQP/anomalia/discussions)
- **Documentación**: [Wiki](https://github.com/RaquelQP/anomalia/wiki)

## 📋 Changelog

Ver [CHANGELOG.md](CHANGELOG.md) para un historial completo de cambios. 

## Versión

**1.3.1** (21 de junio de 2024)

### Cambios menores
- Truncado automático de URLs largas en el panel para evitar desbordes.
- Limpieza de logs de depuración y advertencias en consola.
- Mejor robustez en la gestión de motivos de alerta.
- Mejoras visuales y de experiencia de usuario. 