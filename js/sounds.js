Howler.html5PoolSize = 500;

export function initSounds() {
  // === BACKGROUND AMBIENT ===
  const ambientHome = new Howl({
    src: ["./ASSETS/sounds/ambient1.mp3"],
    loop: true,
    volume: 0.2,
    preload: true,
  });

  const ambientProjects = new Howl({
    src: ["./ASSETS/sounds/ambient2.mp3"],
    loop: true,
    volume: 0.2,
    preload: true,
  });

  const page = document.body.dataset.page;
  let ambientToPlay = page === "home" ? ambientHome : page === "projects" ? ambientProjects : null;

  // Start ambient sound on first user interaction (click or touch)
  if (ambientToPlay) {
    const startAmbient = () => {
      ambientToPlay.play();
      // Remove listeners after first play
      window.removeEventListener("click", startAmbient);
      window.removeEventListener("touchstart", startAmbient);
    };
    window.addEventListener("click", startAmbient, { once: true, passive: true });
    window.addEventListener("touchstart", startAmbient, { once: true, passive: true });
  }

  // === SOUND EFFECTS ===
  const hoverSound = new Howl({
    src: ["ASSETS/sounds/hover.mp3"],
    volume: 0.3,
    preload: true,
  });

  const clickSound = new Howl({
    src: ["ASSETS/sounds/click.mp3"],
    volume: 0.3,
    preload: true,
  });

  const slideSound = new Howl({
    src: ["ASSETS/sounds/slide.mp3"],
    volume: 0.3,
    preload: true,
  });

  const dogSound = new Howl({
    src: ["ASSETS/sounds/dog.mp3"],
    volume: 0.5,
    loop: false,
    preload: true,
  });

  const excludedClickIds = new Set(["nextBtn", "prevBtn", "themeToggle", "volumeToggle"]);

  // Event delegation for hover sounds on links and buttons

  let last = null;

  document.body.addEventListener("mouseover", (e) => {
    const el = e.target.closest("a, button");
    if (!el || el === last) return;
    hoverSound.play();
    last = el;
  });

  document.body.addEventListener("mouseout", (e) => {
    if (!last) return;
    const leftEl = e.target.closest("a, button");
    if (leftEl === last && !leftEl.contains(e.relatedTarget)) {
      last = null;
    }
  });

  // Single click listener for various click sounds
  document.body.addEventListener(
    "click",
    (e) => {
      const target = e.target.closest("a, button, .logo");
      if (!target) return;

      // Play dog sound if clicking logo
      if (target.closest(".logo")) {
        dogSound.play();
        return;
      }

      // Play slide sound for prevBtn or nextBtn
      if (target.id === "prevBtn" || target.id === "nextBtn") {
        slideSound.play();
        return;
      }

      // Exclude some IDs from click sound
      if (excludedClickIds.has(target.id)) return;

      // Default click sound for other links/buttons
      clickSound.play();
    },
    { passive: true }
  );
}
