export function initSounds() {
  // === BACKGROUND AMBIENT ===
  function setupAmbient(validPages, audioSrc, storageKey) {
    if (!validPages.includes(window.location.pathname)) return;

    let sound = new Howl({
      src: [audioSrc],
      loop: true,
      volume: 0.1,
      html5: true,
      onload: () => {
        const saved = parseFloat(localStorage.getItem(storageKey));
        if (!isNaN(saved)) sound.seek(saved);
      },
      onloaderror: (id, err) => console.error("Howler load error:", err),
      onplayerror: (id, err) => {
        console.warn("Howler play error:", err);
        sound.once("unlock", () => sound.play());
      },
    });

    // Function to start sound and remove listeners once done
    function startSound() {
      if (!sound.playing()) {
        sound.play();
      }
      window.removeEventListener("click", startSound);
      window.removeEventListener("keydown", startSound);
    }

    window.addEventListener("click", startSound);
    window.addEventListener("keydown", startSound);

    // Save playback position only while playing
    const intervalId = setInterval(() => {
      if (sound.playing()) {
        localStorage.setItem(storageKey, sound.seek().toFixed(2));
      }
    }, 1000);

    window.addEventListener("beforeunload", () => {
      if (sound.playing()) {
        localStorage.setItem(storageKey, sound.seek().toFixed(2));
      }
      clearInterval(intervalId);
      window.removeEventListener("click", startSound);
      window.removeEventListener("keydown", startSound);
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
