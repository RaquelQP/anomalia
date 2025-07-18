console.log('[Anomalia][DEBUG] content.js PRUEBA UNICA 2024-06-20');

let opcionesCargadas = {};

const clavesOpciones = [
  'color',
  'extensionActiva',
  'modoOscuro',
  'posicionPanel',
  'mostrarDominioSimple'
];

// Patrones ampliados de camuflaje tipográfico
const patronesCamuflaje = [
  /0/,    // Cero en vez de o
  /1/,    // Uno en vez de l o i
  /3/,    // Tres en vez de e
  /5/,    // Cinco en vez de s
  /7/,    // Siete en vez de t
  /8/,    // Ocho en vez de B
  /9/,    // Nueve en vez de g
  /rn/,   // r + n en vez de m
  /vv/,   // v + v en vez de w
  /cl/,   // c + l en vez de d
  /lI|Il/,// l + I o I + l en vez de ll
  /O/,    // O mayúscula en vez de 0
  /I/,    // I mayúscula en vez de l
  /S/,    // S mayúscula en vez de 5
  /l/,    // l minúscula en vez de i
  /q/,    // q en vez de g
  /u/,    // u en vez de v
];

// Función para decidir si el camuflaje tipográfico es peligroso
function esCamuflajePeligroso(motivos) {
  // 1. Dominio nuevo
  if (motivos.dominioNuevo) return true;
  // 2. Parámetros peligrosos
  if (motivos.parametros) return true;
  return false;
}

function evaluarMotivosDeAlerta(href) {
  const motivos = {
    alfabetos: [],
    acortador: false,
    ip: false,
    credenciales: false,
    parametrosSospechosos: false, // Nuevo: solo si hay parámetros sospechosos
    rutaSospechosa: false,        // Nuevo: solo si el path es sospechoso
    parametros: false,            // Compatibilidad: true si cualquiera de los dos
    homoglifos: false,
    camuflajeTipografico: false, // Nuevo motivo grave
    dominioNuevo: false,
    fechaRegistro: null,
    fechaRenovacion: null,
    fechaExpiracion: null
  };

  let url = null;
  try {
    url = new URL(href);
  } catch {
    // Si no se puede parsear la URL, devuelve motivos por defecto
    return motivos;
  }
  if (url) {
    const host = url.hostname;
    // ——— 1. ALFABETOS UNICODE ———
    const bloques = {
      'Cirílico': [0x0400, 0x04FF],
      'Suplemento cirílico': [0x0500, 0x052F],
      'Griego': [0x0370, 0x03FF],
      'Armenio': [0x0530, 0x058F],
      'Hebreo': [0x0590, 0x05FF],
      'Latín extendido A': [0x0100, 0x017F],
      'Latín extendido B': [0x0180, 0x024F],
      'Matemáticos alfanuméricos': [0x1D400, 0x1D7FF],
      'Diacríticos combinados': [0x0300, 0x036F]
    };
    for (const char of href) {
      const code = char.codePointAt(0);
      for (const [nombre, [inicio, fin]] of Object.entries(bloques)) {
        if (code >= inicio && code <= fin) {
          motivos.alfabetos.push({ bloque: nombre, caracter: char });
          break;
        }
      }
    }
    // ——— 2. ACORTADOR ———
    const acortadores = [
      'bit.ly', 't.co', 'goo.gl', 'tinyurl.com',
      'ow.ly', 'is.gd', 'buff.ly', 'shorturl.at',
      'rebrand.ly', 'lnkd.in', 's.id', 'cut.ly',
      'tiny.cc', 'bit.do', 'cutt.ly', 't2m.io',
      'short.io', 'bl.ink', 'cli.re', 'lnnk.in'
    ];
    motivos.acortador = acortadores.includes(host);
    // ——— 3. IP ———
    motivos.ip = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(host);
    // ——— 4. CREDENCIALES ———
    motivos.credenciales = !!(url.username || url.password);
    // ——— 5. PARÁMETROS SOSPECHOSOS ———
    const sospechosos = ['redirect', 'url', 'next', 'continue', 'target'];
    const params = [...url.searchParams.keys()].map(k => k.toLowerCase());
    motivos.parametrosSospechosos = params.some(k => sospechosos.includes(k));
    motivos.rutaSospechosa = sospechosos.some(sos => url.pathname.toLowerCase().includes(sos));
    motivos.parametros = motivos.parametrosSospechosos || motivos.rutaSospechosa; // Para compatibilidad
    // ——— 6. HOMOGLIFOS ———
    const homoglifos = [
      0x2010, 0x3164, 0x202E, 0x200B, 0x2066, 0x2067, 0x2068, 0x2069,
      0x00AD, 0x200E, 0x200F, 0xFEFF, 0x034F
    ];
    for (const char of href) {
      if (homoglifos.includes(char.codePointAt(0))) {
        motivos.homoglifos = true;
        break;
      }
    }
    // ——— 7. CAMUFLAJE TIPOGRÁFICO (solo se decide tras RDAP) ———
    motivos._hayCamuflaje = patronesCamuflaje.some(p => p.test(host));
  }
  return motivos;
}

