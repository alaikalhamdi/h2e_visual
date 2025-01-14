const fart = document.createElement("audio");
fart.src = "/assets/fart-with-reverb.mp3";
document.addEventListener("mousedown", () => {
    const currentFart = fart.cloneNode();
    currentFart.play();
    currentFart.addEventListener("ended", () => {
            currentFart.remove()
    });
});