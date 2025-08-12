// Elementos del DOM
const imageInput = document.getElementById("imageInput");
const imageCanvas = document.getElementById("imageCanvas");
const colorPalette = document.getElementById("colorPalette");
const notification = document.getElementById("notification");
const ctx = imageCanvas.getContext("2d");

// Elementos adicionales para drag & drop
let dropZone, selectFileBtn, imagePreview, clearBtn, emptyState, loading;

// Inicializar ColorThief
let colorThief;
try {
  colorThief = new ColorThief();
} catch (error) {
  console.error("Error al cargar ColorThief:", error);
  showNotification("Error: No se pudo cargar la librería de colores", [255, 0, 0]);
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado, iniciando PicPalette...');
  
  // Inicializar elementos del DOM
  if (!initializeElements()) {
    console.error('Error al inicializar elementos del DOM');
    showNotification("Error al inicializar la aplicación", [255, 0, 0]);
    return;
  }
  
  // Configurar event listeners
  setupEventListeners();
  
  // Verificar si ColorThief está disponible
  if (typeof ColorThief === 'undefined') {
    console.warn("ColorThief no está disponible, usando paleta aleatoria");
    showNotification("Usando paleta de colores aleatoria", [255, 165, 0]);
  }
  
  // Agregar funcionalidad de teclas de acceso rápido
  setupKeyboardShortcuts();
  
  // Mostrar mensaje de bienvenida
  setTimeout(() => {
    showNotification("¡Bienvenido a PicPalette! Arrastra una imagen para comenzar", [102, 126, 234]);
  }, 1000);
  
  console.log('PicPalette inicializado correctamente');
});

// Función para inicializar elementos del DOM
function initializeElements() {
  dropZone = document.getElementById('dropZone');
  selectFileBtn = document.getElementById('selectFileBtn');
  imagePreview = document.getElementById('imagePreview');
  clearBtn = document.getElementById('clearBtn');
  emptyState = document.getElementById('emptyState');
  loading = document.getElementById('loading');
  
  // Verificar que todos los elementos críticos existen
  if (!imageInput) {
    console.error('Error: No se encontró el elemento imageInput');
    return false;
  }
  
  if (!dropZone) {
    console.error('Error: No se encontró el elemento dropZone');
    return false;
  }
  
  if (!selectFileBtn) {
    console.error('Error: No se encontró el elemento selectFileBtn');
    return false;
  }
  
  console.log('Todos los elementos del DOM inicializados correctamente');
  return true;
}

// Función para configurar event listeners
function setupEventListeners() {
  // Event listener para input file
  imageInput.addEventListener("change", handleImageUpload);
  
  // Conectar botón con input file - Asegurar que funcione
  if (selectFileBtn) {
    selectFileBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Botón seleccionar imagen clickeado');
      imageInput.click();
    });
  }
  
  // También hacer que toda el área de drop sea clickeable
  if (dropZone) {
    dropZone.addEventListener('click', function(e) {
      // Solo abrir el selector si no se hizo clic en el botón
      if (e.target !== selectFileBtn && !selectFileBtn.contains(e.target)) {
        imageInput.click();
      }
    });
    
    setupDragAndDrop();
  }
  
  // Configurar botón limpiar
  if (clearBtn) {
    clearBtn.addEventListener('click', clearAll);
  }
  
  // Debug: verificar que los elementos existen
  console.log('Elementos encontrados:', {
    imageInput: !!imageInput,
    selectFileBtn: !!selectFileBtn,
    dropZone: !!dropZone,
    clearBtn: !!clearBtn
  });
}

// Función para configurar drag and drop
function setupDragAndDrop() {
  // Prevenir comportamiento por defecto del navegador
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
  });

  // Eventos de drag and drop
  dropZone.addEventListener('dragenter', highlight, false);
  dropZone.addEventListener('dragover', highlight, false);
  dropZone.addEventListener('dragleave', unhighlight, false);
  dropZone.addEventListener('drop', handleDrop, false);
}

// Funciones auxiliares para drag and drop
function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) {
  dropZone.classList.add('dragover');
}

function unhighlight(e) {
  dropZone.classList.remove('dragover');
}

function handleDrop(e) {
  unhighlight(e);
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    // Simular selección de archivo
    imageInput.files = files;
    // Disparar evento change manualmente
    const event = new Event('change', { bubbles: true });
    imageInput.dispatchEvent(event);
  }
}