// En generarMensajesExplicativos, mostrar camuflaje tipográfico solo como información si existe junto a dominioNuevo
function generarMensajesExplicativos(motivos) {
  const mensajes = [];
  // 🚫 Prohibición
  if (motivos.alfabetos.length > 0)
    mensajes.push('🚫 Usa caracteres no latinos que pueden camuflarse visualmente');
  if (motivos.ip)
    mensajes.push('🚫 Dirige a una IP en lugar de un dominio reconocible');
  if (motivos.credenciales)
    mensajes.push('🚫 Incluye usuario o contraseña en la dirección');
  if (motivos.homoglifos)
    mensajes.push('🚫 Contiene letras invisibles o similares');
  // ⚠️ Precaución
  if (motivos.acortador)
    mensajes.push('⚠️ El destino real está oculto tras un acortador');
  if (motivos.parametrosSospechosos)
    mensajes.push('⚠️ Puede redirigir tras hacer clic (parámetro sospechoso)');
  if (motivos.rutaSospechosa)
    mensajes.push('⚠️ Puede redirigir tras hacer clic (ruta sospechosa)');
  // Mostrar camuflaje tipográfico solo si existe junto a dominioNuevo
  if (motivos.camuflajeTipografico && motivos.dominioNuevo)
    mensajes.push('⚠️ El dominio es nuevo y contiene caracteres ambiguos (posible camuflaje tipográfico)');
  // Sin emoji
  if (motivos.dominioNuevo)
    mensajes.push('⚠️ El dominio es muy reciente (menos de un año desde su registro)');
  if (motivos._dominioCaducadoReal)
    mensajes.push('⚠️ El dominio ha caducado (fecha de expiración real pasada)');
  else if (motivos._dominioCaducado)
    mensajes.push('El dominio no se ha renovado en más de un año (posible caducidad, estimado)');
  // Mensaje leve único si faltan ambos datos o no hay TLD soportado
  if (motivos.sinServidorRDAP) {
    mensajes.push('Precaución. No se han podido obtener los datos registrales ni evaluar el riesgo asociado. Compruebe que el nombre de dominio sea correcto antes de pulsar.');
  } else if (!motivos.fechaRegistro && !motivos.fechaExpiracion) {
    mensajes.push('Precaución. No se han podido obtener los datos registrales ni evaluar el riesgo asociado. Compruebe que el nombre de dominio sea correcto antes de pulsar.');
  }
  return mensajes;
}

