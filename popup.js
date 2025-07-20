// ============================================================================
// CONSTANTES Y CONFIGURACIONES
// ============================================================================

// URLs de plataformas compatibles
const PLATAFORMAS_COMPATIBLES = {
  GMAIL: 'https://mail.google.com',
  OUTLOOK: 'https://outlook.live.com'
};

// Rutas de iconos por estado
const ICONOS_EXTENSION = {
  STANDBY: 'icons/extension-standby.png',
  ACTIVA: 'icons/extension-activa.png',
  INACTIVA: 'icons/extensión-inactiva.png',
  PENDING: 'icons/extension-pending.png'
};

// Configuración por defecto
const CONFIG_DEFAULT = {
  color: 'red',
  extensionActiva: true,
  modoOscuro: false,
  posicionPanel: 'top-right',
  mostrarDominioSimple: false
};

// Configuración de avisos
const AVISO_CONFIG = {
  background: '#fff3cd',
  color: '#856404',
  border: '1px solid #ffeeba',
  padding: '10px',
  marginBottom: '10px',
  fontWeight: 'bold',
  textAlign: 'center',
  position: 'relative',
  top: '0',
  left: '0',
  zIndex: '1000'
};

// Timeouts
const TIMEOUTS = {
  MENSAJE_ESTADO: 1500,
  MENSAJE_GUARDADO: 2000,
  ACTUALIZACION_PESTANA: 100
};

// ============================================================================
// FUNCIONES UTILITARIAS
// ============================================================================

// Función para mostrar aviso de nueva versión
function mostrarAvisoNuevaVersion(info) {
  let aviso = document.getElementById('aviso-nueva-version');
  if (!aviso) {
    aviso = document.createElement('div');
    aviso.id = 'aviso-nueva-version';
    const contenedor = document.body || document.documentElement;
    contenedor.insertBefore(aviso, contenedor.firstChild);
  }
  
  // Aplicar estilos
  Object.assign(aviso.style, AVISO_CONFIG);
  
  aviso.innerHTML = `Se encuentra disponible una nueva versión de Anomalia. <a href="${info.url}" target="_blank" style="color:#856404;text-decoration:underline;">Visite este enlace</a> para descargarla.`;
}