// Función principal para manejar la carga de imágenes
function handleImageUpload(e) {
  const file = e.target.files[0];
  
  if (!file) return;
  
  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    showNotification("Por favor, selecciona un archivo de imagen válido", [255, 0, 0]);
    return;
  }
  
  // Validar tamaño del archivo (máximo 10MB)
  if (file.size > 10 * 1024 * 1024) {
    showNotification("La imagen es demasiado grande. Máximo 10MB", [255, 0, 0]);
    return;
  }

  // Mostrar estado de carga
  showLoading();

  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    
    img.onload = function () {
      try {
        // Ocultar estado de carga
        hideLoading();
        
        displayImage(img);
        extractColors(img);
        
        // Mostrar vista previa
        showImagePreview();
        
        showNotification("Imagen procesada exitosamente", [0, 255, 0]);
      } catch (error) {
        console.error("Error al procesar la imagen:", error);
        showNotification("Error al procesar la imagen", [255, 0, 0]);
        hideLoading();
      }
    };
    
    img.onerror = function () {
      showNotification("Error al cargar la imagen", [255, 0, 0]);
      hideLoading();
    };
    
    img.src = event.target.result;
  };

  reader.onerror = function () {
    showNotification("Error al leer el archivo", [255, 0, 0]);
    hideLoading();
  };

  reader.readAsDataURL(file);
}

// Función para mostrar la imagen en el canvas
function displayImage(img) {
  const MAX_WIDTH = 400;
  const MAX_HEIGHT = 300;
  
  let { width, height } = calculateDimensions(img.width, img.height, MAX_WIDTH, MAX_HEIGHT);
  
  imageCanvas.width = width;
  imageCanvas.height = height;
  
  // Limpiar canvas
  ctx.clearRect(0, 0, width, height);
  
  // Dibujar imagen
  ctx.drawImage(img, 0, 0, width, height);
}

// Función para calcular dimensiones manteniendo proporción
function calculateDimensions(imgWidth, imgHeight, maxWidth, maxHeight) {
  let width = imgWidth;
  let height = imgHeight;
  
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }
  
  return { width, height };
}

// Función para extraer colores
function extractColors(img) {
  if (!colorThief) {
    showNotification("Error: Librería de colores no disponible", [255, 0, 0]);
    return;
  }

  try {
    const colors = colorThief.getPalette(img, 12); // Aumentar a 12 colores
    displayColors(colors);
  } catch (error) {
    console.error("Error al extraer colores:", error);
    showNotification("Error al extraer colores de la imagen", [255, 0, 0]);
  }
}

// Función para mostrar los colores
function displayColors(colors) {
  colorPalette.innerHTML = "";

  colors.forEach((color, index) => {
    const hexValue = rgbToHex(color[0], color[1], color[2]);
    const rgbValue = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    const hslValue = rgbToHsl(color[0], color[1], color[2]);

    const listItem = document.createElement("li");
    listItem.className = "color-item bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg";
    listItem.style.borderLeft = `4px solid ${hexValue}`;

    const colorPreview = document.createElement("div");
    colorPreview.className = "w-full h-20";
    colorPreview.style.backgroundColor = hexValue;

    const colorInfo = document.createElement("div");
    colorInfo.className = "p-3 text-center";
    
    const hexText = document.createElement("div");
    hexText.className = "font-mono text-sm font-bold mb-1";
    hexText.textContent = hexValue;
    
    const rgbText = document.createElement("div");
    rgbText.className = "text-xs text-gray-600 mb-1";
    rgbText.textContent = rgbValue;
    
    const hslText = document.createElement("div");
    hslText.className = "text-xs text-gray-500";
    hslText.textContent = `HSL: ${hslValue}`;

    colorInfo.appendChild(hexText);
    colorInfo.appendChild(rgbText);
    colorInfo.appendChild(hslText);

    listItem.appendChild(colorPreview);
    listItem.appendChild(colorInfo);

    listItem.addEventListener("click", function () {
      copyToClipboard(hexValue);
      showNotification(`Color copiado: ${hexValue}`, color);
      
      // Efecto visual al copiar
      listItem.style.transform = "scale(0.95)";
      setTimeout(() => {
        listItem.style.transform = "scale(1)";
      }, 150);
    });

    // Agregar animación de entrada
    listItem.style.opacity = "0";
    listItem.style.transform = "translateY(20px)";
    
    colorPalette.appendChild(listItem);
    
    // Animar entrada con delay
    setTimeout(() => {
      listItem.style.transition = "all 0.5s ease";
      listItem.style.opacity = "1";
      listItem.style.transform = "translateY(0)";
    }, index * 100);
  });
}

