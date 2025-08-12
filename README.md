# 🎨 PicPalette

**Extractor de Colores Inteligente para Imágenes**

PicPalette es una herramienta web moderna y gratuita que extrae automáticamente los colores predominantes de tus imágenes favoritas. Perfecta para diseñadores, artistas, desarrolladores web y cualquier persona que trabaje con colores.

![PicPalette Screenshot](https://via.placeholder.com/800x400/667eea/ffffff?text=PicPalette+Screenshot)

## ✨ Características

- 🖼️ **Extracción Automática**: Analiza imágenes y extrae hasta 12 colores predominantes
- 🎯 **Múltiples Formatos**: Soporta JPG, PNG, GIF y WebP
- 📱 **Diseño Responsivo**: Funciona perfectamente en dispositivos móviles y de escritorio
- 🎨 **Información Completa**: Muestra códigos HEX, RGB y HSL para cada color
- 📋 **Copia Rápida**: Haz clic en cualquier color para copiar su código HEX
- 🚀 **Drag & Drop**: Arrastra y suelta imágenes directamente en la aplicación
- 💾 **Exportación**: Exporta tu paleta de colores en formato JSON
- ⌨️ **Atajos de Teclado**: Navega rápidamente con combinaciones de teclas
- 🌙 **Modo Oscuro**: Soporte automático para preferencias del sistema
- ♿ **Accesible**: Diseñado siguiendo las mejores prácticas de accesibilidad

## 🚀 Cómo Usar

### 1. Subir Imagen
- **Arrastra y suelta** una imagen en el área designada
- O haz clic en "Seleccionar imagen" para elegir desde tu dispositivo
- Formatos soportados: JPG, PNG, GIF, WebP
- Tamaño máximo: 10MB

### 2. Extraer Colores
- La aplicación analiza automáticamente tu imagen
- Se muestran hasta 12 colores predominantes
- Cada color incluye vista previa, código HEX, RGB y HSL

### 3. Copiar Colores
- Haz clic en cualquier color para copiar su código HEX
- Recibe notificación de confirmación
- Los colores se copian al portapapeles automáticamente

## ⌨️ Atajos de Teclado

| Combinación | Acción |
|-------------|--------|
| `Ctrl/Cmd + E` | Exportar paleta como JSON |
| `Ctrl/Cmd + L` | Limpiar paleta actual |

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Framework CSS**: Tailwind CSS
- **Librería de Colores**: ColorThief.js
- **Iconos**: Font Awesome 6
- **Diseño**: Responsive Design, CSS Grid, Flexbox
- **Compatibilidad**: Navegadores modernos (Chrome, Firefox, Safari, Edge)

## 📁 Estructura del Proyecto

```
PicPalette/
├── index.html          # Página principal
├── script.js           # Lógica de la aplicación
├── style.css           # Estilos personalizados
├── paleta.png          # Logo de la aplicación
└── README.md           # Este archivo
```

## 🔧 Instalación y Uso

### Opción 1: Uso Directo
1. Descarga o clona este repositorio
2. Abre `index.html` en tu navegador web
3. ¡Listo para usar!

### Opción 2: Servidor Local
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (si tienes http-server instalado)
npx http-server

# Con PHP
php -S localhost:8000
```

Luego abre `http://localhost:8000` en tu navegador.

### Opción 3: Despliegue en la Web
- Sube los archivos a cualquier servicio de hosting web
- Funciona en GitHub Pages, Netlify, Vercel, etc.
- No requiere configuración del servidor

## 🌐 Compatibilidad de Navegadores

| Navegador | Versión Mínima | Estado |
|-----------|----------------|--------|
| Chrome | 60+ | ✅ Completamente compatible |
| Firefox | 55+ | ✅ Completamente compatible |
| Safari | 12+ | ✅ Completamente compatible |
| Edge | 79+ | ✅ Completamente compatible |
| Internet Explorer | No soportado | ❌ No compatible |

## 📱 Características Responsivas

- **Desktop**: Vista completa con grid de 4 columnas
- **Tablet**: Grid de 3 columnas optimizado
- **Mobile**: Grid de 2 columnas para pantallas pequeñas
- **Touch**: Optimizado para dispositivos táctiles

## 🎨 Personalización

### Variables CSS
El proyecto utiliza variables CSS personalizables en `style.css`:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
  /* ... más variables */
}
```

### Temas
- **Claro**: Tema por defecto con colores suaves
- **Oscuro**: Se activa automáticamente según preferencias del sistema

## 🔒 Privacidad y Seguridad

- ✅ **Sin envío de datos**: Las imágenes se procesan localmente en tu navegador
- ✅ **Sin cookies**: No se almacenan datos personales
- ✅ **Código abierto**: Revisa el código fuente completo
- ✅ **HTTPS recomendado**: Para funcionalidad completa del portapapeles

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Aquí hay algunas formas de contribuir:

1. **Reportar bugs** en la sección de Issues
2. **Sugerir nuevas características**
3. **Mejorar la documentación**
4. **Enviar pull requests** con mejoras

### Guía de Contribución
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [ColorThief.js](https://github.com/lokesh/color-thief) - Librería de extracción de colores
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitario
- [Font Awesome](https://fontawesome.com/) - Iconos vectoriales
- Comunidad de desarrolladores web por el feedback y sugerencias

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/PicPalette/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/tu-usuario/PicPalette/discussions)
- **Email**: tu-email@ejemplo.com

## 🚀 Roadmap

### Versión 1.1 (Próximamente)
- [ ] Paletas de colores predefinidas
- [ ] Historial de paletas guardadas
- [ ] Exportación a formatos adicionales (CSS, SCSS, Adobe)
- [ ] Modo de comparación de colores

### Versión 1.2 (Futuro)
- [ ] API para integración con otras aplicaciones
- [ ] Plugin para navegadores
- [ ] Aplicación móvil nativa
- [ ] Análisis de contraste de colores

---

**¿Te gusta PicPalette? ¡Dale una ⭐ en GitHub!**

---

*Desarrollado con ❤️ para la comunidad de diseñadores y desarrolladores* 