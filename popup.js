document.addEventListener('DOMContentLoaded', () => {
  // Referencias del DOM
  const colorSelect = document.getElementById('colorSelect');
  const camuflajeCheckbox = document.getElementById('camuflajeCheckbox');
  const guardarBtn = document.getElementById('guardarBtn');
  const estadoGuardado = document.getElementById('estadoGuardado');
  const extensionIcon = document.getElementById('extension-icon');
  const extensionToggle = document.querySelector('.extension-toggle');
  const toggleDarkMode = document.getElementById('toggle-darkmode');
  const positionSelect = document.getElementById('panel-position');
  const mostrarDominioSimple = document.getElementById('mostrarDominioSimple');

  // Función para actualizar el icono de la extensión
  function actualizarIconoExtension(extensionActiva, url) {
    const enGmail = url && url.startsWith('https://mail.google.com');
    const enOutlook = url && url.startsWith('https://outlook.live.com');
    const esCorreoCompatible = enGmail || enOutlook;

    let iconoSrc = 'icons/extension-standby.png';
    
    if (esCorreoCompatible) {
      iconoSrc = extensionActiva !== false ? 'icons/extension-activa.png' : 'icons/extensión-inactiva.png';
    }
    
    extensionIcon.src = iconoSrc;
  }

  // Cargar configuración desde storage
  chrome.storage.sync.get([
    'color',
    'detectarCamuflaje',
    'extensionActiva',
    'modoOscuro',
    'posicionPanel',
    'mostrarDominioSimple'
  ], datos => {
    if (datos.color) colorSelect.value = datos.color;
    camuflajeCheckbox.checked = !!datos.detectarCamuflaje;
    toggleDarkMode.checked = datos.modoOscuro === true;
    positionSelect.value = datos.posicionPanel || 'top-right';
    mostrarDominioSimple.checked = datos.mostrarDominioSimple === true;
    
    // Obtener la URL de la pestaña activa para actualizar el icono
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        actualizarIconoExtension(datos.extensionActiva, tabs[0].url);
      }
    });
  });



  // Event listener para el icono de extensión
  extensionToggle.addEventListener('click', () => {
    chrome.storage.sync.get('extensionActiva', (datos) => {
      const nuevoEstado = datos.extensionActiva === false ? true : false;
      
      chrome.storage.sync.set({ extensionActiva: nuevoEstado }, () => {
        // Actualizar el icono inmediatamente
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            actualizarIconoExtension(nuevoEstado, tabs[0].url);
          }
        });
        
        // Enviar mensajes para actualizar la extensión
        chrome.runtime.sendMessage({ tipo: 'actualizarIcono' });
        chrome.runtime.sendMessage({ tipo: 'actualizarPreferencias' });
        
        // Mostrar mensaje de confirmación
        estadoGuardado.textContent = nuevoEstado ? 'Extensión activada' : 'Extensión desactivada';
        setTimeout(() => {
          estadoGuardado.textContent = '';
        }, 1500);
      });
    });
  });



  // Guardar todas las opciones
  guardarBtn.addEventListener('click', () => {
    chrome.storage.sync.get('extensionActiva', (datos) => {
      const nuevasOpciones = {
        color: colorSelect.value,
        detectarCamuflaje: camuflajeCheckbox.checked,
        extensionActiva: datos.extensionActiva !== false, // Mantener el estado actual
        modoOscuro: toggleDarkMode.checked,
        posicionPanel: positionSelect.value,
        mostrarDominioSimple: mostrarDominioSimple.checked
      };

          chrome.storage.sync.set(nuevasOpciones, () => {
        estadoGuardado.textContent = 'Opciones guardadas con éxito';

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
        }, 100);

        setTimeout(() => {
          estadoGuardado.textContent = '';
        }, 2000);
      });
    });
  });

  // Guardar opciones individuales que no afectan la lógica
  toggleDarkMode.addEventListener('change', () => {
    chrome.storage.sync.set({ modoOscuro: toggleDarkMode.checked });
  });

  positionSelect.addEventListener('change', () => {
    chrome.storage.sync.set({ posicionPanel: positionSelect.value });
  });
});