// Modificar formatearPanelHtml para mostrar los elementos en el orden solicitado y mostrar fechas
function formatearPanelHtml(href, dominioRaiz, mensajes, motivos) {
  // Truncar la URL si es demasiado larga
  const MAX_URL_LENGTH = 120;
  const urlLegible = decodeURIComponent(href);
  let urlMostrada = urlLegible;
  if (urlLegible.length > MAX_URL_LENGTH) {
    urlMostrada = urlLegible.slice(0, MAX_URL_LENGTH - 3) + '...';
  }
  const dominioLegible = dominioRaiz
    ? dominioRaiz.toUpperCase()
    : '<span style="color:#e74c3c;">ILEGIBLE</span>';

  // Fechas
  const fechaRegistro = motivos && motivos.fechaRegistro
    ? new Date(motivos.fechaRegistro).toLocaleDateString()
    : '(no disponible)';
  const fechaRenovacion = motivos && motivos.fechaRenovacion
    ? new Date(motivos.fechaRenovacion).toLocaleDateString()
    : '(no disponible)';
  const fechaExpiracion = motivos && motivos.fechaExpiracion
    ? new Date(motivos.fechaExpiracion).toLocaleDateString()
    : '(no disponible)';

  // Motivos de alerta
  const cuerpoAlertas = mensajes.map(msg => `${msg}<br>`).join('');

  return (
    `<strong>Dominio:</strong> ${dominioLegible}<br>` +
    `<strong>Registro:</strong> ${fechaRegistro}<br>` +
    `<strong>Renovación:</strong> ${fechaRenovacion}<br>` +
    `<strong>Expiración:</strong> ${fechaExpiracion}<br>` +
    `<strong>Alerta:</strong> ${cuerpoAlertas}` +
    `<strong>URL:</strong> <span title="${urlLegible}">${urlMostrada}</span><br>`
  );
}

// ESTILO APLICADO AL ENLACE DETECTADO

// En la función de motivos graves:
// El motivo 'dominio caducado' solo constituye alerta grave si también hay camuflaje tipográfico
function esMotivoGrave(motivos) {
  return (
    (motivos.alfabetos && motivos.alfabetos.length > 0) ||
    motivos.acortador ||
    motivos.ip ||
    motivos.credenciales ||
    motivos.parametrosSospechosos ||
    motivos.rutaSospechosa ||
    motivos.homoglifos ||
    motivos.dominioNuevo ||
    motivos._dominioCaducadoReal
  );
}

function extraerDominioDesdeHref(href) {
  try {
    const limpio = href.trim();
    const corregido = /^https?:\/\//i.test(limpio)
      ? limpio
      : 'https://' + limpio;

    const url = new URL(corregido);
    const hostname = url.hostname.replace(/^www\./, '');
    
    // Extraer solo el dominio raíz (últimas dos partes)
    const partes = hostname.split('.');
    if (partes.length >= 2) {
      // Tomar las últimas dos partes para el dominio raíz
      return partes.slice(-2).join('.');
    }
    
    return hostname;
  } catch {
    return '(no reconocible)';
  }
}

// Modificar aplicarEstilo para modoPanel 'leve': no outline, solo panel informativo
function aplicarEstilo(link, href, colorElegido, motivos, modoPanel) {
  const dominioRaiz = extraerDominioDesdeHref(href);
  const mensajesExplicativos = generarMensajesExplicativos(motivos);
  const explicacionHtml = formatearPanelHtml(href, dominioRaiz, mensajesExplicativos, motivos);

  // ——— Color según lógica ———
  if (modoPanel === 'completo') {
    link.style.outline = `2px solid ${colorElegido || '#ff0000'}`;
  } else if (modoPanel === 'camuflaje') {
    link.style.outline = '2px solid #fca652';
  } else if (modoPanel === 'leve') {
    // No outline, solo panel informativo
    link.style.outline = '';
  }

  link.style.fontFamily = 'Consolas, monospace';
  link.dataset.detectado = 'true';

  const contenido = (modoPanel === 'soloDominio')
    ? `Dominio: ${dominioRaiz ? dominioRaiz.toUpperCase() : 'ILEGIBLE'}`
    : explicacionHtml;

  link.addEventListener('mouseenter', () => {
    mostrarPanelLateral(link, contenido, modoPanel);
  });

  link.addEventListener('mouseleave', () => {
    const panelId = modoPanel === 'soloDominio' ? 'panelDominioEnlace' : 'panelLateralEnlace';
    const panel = document.getElementById(panelId);
    if (panel) panel.style.display = 'none';
  });
}

