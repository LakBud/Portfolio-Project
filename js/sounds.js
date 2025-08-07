export function initSounds() {
  // === BACKGROUND AMBIENT ===
  function setupAmbient(validPages, audioSrc, storageKey) {
    const currentPath = window.location.pathname;
    console.log("Current path:", currentPath);

    if (!validPages.includes(currentPath)) return;

    const sound = new Howl({
      src: [audioSrc],
      loop: true,
      volume: 0.1,
      html5: true,
      onload: () => {
        const saved = parseFloat(localStorage.getItem(storageKey));
        if (!isNaN(saved)) {
          sound.seek(saved);
        }
        sound.play();
      },
      onloaderror: (id, err) => {
        console.error("Howler load error:", err);
      },
      onplayerror: (id, err) => {
        console.error("Howler play error:", err);
        sound.once("unlock", () => {
          sound.play();
        });
      },
    });

    const saveTime = () => {
      if (sound.playing()) {
        localStorage.setItem(storageKey, sound.seek().toFixed(2));
      }
    };

    const saveInterval = setInterval(saveTime, 1000);

    window.addEventListener("beforeunload", () => {
      saveTime();
      clearInterval(saveInterval);
    });
  }

  // Background Ambient Usage:
  setupAmbient("/index.html", "ASSETS/sounds/ambient1.mp3", "bgMusicTime_index");
  setupAmbient("/projects.html", "ASSETS/sounds/ambient2.mp3", "bgMusicTime_projects");

  // === SOUND EFFECTS ===

  const hoverSound = new Howl({
    src: ["ASSETS/sounds/hover.mp3"],
    volume: 0.3,
  });

  const clickSound = new Howl({
    src: ["ASSETS/sounds/click.mp3"],
    volume: 0.3,
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
