const imageInput = document.getElementById("imageInput");
const imageCanvas = document.getElementById("imageCanvas");
const colorPalette = document.getElementById("colorPalette");
const notification = document.getElementById("notification");
const ctx = imageCanvas.getContext("2d");
const colorThief = new ColorThief();

imageInput.addEventListener("change", handleImageUpload);

function handleImageUpload(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      const MAX_WIDTH = imageCanvas.width;
      const MAX_HEIGHT = imageCanvas.height;
      let width = img.width;
      let height = img.height;
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width *= ratio;
        height *= ratio;
      }
      imageCanvas.width = width;
      imageCanvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      const colors = colorThief.getPalette(img, 10);

      displayColors(colors);
    };
    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
}

function displayColors(colors) {
  colorPalette.innerHTML = "";

  colors.forEach((color) => {
    const hexValue = rgbToHex(color[0], color[1], color[2]);

    const listItem = document.createElement("li");
    listItem.className =
      "box-content h-2 w-32 p-4 cursor-pointer border-4 rounded-md my-2 mx-1 flex items-center justify-center color-item";
    listItem.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

    const colorBox = document.createElement("div");
    colorBox.className = "color-box";
    colorBox.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

    listItem.appendChild(colorBox);

    listItem.textContent = hexValue;

    listItem.addEventListener("click", function () {
      copyToClipboard(hexValue);
      showNotification('Color copiado: ' + hexValue, color);
    });

    colorPalette.appendChild(listItem);
  });
}

function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function showNotification(message, color) {
  notification.innerHTML = `
    <div class="flex items-center">
      <div class="color-box" style="background-color: rgb(${color[0]}, ${color[1]}, ${color[2]})"></div>
      <div>${message}</div>
    </div>
  `;
  notification.style.display = "block";
  setTimeout(function () {
    notification.style.display = "none";
  }, 3000); 
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
