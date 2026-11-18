const status = document.getElementById("script-status");
const images = [...document.querySelectorAll("main img")];
let loadedImages = images.filter((image) => image.complete && image.naturalWidth > 0).length;

function updateImageStatus() {
  status.textContent = `Deferred script ran after HTML parsing. Images loaded: ${loadedImages} of ${images.length}.`;
}

images.forEach((image) => {
  if (!image.complete) {
    image.addEventListener("load", () => {
      loadedImages++;
      updateImageStatus();
    }, { once: true });
    image.addEventListener("error", () => {
      status.textContent = "An image could not be loaded. Check your connection.";
    }, { once: true });
  }
});

updateImageStatus();