function mostrarPanelLateral(link, contenidoHtml, modoPanel = 'completo') {
  chrome.storage.sync.get(['extensionActiva', 'modoOscuro', 'posicionPanel'], ({ extensionActiva, modoOscuro, posicionPanel }) => {
    if (extensionActiva === false) return;

    // Determinar qué tipo de panel usar
    const clasePanel = modoPanel === 'soloDominio' ? 'panel-reducido' : 'panel-entero';
    const panelId = modoPanel === 'soloDominio' ? 'panelDominioEnlace' : 'panelLateralEnlace';

    if (!window[panelId]) {
      const panel = document.createElement('div');
      panel.id = panelId;
      panel.className = clasePanel;
      document.body.appendChild(panel);
      window[panelId] = panel;
    }

    const panel = window[panelId];

    panel.classList.remove(
      'modo-oscuro',
      'panel-top-right',
      'panel-top-left',
      'panel-bottom-right',
      'panel-bottom-left',
      'panel-apagado'
    );

    if (modoOscuro) {
      panel.classList.add('modo-oscuro');
    }

    const posicionClase = 'panel-' + (posicionPanel || 'top-right');
    panel.classList.add(posicionClase);

    panel.innerHTML = contenidoHtml;

    if (extensionActiva === false) {
      panel.classList.add('panel-apagado');
    }

    panel.style.display = 'block';

    link.addEventListener('mouseleave', () => {
      panel.style.display = 'none';
    });
  });
}

// Cache global para resultados RDAP
const cacheRDAP = {};
// NUEVO: Cache de promesas para evitar consultas duplicadas por dominio raíz
const cacheRDAPPromesas = {};

// En analizarEnlaceConRDAP_cacheado, decide si camuflajeTipografico es motivo grave
async function analizarEnlaceConRDAP_cacheado(href) {
  // Motivos dependientes de la URL completa (no cacheables por dominio raíz)
  const motivosURL = evaluarMotivosDeAlerta(href);
  // Inicializar campos RDAP (se sobrescribirán si hay datos)
  motivosURL.dominioNuevo = false;
  motivosURL.fechaRegistro = null;
  motivosURL.fechaRenovacion = null;
  motivosURL.fechaExpiracion = null;
  motivosURL.sinServidorRDAP = false;

  try {
    const url = new URL(href);
    const dominioRaiz = extraerDominioDesdeHref(href);
    // --- NUEVO: Cache de promesas por dominio raíz ---
    if (!cacheRDAPPromesas[dominioRaiz]) {
      cacheRDAPPromesas[dominioRaiz] = (async () => {
        const servidorRDAP = await obtenerServidorRDAP(dominioRaiz);
        if (!servidorRDAP) {
          // Solo campos RDAP, no tocar motivosURL
          return {
            fechaRegistro: null,
            fechaRenovacion: null,
            fechaExpiracion: null,
            dominioNuevo: false,
            sinServidorRDAP: true,
            _dominioCaducado: false,
            _dominioCaducadoReal: false
          };
        }
        if (!cacheRDAP[dominioRaiz]) {
          cacheRDAP[dominioRaiz] = pruebaRDAP(dominioRaiz);
        }
        const { registro, actualizacion, expiracion } = await cacheRDAP[dominioRaiz];
        let expiracionReal = null;
        try {
          if (expiracion) {
            expiracionReal = expiracion;
          }
          if (!expiracionReal && cacheRDAP[dominioRaiz]?._rdapRaw) {
            const data = cacheRDAP[dominioRaiz]._rdapRaw;
            if (data.events) {
              for (const ev of data.events) {
                if (ev.eventAction === "expiration") expiracionReal = ev.eventDate;
              }
            }
            if (!expiracionReal && data.expiresDate) expiracionReal = data.expiresDate;
            if (!expiracionReal && data.expiryDate) expiracionReal = data.expiryDate;
            if (!expiracionReal && data.expirationDate) expiracionReal = data.expirationDate;
          }
          // Solo campos RDAP
          const resultado = {
            fechaRegistro: registro || null,
            fechaRenovacion: actualizacion || null,
            fechaExpiracion: expiracionReal || null,
            dominioNuevo: false,
            sinServidorRDAP: false,
            _dominioCaducado: false,
            _dominioCaducadoReal: false
          };
          if (registro) {
            const fechaRegistro = new Date(registro);
            const haceUnAño = new Date();
            haceUnAño.setFullYear(haceUnAño.getFullYear() - 1);
            if (fechaRegistro > haceUnAño) {
              resultado.dominioNuevo = true;
            }
          }
          if (expiracionReal) {
            const fechaExp = new Date(expiracionReal);
            if (fechaExp < new Date()) {
              resultado._dominioCaducadoReal = true;
              resultado._dominioCaducado = false;
            } else {
              resultado._dominioCaducadoReal = false;
              resultado._dominioCaducado = false;
            }
          } else if (actualizacion) {
            const fechaActualizacion = new Date(actualizacion);
            const haceUnAño = new Date();
            haceUnAño.setFullYear(haceUnAño.getFullYear() - 1);
            resultado._dominioCaducado = fechaActualizacion < haceUnAño;
            resultado._dominioCaducadoReal = false;
          }
          return resultado;
        } catch (e) {
          return {
            fechaRegistro: null,
            fechaRenovacion: null,
            fechaExpiracion: null,
            dominioNuevo: false,
            sinServidorRDAP: false,
            _dominioCaducado: false,
            _dominioCaducadoReal: false
          };
        }
      })();
    }
    // Esperar la promesa y fusionar motivos RDAP con motivosURL
    const motivosRDAP = await cacheRDAPPromesas[dominioRaiz];
    // Fusionar: los campos de motivosRDAP sobrescriben los de motivosURL solo en los campos RDAP
    const motivosFinal = {
      ...motivosURL,
      ...motivosRDAP
    };
    // Recalcular camuflajeTipografico con los motivos fusionados
    motivosFinal.camuflajeTipografico = Boolean(
      motivosFinal._hayCamuflaje && (
        motivosFinal.dominioNuevo || motivosFinal._dominioCaducadoReal || motivosFinal._dominioCaducado || motivosFinal.parametros
      )
    );
    return motivosFinal;
  } catch (e) {
    // Si falla la consulta RDAP, devolver motivosURL
    return motivosURL;
  }
}

