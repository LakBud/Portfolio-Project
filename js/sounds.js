Howler.html5PoolSize = 10000;
export function initSounds() {
  // === BACKGROUND AMBIENT ===
  function setupAmbient(validPaths, audioSrc, storageKey) {
    if (!validPaths.includes(window.location.pathname)) return;

    const sound = new Howl({
      src: [audioSrc],
      loop: true,
      volume: 0.1,
      html5: true,
      onload() {
        const savedTime = parseFloat(localStorage.getItem(storageKey));
        if (!isNaN(savedTime)) sound.seek(savedTime);
      },
      onloaderror(id, err) {
        console.error("Howler load error:", err);
      },
      onplayerror(id, err) {
        console.warn("Howler play error:", err);
        sound.once("unlock", () => sound.play());
      },
    });

    const startSound = () => {
      if (!sound.playing()) sound.play();
      window.removeEventListener("click", startSound);
      window.removeEventListener("keydown", startSound);
    };

    window.addEventListener("click", startSound, { once: true });
    window.addEventListener("keydown", startSound, { once: true });

    const savePosition = () => {
      if (sound.playing()) {
        localStorage.setItem(storageKey, sound.seek().toFixed(2));
      }
    };

    const intervalId = setInterval(savePosition, 1000);

    window.addEventListener("beforeunload", () => {
      savePosition();
      clearInterval(intervalId);
      window.removeEventListener("click", startSound);
      window.removeEventListener("keydown", startSound);
    });
  }

  // Setup ambient sounds for relevant pages
  setupAmbient(["/index.html"], "ASSETS/sounds/ambient1.mp3", "bgMusicTime_index");
  setupAmbient(["/projects.html"], "ASSETS/sounds/ambient2.mp3", "bgMusicTime_projects");

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

  // Use event delegation on document to reduce listeners
  document.body.addEventListener("mouseover", (e) => {
    if (e.target.closest("a, button")) {
      hoverSound.play();
    }
  });

  document.body.addEventListener("click", (e) => {
    const target = e.target.closest("a, button");
    if (!target) return;

    // Exclude specific IDs
    const excludedIds = new Set(["nextBtn", "prevBtn", "themeToggle", "volumeToggle"]);
    if (excludedIds.has(target.id)) return;

    clickSound.play();
  });

  const slideSound = new Howl({
    src: ["ASSETS/sounds/slide.mp3"],
    volume: 0.3,
    preload: true,
  });

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  if (prevBtn) prevBtn.addEventListener("click", () => slideSound.play());
  if (nextBtn) nextBtn.addEventListener("click", () => slideSound.play());

  const dogSound = new Howl({
    src: ["ASSETS/sounds/dog.mp3"],
    volume: 0.5,
    loop: false,
    preload: true,
  });

  // Use event delegation for logo clicks
  document.body.addEventListener("click", (e) => {
    if (e.target.closest(".logo")) {
      dogSound.play();
    }
  });
}
