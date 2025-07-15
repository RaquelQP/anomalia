# Política de Seguridad

## Reportar una Vulnerabilidad

Agradecemos que reporte vulnerabilidades de seguridad de forma responsable. Su ayuda es fundamental para mantener segura esta extensión.

### Cómo Reportar

**NO** abra un issue público para reportar vulnerabilidades de seguridad.

En su lugar, por favor:

1. **Envíe un email** a [tu-email@ejemplo.com] con el asunto `[SECURITY] Anomalia - Vulnerabilidad`
2. **Incluya detalles** sobre la vulnerabilidad:
   - Descripción del problema
   - Pasos para reproducir
   - Impacto potencial
   - Sugerencias de mitigación (si las tiene)

### Qué Esperar

- **Respuesta en 48 horas**: Le responderemos confirmando la recepción
- **Evaluación**: Analizaremos la vulnerabilidad reportada
- **Actualización**: Le mantendremos informado sobre el progreso
- **Agradecimiento**: Reconoceremos su contribución (si lo desea)

### Tipos de Vulnerabilidades

Estamos interesados en:

- **Falsos positivos/negativos** en la detección de enlaces maliciosos
- **Vulnerabilidades de privacidad** (fuga de datos)
- **Problemas de permisos** (permisos innecesarios)
- **Vulnerabilidades de inyección** en la interfaz
- **Problemas de almacenamiento** de datos sensibles
- **Errores o fugas en el análisis RDAP** (consulta de datos de registro de dominios)
- **Exposición accidental de información en logs de consola**

### Compromiso de Seguridad

- **Respuesta rápida** a reportes de seguridad
- **Parches oportunos** para vulnerabilidades críticas
- **Comunicación transparente** sobre problemas de seguridad
- **Mejora continua** de las medidas de seguridad
- **Reducción de permisos**: La extensión solo solicita los permisos mínimos necesarios y solo accede a Gmail y Outlook Web
- **Análisis RDAP**: La extensión consulta información pública de registro de dominios (RDAP) únicamente para analizar el riesgo de los enlaces. Estos datos no se almacenan ni se envían a terceros.
- **Logs en consola**: La extensión muestra información técnica en la consola solo para usuarios avanzados. No se expone información personal ni sensible.

### Mejores Prácticas

Para usuarios:

- **Mantenga actualizada** la extensión
- **Reporte problemas** de detección
- **Revise permisos** regularmente
- **Use HTTPS** siempre que sea posible

Para desarrolladores:

- **Revise el código** antes de contribuir
- **Pruebe cambios** en entornos seguros
- **Siga las guías** de seguridad de Chrome
- **Documente cambios** que afecten la seguridad

### Historial de Seguridad

- **2024-12-19**: Versión 1.0.0 - Lanzamiento inicial con detección completa de enlaces sospechosos
- **2024-XX-XX**: Versión 1.2.0 - Añadido análisis RDAP de dominios, advertencias leves, reducción de permisos, logs informativos en consola y mejoras de privacidad

### Contacto

Para reportar vulnerabilidades de seguridad:
- Email: [r.querol.p@gmail.com]
- Asunto: `[SECURITY] Anomalia - Vulnerabilidad`

Para preguntas generales sobre seguridad:
- Abre un issue en GitHub
- Consulta la documentación del proyecto

---

- **Nota**: Esta extensión está diseñada para mejorar la seguridad del usuario, no para reemplazar otras medidas de seguridad. Utilice siempre múltiples capas de protección. 