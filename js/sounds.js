export function initSounds() {
  // === SOUND EFFECTS ===

  const hoverSound = new Howl({
    src: ["ASSETS/sounds/hover.mp3"],
    volume: 0.3,
  });

  const clickSound = new Howl({
    src: ["ASSETS/sounds/click.mp3"],
    volume: 0.6,
  });

  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => hoverSound.play());
    if (el.id === "nextBtn" || el.id === "prevBtn" || el.id === "themeToggle" || el.id === "volumeToggle") return;
    el.addEventListener("click", () => clickSound.play());
  });

  const slideSound = new Howl({
    src: ["ASSETS/sounds/slide.mp3"],
    volume: 0.3,
  });

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  if (prevBtn) prevBtn.addEventListener("click", () => slideSound.play());
  if (nextBtn) nextBtn.addEventListener("click", () => slideSound.play());

  const dogSound = new Howl({
    src: ["ASSETS/sounds/dog.mp3"],
    volume: 0.5,
    loop: false,
  });

  document.querySelectorAll(".logo").forEach((dogEl) => {
    dogEl.addEventListener("click", () => {
      dogSound.play();
    });
  });
}
