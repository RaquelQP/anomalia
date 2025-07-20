const base = 'icons/';
const iconos = {
  activo: {
    16: base + 'ojo-activo-16.png',
    48: base + 'ojo-activo-48.png',
    128: base + 'ojo-activo-128.png'
  },
  inactivo: {
    16: base + 'ojo-inactivo-16.png',
    48: base + 'ojo-inactivo-48.png',
    128: base + 'ojo-inactivo-128.png'
  },
  standby: {
    16: base + 'ojo-standby-16.png',
    48: base + 'ojo-standby-48.png',
    128: base + 'ojo-standby-128.png'
  }
};

function establecerIcono(tabId, url, extensionActiva) {
  if (!url || !tabId) return;

  const enGmail = url.startsWith('https://mail.google.com');
  const enOutlook = url.startsWith('https://outlook.live.com');
  const esCorreoCompatible = enGmail || enOutlook;

  let iconoFinal;
  
  if (esCorreoCompatible) {
    iconoFinal = extensionActiva !== false ? iconos.activo : iconos.inactivo;
  } else {
    iconoFinal = iconos.standby;
  }

  chrome.action.setIcon({ tabId, path: iconoFinal });
}

// 🧠 Función encapsulada para actualizar el icono en una pestaña
function actualizarIconoEnPestaña(tab) {
  if (tab?.id && tab?.url) {
    chrome.storage.sync.get('extensionActiva', ({ extensionActiva }) => {
      establecerIcono(tab.id, tab.url, extensionActiva);
    });
  }
}

// Se actualiza el icono al cambiar de pestaña o actualizar
function esPestaniaCompatible(url) {
  return /^https:\/\/(mail\.google\.com|outlook\.live\.com)/.test(url);
}

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    if (tab.url && esPestaniaCompatible(tab.url)) {
      chrome.tabs.sendMessage(tab.id, { tipo: 'actualizarPreferencias' });
    }
    // Siempre actualizar el icono cuando se cambia de pestaña
    actualizarIconoEnPestaña(tab);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && esPestaniaCompatible(tab.url)) {
    chrome.tabs.sendMessage(tabId, { tipo: 'actualizarPreferencias' });
  }
  // Siempre actualizar el icono cuando se actualiza la página
  if (changeInfo.status === 'complete') {
    actualizarIconoEnPestaña(tab);
  }
});

// Se actualiza al instalar la extensión
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    actualizarIconoEnPestaña(tabs[0]);
  });
});

// Se actualiza al iniciar Chrome
chrome.runtime.onStartup.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    actualizarIconoEnPestaña(tabs[0]);
  });
});

// Se actualiza el icono al recibir peticiones de popup o content
chrome.runtime.onMessage.addListener((mensaje, sender, enviarRespuesta) => {
  if (mensaje.tipo === 'actualizarIcono') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      actualizarIconoEnPestaña(tab);
    });
  }
  
  if (mensaje.tipo === 'actualizarPreferencias') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url && (tabs[0].url.includes('mail.google.com') || tabs[0].url.includes('outlook.live.com'))) {
        chrome.tabs.sendMessage(tabs[0].id, { tipo: 'actualizarPreferencias' });
      }
    });
  }
});

// Se actualiza el icono cuando cambia el estado de la extensión
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.extensionActiva) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab) {
        actualizarIconoEnPestaña(tab);
      }
    });
  }
});

// --- NUEVO: Comprobación de nueva versión en GitHub al iniciar ---
const GITHUB_API_URL = 'https://api.github.com/repos/RaquelQP/anomalia/releases/latest';
const RELEASES_URL = 'https://github.com/RaquelQP/anomalia/releases';

async function comprobarNuevaVersion() {
  try {
    const resp = await fetch(GITHUB_API_URL);
    if (!resp.ok) return;
    const data = await resp.json();
    const ultimaVersion = (data.tag_name || data.name || '').replace(/^v/, '');
    const versionLocal = chrome.runtime.getManifest().version;
    if (ultimaVersion && compararVersiones(ultimaVersion, versionLocal) > 0) {
      chrome.storage.sync.set({
        nuevaVersionDisponible: true,
        infoNuevaVersion: {
          version: ultimaVersion,
          url: RELEASES_URL
        }
      });
    } else {
      chrome.storage.sync.set({ nuevaVersionDisponible: false });
    }
  } catch (e) {
    // Silenciar errores de red
  }
}

// Compara dos strings de versión tipo '1.2.3'. Devuelve 1 si a > b, -1 si a < b, 0 si igual
function compararVersiones(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] || 0, nb = pb[i] || 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
}

chrome.runtime.onStartup.addListener(() => {
  comprobarNuevaVersion();
});

// También al instalar/actualizar
chrome.runtime.onInstalled.addListener(() => {
  comprobarNuevaVersion();
});