let procesandoEnlaces = false;

function procesarEnlaces(forzar = false) {
  if (procesandoEnlaces) return;
  procesandoEnlaces = true;

  if (opcionesCargadas?.extensionActiva === false) {
    procesandoEnlaces = false;
    return;
  }

  const zona = obtenerZonaMensajes();

  if (!zona) {
    procesandoEnlaces = false;
    return;
  }

  const enlaces = zona.querySelectorAll('a[href]');

  enlaces.forEach((enlace, i) => {
    const href = enlace.getAttribute('href');
    const mostrarDominio = opcionesCargadas?.mostrarDominioSimple === true;

    // Evitar reprocesar enlaces ya analizados
    if (enlace.getAttribute('data-anomalia-procesado') === 'true') return;
    enlace.setAttribute('data-anomalia-procesado', 'true');

    // Estilo provisional mientras se analiza
    enlace.style.outline = '2px dashed #aaa';
    enlace.title = 'Analizando dominio...';

    analizarEnlaceConRDAP_cacheado(href).then(motivos => {
      // Quitar estilo provisional
      enlace.style.outline = '';
      enlace.title = '';

      const tieneMotivosGraves = esMotivoGrave(motivos);
      // Detectar advertencia leve (falta de datos registrales o TLD no soportado)
      const advertenciaLeve = (
        (!motivos.fechaRegistro && !motivos.fechaExpiracion) || motivos.sinServidorRDAP
      );

      let modoPanel = null;

      if (tieneMotivosGraves) {
        modoPanel = 'completo';
      } else if (advertenciaLeve) {
        modoPanel = 'leve'; // Nuevo modo para advertencia leve
      } else if (mostrarDominio) {
        modoPanel = 'soloDominio';
      } else {
        limpiarEstilosEnlace(enlace);
      }

      if (modoPanel) {
        aplicarEstilo(enlace, href, opcionesCargadas?.color, motivos, modoPanel);
      } else {
        limpiarEstilosEnlace(enlace);
      }
    });
  });

  procesandoEnlaces = false;
}

function obtenerZonaMensajes() {
  // Gmail: contenedor de correos
  const gmailZona = document.querySelector('div[role="main"]');

  // Outlook: zona de mensajes
  const outlookZona = document.querySelector('div[data-test-id="message-pane"]');

  // Devuelve el contenedor válido o null si no hay coincidencia
  return gmailZona || outlookZona || null;
}

