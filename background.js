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

  const iconoFinal = esCorreoCompatible
    ? (extensionActiva === false ? iconos.inactivo : iconos.activo)
    : iconos.standby;

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
      chrome.tabs.sendMessage(tab.id, { tipo: 'actualizarIcono' });
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && esPestaniaCompatible(tab.url)) {
    chrome.tabs.sendMessage(tabId, { tipo: 'actualizarPreferencias' });
    chrome.tabs.sendMessage(tabId, { tipo: 'actualizarIcono' });
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