// ============================================================================
// INICIALIZACIÓN PRINCIPAL
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Referencias del DOM
  const colorSelect = document.getElementById('colorSelect');
  const guardarBtn = document.getElementById('guardarBtn');
  const estadoGuardado = document.getElementById('estadoGuardado');
  const extensionIcon = document.getElementById('extension-icon');
  const extensionToggle = document.querySelector('.extension-toggle');
  const extensionStatus = document.getElementById('extension-status');
  const toggleDarkMode = document.getElementById('toggle-darkmode');
  const positionSelect = document.getElementById('panel-position');
  const mostrarDominioSimple = document.getElementById('mostrarDominioSimple');

  // Función para actualizar el icono de la extensión (dentro del scope para acceder a extensionIcon)
  function actualizarIconoExtension(extensionActiva, url, isPending = false) {
    const enGmail = url && url.startsWith(PLATAFORMAS_COMPATIBLES.GMAIL);
    const enOutlook = url && url.startsWith(PLATAFORMAS_COMPATIBLES.OUTLOOK);
    const esCorreoCompatible = enGmail || enOutlook;

    let iconoSrc = ICONOS_EXTENSION.STANDBY;
    
    if (esCorreoCompatible) {
      if (isPending) {
        iconoSrc = ICONOS_EXTENSION.PENDING;
      } else {
        iconoSrc = extensionActiva !== false ? ICONOS_EXTENSION.ACTIVA : ICONOS_EXTENSION.INACTIVA;
      }
    }
    
    if (extensionIcon) {
      extensionIcon.src = iconoSrc;
    }
  }

  // Cargar configuración desde storage
  chrome.storage.sync.get([
    'color',
    'extensionActiva',
    'modoOscuro',
    'posicionPanel',
    'mostrarDominioSimple'
  ], datos => {
    if (datos.color) colorSelect.value = datos.color;
    toggleDarkMode.checked = datos.modoOscuro === true;
    positionSelect.value = datos.posicionPanel || CONFIG_DEFAULT.posicionPanel;
    mostrarDominioSimple.checked = datos.mostrarDominioSimple === true;
    
    // Inicializar el estado visual del toggle
    if (datos.extensionActiva !== false) {
      extensionToggle.classList.add('active');
      extensionStatus.textContent = 'Activada';
    } else {
      extensionToggle.classList.remove('active');
      extensionStatus.textContent = 'Desactivada';
    }
    
    // Obtener la URL de la pestaña activa para actualizar el icono
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        actualizarIconoExtension(datos.extensionActiva, tabs[0].url);
      }
    });
  });

  // Event listener para el icono de extensión (solo cambia visualmente, no se guarda hasta "Guardar")
  extensionToggle.addEventListener('click', () => {
    // Solo cambiar visualmente el estado del toggle
    const nuevoEstado = extensionToggle.classList.contains('active') ? false : true;
    
    if (nuevoEstado) {
      extensionToggle.classList.add('active');
      extensionStatus.textContent = 'Activada';
    } else {
      extensionToggle.classList.remove('active');
      extensionStatus.textContent = 'Desactivada';
    }
    
    // Añadir indicador visual de cambio pendiente
    extensionToggle.classList.add('pending');
    
    // Actualizar el icono a estado pendiente
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        actualizarIconoExtension(nuevoEstado, tabs[0].url, true);
      }
    });
    
    // Mostrar mensaje temporal
    estadoGuardado.textContent = nuevoEstado ? 'Extensión activada (pendiente de guardar)' : 'Extensión desactivada (pendiente de guardar)';
    setTimeout(() => {
      estadoGuardado.textContent = '';
    }, TIMEOUTS.MENSAJE_ESTADO);
  });

  // Guardar todas las opciones
  guardarBtn.addEventListener('click', () => {
    // Obtener el estado actual del toggle (visual)
    const extensionActiva = extensionToggle.classList.contains('active');
    
    const nuevasOpciones = {
      color: colorSelect.value,
      extensionActiva: extensionActiva, // Usar el estado visual del toggle
      modoOscuro: toggleDarkMode.checked,
      posicionPanel: positionSelect.value,
      mostrarDominioSimple: mostrarDominioSimple.checked
    };

    chrome.storage.sync.set(nuevasOpciones, () => {
      // Quitar indicador visual de cambio pendiente
      extensionToggle.classList.remove('pending');
      estadoGuardado.textContent = 'Opciones guardadas con éxito';

      // Actualizar el icono del popup inmediatamente
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          actualizarIconoExtension(extensionActiva, tabs[0].url);
        }
      });

      // Enviar mensaje directo a la pestaña activa
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url && (tabs[0].url.includes('mail.google.com') || tabs[0].url.includes('outlook.live.com'))) {
          chrome.tabs.sendMessage(tabs[0].id, { tipo: 'actualizarPreferencias' });
        }
      });

      chrome.runtime.sendMessage({ tipo: 'actualizarIcono' });
      chrome.runtime.sendMessage({ tipo: 'actualizarPreferencias' });

      // Enviar también directamente a la pestaña activa como respaldo
      setTimeout(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0] && tabs[0].url && (tabs[0].url.includes('mail.google.com') || tabs[0].url.includes('outlook.live.com'))) {
            chrome.tabs.sendMessage(tabs[0].id, { tipo: 'actualizarPreferencias' });
          }
        });
      }, TIMEOUTS.ACTUALIZACION_PESTANA);

      setTimeout(() => {
        estadoGuardado.textContent = '';
      }, TIMEOUTS.MENSAJE_GUARDADO);
    });
  });

  // Nota: Las opciones se guardan solo al hacer clic en "Guardar"
  // Esto evita cambios accidentales y mantiene consistencia
  
  // --- NUEVO: Aviso de nueva versión disponible ---
  chrome.storage.sync.get(['nuevaVersionDisponible', 'infoNuevaVersion'], ({ nuevaVersionDisponible, infoNuevaVersion }) => {
    if (nuevaVersionDisponible && infoNuevaVersion && infoNuevaVersion.version && infoNuevaVersion.url) {
      mostrarAvisoNuevaVersion(infoNuevaVersion);
    }
  });
});