// Función para copiar al portapapeles usando la API moderna
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback para navegadores más antiguos
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-999999px";
      textarea.style.top = "-999999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
  } catch (error) {
    console.error("Error al copiar al portapapeles:", error);
    showNotification("Error al copiar al portapapeles", [255, 0, 0]);
  }
}

// Función para mostrar notificaciones
function showNotification(message, color) {
  const [r, g, b] = color || [0, 0, 0];
  const hexColor = rgbToHex(r, g, b);
  
  notification.innerHTML = `
    <div class="flex items-center space-x-3">
      <div class="w-4 h-4 rounded-full border-2 border-white" style="background-color: ${hexColor}"></div>
      <span class="font-medium">${message}</span>
    </div>
  `;
  
  notification.style.display = "block";
  notification.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.9)`;
  
  // Auto-ocultar después de 3 segundos
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

// Función para convertir RGB a HEX
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// Función auxiliar para convertir componente a HEX
function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

// Función para convertir RGB a HSL
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
}

// Función para generar paleta de colores aleatorios (fallback)
function generateRandomPalette() {
  const colors = [];
  for (let i = 0; i < 12; i++) {
    colors.push([
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256)
    ]);
  }
  return colors;
}

// Función para limpiar la paleta
function clearPalette() {
  colorPalette.innerHTML = "";
  ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
  imageInput.value = "";
}

// Función para exportar paleta como JSON
function exportPalette() {
  const colors = Array.from(colorPalette.children).map(item => {
    const hex = item.querySelector('.font-mono').textContent;
    const rgb = item.querySelector('.text-xs').textContent;
    const hsl = item.querySelector('.text-xs:last-child').textContent;
    
    return { hex, rgb, hsl };
  });
  
  const dataStr = JSON.stringify(colors, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = 'picpalette-colors.json';
  link.click();
}

// Función para generar paleta de colores complementarios
function generateComplementaryPalette(baseColor) {
  const colors = [];
  const [r, g, b] = baseColor;
  
  // Color base
  colors.push([r, g, b]);
  
  // Color complementario
  colors.push([255 - r, 255 - g, 255 - b]);
  
  // Colores análogos
  colors.push([Math.min(255, r + 30), g, b]);
  colors.push([r, Math.min(255, g + 30), b]);
  colors.push([r, g, Math.min(255, b + 30)]);
  
  // Colores triádicos
  const hue = rgbToHue(r, g, b);
  const triadic1 = hueToRgb((hue + 120) % 360);
  const triadic2 = hueToRgb((hue + 240) % 360);
  
  colors.push(triadic1);
  colors.push(triadic2);
  
  return colors;
}

// Función auxiliar para convertir RGB a Hue
function rgbToHue(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  
  if (max === min) {
    h = 0;
  } else {
    const d = max - min;
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return h * 360;
}

// Función auxiliar para convertir Hue a RGB
function hueToRgb(h) {
  h /= 60;
  const c = 1;
  const x = c * (1 - Math.abs(h % 2 - 1));
  const m = 0;
  
  let r, g, b;
  if (h < 1) [r, g, b] = [c, x, 0];
  else if (h < 2) [r, g, b] = [x, c, 0];
  else if (h < 3) [r, g, b] = [0, c, x];
  else if (h < 4) [r, g, b] = [0, x, c];
  else if (h < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}

// Función para limpiar todo
function clearAll() {
  colorPalette.innerHTML = '';
  ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
  imageInput.value = '';
  hideImagePreview();
  showNotification("Paleta limpiada", [255, 165, 0]);
}

// Función para mostrar vista previa
function showImagePreview() {
  if (imagePreview) {
    imagePreview.style.display = 'block';
  }
  if (emptyState) {
    emptyState.style.display = 'none';
  }
}

// Función para ocultar vista previa
function hideImagePreview() {
  if (imagePreview) {
    imagePreview.style.display = 'none';
  }
  if (emptyState) {
    emptyState.style.display = 'block';
  }
}

// Función para mostrar estado de carga
function showLoading() {
  if (loading) {
    loading.style.display = 'block';
  }
}

// Función para ocultar estado de carga
function hideLoading() {
  if (loading) {
    loading.style.display = 'none';
  }
}

// Función para configurar atajos de teclado
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + E para exportar
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
      e.preventDefault();
      if (colorPalette.children.length > 0) {
        exportPalette();
        showNotification("Paleta exportada como JSON", [0, 255, 0]);
      }
    }
    
    // Ctrl/Cmd + L para limpiar
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
      e.preventDefault();
      clearAll();
    }
  });
}
