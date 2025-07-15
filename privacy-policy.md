# Política de Privacidad - Anomalia

**Última actualización:** [Fecha actual]

## 📋 Información General

Anomalia es una extensión de Chrome diseñada para detectar enlaces potencialmente maliciosos en Gmail y Outlook Web. Esta política de privacidad explica cómo manejamos la información cuando usas nuestra extensión.

## 🔒 Recopilación de Datos

**Anomalia NO recopila, almacena ni transmite ningún dato personal:**

- ✅ No recopilamos información personal
- ✅ No enviamos datos personales a servidores externos
- ✅ No rastreamos su actividad de navegación
- ✅ No almacenamos URLs analizadas
- ✅ No compartimos información con terceros (salvo la consulta pública a servidores RDAP, ver más abajo)

**Sin embargo, para analizar la fiabilidad de los dominios, la extensión realiza consultas a servidores públicos RDAP.**
- Solo se transmite el nombre del dominio (por ejemplo, "ejemplo.com") a estos servicios públicos, nunca la URL completa ni datos personales.
- La finalidad es obtener información pública de registro, renovación y expiración del dominio para mejorar la detección de riesgos.

## 🔍 Funcionamiento de la Extensión

La extensión funciona principalmente en su navegador:

1. **Análisis local**: Todas las URLs se analizan localmente en su dispositivo
2. **Consulta RDAP**: Para cada dominio detectado, se realiza una consulta a un servidor público RDAP para obtener información de registro. Solo se transmite el nombre del dominio, nunca la URL completa ni datos personales.
3. **Almacenamiento local**: Solo se guardan sus preferencias de configuración en el almacenamiento local del navegador
4. **Procesamiento en tiempo real**: El análisis se realiza instantáneamente sin almacenamiento persistente

## 📦 Datos Almacenados Localmente

La extensión solo almacena localmente:
- Configuración de colores de marcado
- Preferencias de visualización del dominio
- Posición del panel informativo
- Estado activo/inactivo de la extensión

Estos datos se almacenan únicamente en su navegador y no son accesibles para nosotros.

## 🌐 Permisos Requeridos

La extensión solicita los siguientes permisos:

- **storage**: Para guardar sus preferencias de configuración
- **activeTab**: Para interactuar con las páginas de correo
- **host_permissions**: Solo para Gmail (mail.google.com) y Outlook (outlook.live.com)

## 🔐 Seguridad

- No tenemos acceso a sus correos electrónicos
- No podemos ver el contenido de sus mensajes
- No almacenamos información de su cuenta
- No tenemos acceso a sus credenciales
- Solo se transmite el nombre del dominio a servidores públicos RDAP para análisis de riesgo

## 📞 Contacto

Si tiene preguntas sobre esta política de privacidad, puede contactarnos a través de:
- Issues en el repositorio de GitHub

## 📝 Cambios en la Política

Nos reservamos el derecho de actualizar esta política de privacidad. Los cambios se publicarán en esta página con una nueva fecha de "Última actualización".

## ✅ Cumplimiento

Esta extensión cumple con:
- Políticas de Chrome Web Store
- Regulaciones de privacidad aplicables
- Mejores prácticas de seguridad 