function limpiarEstilosEnlace(enlace) {
  // Remover estilos inline
  enlace.style.border = '';
  enlace.style.borderRadius = '';
  enlace.style.padding = '';
  enlace.style.backgroundColor = '';
  enlace.style.color = '';
  enlace.style.textDecoration = '';
  enlace.style.fontWeight = '';
  enlace.style.outline = ''; // ¡IMPORTANTE! Limpiar el outline
  
  // Remover eventos
  if (enlace._mouseenterHandler) {
    enlace.removeEventListener('mouseenter', enlace._mouseenterHandler);
    delete enlace._mouseenterHandler;
  }
  if (enlace._mouseleaveHandler) {
    enlace.removeEventListener('mouseleave', enlace._mouseleaveHandler);
    delete enlace._mouseleaveHandler;
  }
  
  // Limpiar datos
  delete enlace.dataset.enlaceProcesado;
  delete enlace.dataset.detectado;
}

function limpiarEstilosExistentes() {
  const zona = obtenerZonaMensajes();
  if (!zona) return;
  
  // Limpiar estilos de enlaces
  const enlaces = zona.querySelectorAll('a[href]');
  enlaces.forEach(enlace => {
    // Remover estilos inline
    enlace.style.border = '';
    enlace.style.borderRadius = '';
    enlace.style.padding = '';
    enlace.style.backgroundColor = '';
    enlace.style.color = '';
    enlace.style.textDecoration = '';
    enlace.style.fontWeight = '';
    enlace.style.outline = ''; // ¡IMPORTANTE! Limpiar el outline
    
    // Remover eventos
    enlace.removeEventListener('mouseenter', enlace._mouseenterHandler);
    enlace.removeEventListener('mouseleave', enlace._mouseleaveHandler);
    
    // Limpiar datos
    delete enlace.dataset.enlaceProcesado;
    delete enlace.dataset.detectado;
    delete enlace._mouseenterHandler;
    delete enlace._mouseleaveHandler;
  });
  
  // Ocultar paneles existentes
  const paneles = document.querySelectorAll('.panel-entero, .panel-reducido');
  paneles.forEach(panel => {
    panel.style.display = 'none';
  });
}

let mensajeObserver = null;

const bodyObserver = new MutationObserver(() => {
  const zona = obtenerZonaMensajes();
  if (!zona || zona.dataset.observado) return;

  zona.dataset.observado = 'true';

  if (mensajeObserver) mensajeObserver.disconnect();

  mensajeObserver = new MutationObserver(mutations => {
    // Filtra los cambios: ignora los que afectan solo a nodos de la extensión
    const relevante = mutations.some(mutation =>
      Array.from(mutation.addedNodes).some(node =>
        !(node.nodeType === 1 && (node.classList?.contains('panel-entero') || node.classList?.contains('panel-reducido')))
      )
    );
    if (!relevante) return; // Si solo son paneles, no reproceses

    mensajeObserver.disconnect();
    chrome.storage.sync.get(clavesOpciones, opciones => {
      opcionesCargadas = opciones;

      if (opciones.extensionActiva === false) {
        return;
      }

      // Procesar todos los enlaces y esperar a que terminen
      const zona = obtenerZonaMensajes();
      if (!zona) return;
      const enlaces = zona.querySelectorAll('a[href]');
      const promesas = [];
      enlaces.forEach((enlace, i) => {
        const href = enlace.getAttribute('href');
        const mostrarDominio = opcionesCargadas?.mostrarDominioSimple === true;

        // Evitar reprocesar enlaces ya analizados
        if (enlace.getAttribute('data-anomalia-procesado') === 'true') return;
        enlace.setAttribute('data-anomalia-procesado', 'true');

        // Estilo provisional mientras se analiza
        enlace.style.outline = '2px dashed #aaa';
        enlace.title = 'Analizando dominio...';

        promesas.push(analizarEnlaceConRDAP_cacheado(href).then(motivos => {
          // Quitar estilo provisional
          enlace.style.outline = '';
          enlace.title = '';
          const tieneMotivosGraves = esMotivoGrave(motivos);
          // Detectar advertencia leve (falta de datos registrales o TLD no soportado)
          const advertenciaLeve = (
            (!motivos.fechaRegistro && !motivos.fechaExpiracion) || motivos.sinServidorRDAP
          );
          let modoPanel = null;
          if (tieneMotivosGraves) {
            modoPanel = 'completo';
          } else if (advertenciaLeve) {
            modoPanel = 'leve'; // Nuevo modo para advertencia leve
          } else if (mostrarDominio) {
            modoPanel = 'soloDominio';
          } else {
            limpiarEstilosEnlace(enlace);
          }
          if (modoPanel) {
            aplicarEstilo(enlace, href, opcionesCargadas?.color, motivos, modoPanel);
          } else {
            limpiarEstilosEnlace(enlace);
          }
        }));
      });
      Promise.all(promesas).then(() => {
        // Volver a observar después de procesar TODO
        mensajeObserver.observe(zona, { childList: true, subtree: true });
      });
    });
  });

  mensajeObserver.observe(zona, { childList: true, subtree: true });
});

