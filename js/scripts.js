export function initScripts() {
  // Cache frequently used elements early
  const goalsList = document.querySelector(".goals ol");
  const clearBtn = document.getElementById("toggleClearBtn");
  const goalList = document.getElementById("goals-list");
  const toggleBtn = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const form = document.getElementById("contactForm");
  const volumeToggle = document.getElementById("volumeToggle");
  const volumeIcon = document.getElementById("volumeIcon");

  // === SORTABLE ===
  if (goalsList) {
    Sortable.create(goalsList, { animation: 150 });
  }

  // === CLEAR CONTENT ===
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const elementsToToggle = [
        ...document.querySelectorAll("section"),
        document.querySelector(".slider"),
        document.querySelector("#creditsP"),
      ].filter(Boolean); // filter out nulls

      elementsToToggle.forEach((el) => el.classList.toggle("section-hidden-opacity"));

      clearBtn.textContent = clearBtn.textContent === "X" ? "O" : "X";
    });
  }

  // === SHUFFLE GOALS LIST ===
  if (goalList) {
    window.shuffleGoals = () => {
      const items = Array.from(goalList.children);
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }
      items.forEach((item) => goalList.appendChild(item));
    };
  }

  // === DARK/LIGHT TOGGLE ===
  if (toggleBtn && themeIcon) {
    const themeSound = new Howl({
      src: ["ASSETS/sounds/woosh.mp3"],
      volume: 0.6,
      preload: true,
    });

    toggleBtn.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-mode");
      themeIcon.src = isDark ? "ASSETS/images/sun.webp" : "ASSETS/images/moon.webp";
      localStorage.setItem("theme", isDark ? "dark" : "light");
      themeSound.play();
    });

    // Restore saved theme on load
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
      themeIcon.src = "ASSETS/images/sun.webp";
    } else {
      themeIcon.src = "ASSETS/images/moon.webp";
    }
  }

  // === FORM SCRIPTS ===
  if (form) {
    form.addEventListener("submit", (e) => {
      form.reset();

      const nameInput = form.querySelector("input[name='name']");
      const emailInput = form.querySelector("input[name='email']");
      const messageInput = form.querySelector("textarea[name='message']");

      if (nameInput) nameInput.placeholder = "You Submitted!";
      if (emailInput) emailInput.placeholder = "If you did reCAPTCHA";
      if (messageInput)
        messageInput.placeholder = "Then I will respond to your message as quick as I can! No need to send another email again.";
    });
  }

  // === TOGGLE VOLUME ===
  if (volumeToggle && volumeIcon) {
    const toggleClickSound = new Howl({
      src: ["ASSETS/sounds/volume-click.mp3"],
      volume: 0.5,
    });

    let soundOn = localStorage.getItem("soundOn") !== null ? localStorage.getItem("soundOn") === "true" : true;

    Howler.mute(!soundOn);
    volumeIcon.src = soundOn ? "ASSETS/images/volume.webp" : "ASSETS/images/volume-muted.webp";
    volumeIcon.alt = soundOn ? "Volume On" : "Volume Off";

    volumeToggle.addEventListener("click", () => {
      soundOn = !soundOn;
      Howler.mute(!soundOn);

      volumeIcon.src = soundOn ? "ASSETS/images/volume.webp" : "ASSETS/images/volume-muted.webp";
      volumeIcon.alt = soundOn ? "Volume On" : "Volume Off";

      localStorage.setItem("soundOn", soundOn);

      if (soundOn) toggleClickSound.play();
    });
  }
}
