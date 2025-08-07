Howler.html5PoolSize = 500;
export function initSounds() {
  // === BACKGROUND AMBIENT ===
  const ambientHome = new Howl({
    src: ["./ASSETS/sounds/ambient1.mp3"],
    loop: true,
    volume: 0.2,
  });

  const ambientProjects = new Howl({
    src: ["./ASSETS/sounds/ambient2.mp3"],
    loop: true,
    volume: 0.2,
  });

  const page = document.body.dataset.page;

  let ambientToPlay = null;

  if (page === "home") {
    ambientToPlay = ambientHome;
  } else if (page === "projects") {
    ambientToPlay = ambientProjects;
  }

  if (ambientToPlay) {
    document.addEventListener(
      "click",
      () => {
        ambientToPlay.play();
      },
      { once: true }
    );
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