bodyObserver.observe(document.body, {
  childList: true,
  subtree: true
});

chrome.runtime.onMessage.addListener((mensaje, sender, enviarRespuesta) => {
  if (mensaje.tipo === 'actualizarPreferencias') {
    chrome.storage.sync.get(clavesOpciones, opciones => {
      opcionesCargadas = opciones;
      
      // Siempre reprocesar enlaces existentes con las nuevas opciones
      if (opciones.extensionActiva !== false) {
        procesarEnlaces(true); // Forzar reanálisis completo
      } else {
        // Si la extensión está desactivada, limpiar todos los estilos
        limpiarEstilosExistentes();
      }
    });
  }
});

// Tabla de servidores RDAP oficiales por TLD (ampliada con los más populares)
const servidoresRDAP = {
  'com': 'https://rdap.verisign.com/com/v1/domain/',
  'net': 'https://rdap.verisign.com/net/v1/domain/',
  'es': 'https://rdap.nic.es/domain/',
  'org': 'https://rdap.publicinterestregistry.net/rdap/org/domain/',
  'info': 'https://rdap.afilias.info/rdap/info/domain/',
  'biz': 'https://rdap.neustar.biz/rdap/domain/',
  'eu': 'https://rdap.eu/domain/',
  'io': 'https://rdap.nic.io/domain/',
  'app': 'https://rdap.nic.google/domain/',
  'dev': 'https://rdap.nic.google/domain/',
  'ai': 'https://rdap.nic.ai/domain/',
  'co': 'https://rdap.centralnic.com/co/domain/',
  'us': 'https://rdap.neustar.us/rdap/domain/',
  'uk': 'https://rdap.nominet.uk/domain/',
  'me': 'https://rdap.nic.me/domain/',
  'tv': 'https://rdap.nic.tv/rdap/domain/',
  'xyz': 'https://rdap.centralnic.com/xyz/domain/',
  'online': 'https://rdap.centralnic.com/online/domain/',
  'site': 'https://rdap.centralnic.com/site/domain/',
  'store': 'https://rdap.centralnic.com/store/domain/',
  'it': 'https://rdap.nic.it/domain/', // Añadido TLD .it
  'cat': 'https://rdap.nic.cat/domain/',
  // Puede añadir más TLDs según necesidad
};

