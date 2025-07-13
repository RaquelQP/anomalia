let opcionesCargadas = {};

const clavesOpciones = [
  'color',
  'detectarCamuflaje',
  'extensionActiva',
  'modoOscuro',
  'posicionPanel',
  'mostrarDominioSimple'
];

function evaluarMotivosDeAlerta(href, detectarCamuflaje) {
  const motivos = {
    alfabetos: [],
    acortador: false,
    ip: false,
    credenciales: false,
    parametros: false,
    homoglifos: false,
    camuflaje: false
  };

  try {
    const url = new URL(href);
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
    motivos.parametros = [...url.searchParams.keys()]
      .map(k => k.toLowerCase())
      .some(k => sospechosos.includes(k));

    // ——— 6. HOMOGLIFOS ———
    const homoglifos = [
      0x2010, // Hyphen
      0x3164, // Hangul Filler
      0x202E, // RLO
      0x200B, // Zero Width Space
      0x2066, // LRI
      0x2067, // RLI
      0x2068, // FSI
      0x2069, // PDI
      0x00AD, // Soft Hyphen
      0x200E, // LRM
      0x200F, // RLM
      0xFEFF, // ZWNBSP
      0x034F  // Grapheme Joiner
    ];
    for (const char of href) {
      if (homoglifos.includes(char.codePointAt(0))) {
        motivos.homoglifos = true;
        break;
      }
    }

    // ——— 7. CAMUFLAJE (opcional) ———
    if (detectarCamuflaje) {
      const patrones = [/0/, /1/, /rn/, /O/, /I/, /vv/, /cl/, /l/];
      motivos.camuflaje = patrones.some(p => p.test(host));
    }

  } catch {
    // Si no se puede parsear la URL, no se evalúa
  }

  return motivos;
}

function generarMensajesExplicativos(motivos) {
  const mensajes = [];

  if (motivos.alfabetos.length > 0)
    mensajes.push('Usa caracteres no latinos que pueden camuflarse visualmente');
  if (motivos.acortador)
    mensajes.push('El destino real está oculto tras un acortador');
  if (motivos.ip)
    mensajes.push('Dirige a una IP en lugar de un dominio reconocible');
  if (motivos.credenciales)
    mensajes.push('Incluye usuario o contraseña en la dirección');
  if (motivos.parametros)
    mensajes.push('Puede redirigir tras hacer clic');
  if (motivos.homoglifos)
    mensajes.push('Contiene letras invisibles o similares');

  const tieneAlertasPrevias =
    motivos.alfabetos.length > 0 ||
    motivos.acortador ||
    motivos.ip ||
    motivos.credenciales ||
    motivos.parametros ||
    motivos.homoglifos;

  if (motivos.camuflaje && !tieneAlertasPrevias)
    mensajes.push('El dominio contiene caracteres ambiguos que pueden inducir a error');

  return mensajes;
}

function formatearPanelHtml(href, dominioRaiz, mensajes) {
  const urlLegible = decodeURIComponent(href);
  const dominioLegible = dominioRaiz
  ? dominioRaiz.toUpperCase()
  : '<span style="color:#e74c3c;">ILEGIBLE</span>';
  const cuerpoAlertas = mensajes.map(msg => `${msg}<br>`).join('');

  return (
    `<strong>URL:</strong> ${urlLegible}<br>` +
    `<strong>Dominio:</strong> ${dominioLegible}<br>` +
    `<strong>Alerta:</strong> ${cuerpoAlertas}`
  );
}

// ESTILO APLICADO AL ENLACE DETECTADO

function esMotivoGrave(motivos) {
  return (
    (motivos.alfabetos && motivos.alfabetos.length > 0) ||
    motivos.acortador ||
    motivos.ip ||
    motivos.credenciales ||
    motivos.parametros ||
    motivos.homoglifos
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

function aplicarEstilo(link, href, colorElegido, motivos, modoPanel) {
  const dominioRaiz = extraerDominioDesdeHref(href);
  const mensajesExplicativos = generarMensajesExplicativos(motivos);
  const explicacionHtml = formatearPanelHtml(href, dominioRaiz, mensajesExplicativos);

  // ——— Color según lógica ———
  if (modoPanel === 'completo') {
    link.style.outline = `2px solid ${colorElegido || '#ff0000'}`;
  } else if (modoPanel === 'camuflaje') {
    link.style.outline = '2px solid #fca652';
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



function procesarEnlaces(forzar = false) {
  if (opcionesCargadas?.extensionActiva === false) {
    return;
  }

  const zona = obtenerZonaMensajes();

  if (!zona) {
    return;
  }

  const enlaces = zona.querySelectorAll('a[href]');

  enlaces.forEach((enlace, i) => {
    const href = enlace.getAttribute('href');
    const detectarCamuflaje = opcionesCargadas?.detectarCamuflaje;
    const mostrarDominio = opcionesCargadas?.mostrarDominioSimple === true;

    if (!forzar && enlace.dataset.enlaceProcesado === 'true') {
      return;
    }

    enlace.dataset.enlaceProcesado = 'true';
    
    const motivos = evaluarMotivosDeAlerta(href, detectarCamuflaje);
    const tieneMotivosGraves = esMotivoGrave(motivos);
    const tieneCamuflaje = motivos.camuflaje === true;

    let modoPanel = null;

    // PRIORIDAD 1: esMotivoGrave (máxima prioridad)
    if (tieneMotivosGraves) {
      modoPanel = 'completo';
    }
    // PRIORIDAD 2: motivos.camuflaje (si está activado y es positivo, prevalece sobre mostrarDominio)
    else if (tieneCamuflaje && detectarCamuflaje) {
      modoPanel = 'camuflaje';
    }
    // PRIORIDAD 3: mostrarDominio (solo si no hay otras funciones con prioridad)
    else if (mostrarDominio) {
      modoPanel = 'soloDominio';
    }
    // Sin panel si no se cumple ninguna condición
    else {
      // Limpiar estilos existentes del enlace
      limpiarEstilosEnlace(enlace);
    }

    if (modoPanel) {
      aplicarEstilo(enlace, href, opcionesCargadas?.color, motivos, modoPanel);
    } else {
      // También limpiar si no hay modoPanel
      limpiarEstilosEnlace(enlace);
    }
  });
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

  mensajeObserver = new MutationObserver(() => {
    chrome.storage.sync.get(clavesOpciones, opciones => {
      opcionesCargadas = opciones;

      if (opciones.extensionActiva === false) {
        return;
      }

      procesarEnlaces(true); // Forzar reanálisis completo
      chrome.runtime.sendMessage({ tipo: 'actualizarIcono' });
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