// --- NUEVO: Autocompletado dinámico de servidores RDAP con control de concurrencia y caché ---
const rdapPendingFetches = {};
async function obtenerServidorRDAP(dominio) {
  const partes = dominio.split('.');
  const tld = partes[partes.length - 1];

  // 1. Buscar en memoria
  if (servidoresRDAP[tld]) return servidoresRDAP[tld];

  // 2. Control de concurrencia: si ya hay una petición en curso para este TLD, espera a que termine
  if (rdapPendingFetches[tld]) {
    return await rdapPendingFetches[tld];
  }

  // 3. Buscar en chrome.storage.local (persistente por usuario)
  const storageKey = 'servidoresRDAP_dynamic';
  let dynamicList = {};
  try {
    dynamicList = (await new Promise(resolve => {
      chrome.storage.local.get([storageKey], res => resolve(res[storageKey] || {}));
    })) || {};
    if (dynamicList[tld]) {
      servidoresRDAP[tld] = dynamicList[tld]; // Añadir a memoria para esta sesión
      return dynamicList[tld];
    }
  } catch {}

  // 4. Consultar la IANA si no está
  rdapPendingFetches[tld] = (async () => {
    try {
      const resp = await fetch('https://data.iana.org/rdap/dns.json');
      if (resp.ok) {
        let data = null;
        try {
          data = await resp.json();
        } catch (e) {
          console.error('[Anomalia][RDAP] Error parseando JSON de IANA para .' + tld + ':', e);
          return null;
        }
        // Buscar el TLD exactamente en el array de servicios
        let service = null;
        try {
          service = (data.services || []).find(arr => arr[0].some(name => name === tld));
        } catch (e) {
          console.error('[Anomalia][RDAP] Error buscando TLD en servicios de IANA para .' + tld + ':', e);
          return null;
        }
        if (service && service[1] && service[1][0]) {
          const url = service[1][0].replace(/\/$/, '') + '/domain/';
          // Añadir a memoria inmediatamente
          servidoresRDAP[tld] = url;
          // Guardar en chrome.storage.local (no esperamos a que termine para devolver la URL)
          dynamicList[tld] = url;
          chrome.storage.local.set({ [storageKey]: dynamicList });
          // Sugerir línea para desarrollador (solo si no se ha sugerido antes)
          if (!servidoresRDAP._sugeridos) servidoresRDAP._sugeridos = {};
          if (!servidoresRDAP._sugeridos[tld]) {
            console.log(`[Anomalia][RDAP] Nuevo TLD detectado: añada esta línea a servidoresRDAP para hacerlo permanente:`);
            console.log(`  '${tld}': '${url}',`);
            servidoresRDAP._sugeridos[tld] = true;
          }
          return url;
        } else {
          // Solo mostrar advertencia si estamos en entorno de desarrollo (localhost o file: o flag global)
          if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.protocol === 'file:') ) {
            console.warn('[Anomalia][RDAP] No se encontró servidor RDAP para .' + tld + ' en la respuesta de IANA.');
          } else if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
            // Para entornos Node de desarrollo
            console.warn('[Anomalia][RDAP] No se encontró servidor RDAP para .' + tld + ' en la respuesta de IANA.');
          } // En producción, no mostrar advertencia
          return null;
        }
      } else {
        console.error('[Anomalia][RDAP] Error al consultar IANA para .' + tld + ':', resp.status, resp.statusText);
        return null;
      }
    } catch (e) {
      console.error('[Anomalia][RDAP] Error de red o parseo al consultar IANA para .' + tld + ':', e);
      return null;
    }
  })();

  const result = await rdapPendingFetches[tld];
  delete rdapPendingFetches[tld];
  return result;
}

// Refuerzo la función pruebaRDAP para que nunca lance errores ni deje excepciones sin capturar
async function pruebaRDAP(dominio) {
  const base = await obtenerServidorRDAP(dominio);
  if (!base) {
    // No hay servidor para este TLD, no es un error
    return { registro: null, actualizacion: null, expiracion: null, _rdapRaw: null };
  }
  const url = `${base}${dominio}`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      // No hay datos, pero no es un error crítico
      return { registro: null, actualizacion: null, expiracion: null, _rdapRaw: null };
    }
    const data = await resp.json();
    let registro = null, actualizacion = null, expiracion = null;
    if (data.events) {
      for (const ev of data.events) {
        if (ev.eventAction === "registration") registro = ev.eventDate;
        if (ev.eventAction === "last changed") actualizacion = ev.eventDate;
        if (ev.eventAction === "expiration") expiracion = ev.eventDate;
      }
    }
    if (!expiracion && data.expiresDate) expiracion = data.expiresDate;
    if (!expiracion && data.expiryDate) expiracion = data.expiryDate;
    if (!expiracion && data.expirationDate) expiracion = data.expirationDate;
    // Devuelve también el objeto crudo para análisis avanzado
    return { registro, actualizacion, expiracion, _rdapRaw: data };
  } catch (e) {
    // Error de red, parseo, etc. — nunca lanzar ni loguear como error
    return { registro: null, actualizacion: null, expiracion: null, _rdapRaw: null };
  }
}
