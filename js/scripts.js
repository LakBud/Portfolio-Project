export function initScripts() {
  // === CLEAR CONTENT ===

  const clearBtn = document.getElementById("toggleClearBtn");

  clearBtn.addEventListener("click", () => {
    const elementsToToggle = [
      ...document.querySelectorAll("section"),
      document.querySelector(".slider"),
      document.querySelector("#creditsP"),
    ];

    elementsToToggle.forEach((el) => {
      if (el) {
        el.classList.toggle("section-hidden-opacity");
      }
    });

    // Toggle button text between "X" and "O"
    clearBtn.textContent = clearBtn.textContent === "X" ? "O" : "X";
  });

  // === SHUFFLE GOALS LIST ===
  const goalList = document.getElementById("goals-list");
  if (goalList) {
    window.shuffleGoals = function () {
      const items = Array.from(goalList.children);
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }
      items.forEach((item) => goalList.appendChild(item));
    };
  }

  // === DARK/LIGHT TOGGLE ===
  const toggleBtn = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  const themeSound = new Howl({
    src: ["ASSETS/sounds/woosh.mp3"],
    volume: 0.6,
    preload: true,
  });

  if (toggleBtn && themeIcon) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");

      themeIcon.src = isDark ? "ASSETS/images/sun.webp" : "ASSETS/images/moon.webp";

      localStorage.setItem("theme", isDark ? "dark" : "light");

      themeSound.play();
    });

    // Restore saved theme on page load
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      themeIcon.src = "ASSETS/images/sun.webp";
    } else {
      themeIcon.src = "ASSETS/images/moon.webp";
    }
  }

  // === FORM SCRIPTS ===
  const form = document.getElementById("contactForm");
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
  const volumeToggle = document.getElementById("volumeToggle");
  const volumeIcon = document.getElementById("volumeIcon");

  const toggleClickSound = new Howl({
    src: ["ASSETS/sounds/volume-click.mp3"],
    volume: 0.5,
  });

  let soundOn = true;

  const savedSoundOn = localStorage.getItem("soundOn");
  if (savedSoundOn !== null) {
    soundOn = savedSoundOn === "true";
    Howler.mute(!soundOn);
    volumeIcon.src = soundOn ? "ASSETS/images/volume.webp" : "ASSETS/images/volume-muted.webp";
    volumeIcon.alt = soundOn ? "Volume On" : "Volume Off";
  } else {
    Howler.mute(false);
    volumeIcon.src = "ASSETS/images/volume.webp";
    volumeIcon.alt = "Volume On";
  }

  volumeToggle.addEventListener("click", () => {
    soundOn = !soundOn;

    Howler.mute(!soundOn);

    volumeIcon.src = soundOn ? "ASSETS/images/volume.webp" : "ASSETS/images/volume-muted.webp";
    volumeIcon.alt = soundOn ? "Volume On" : "Volume Off";

    localStorage.setItem("soundOn", soundOn);

    if (soundOn) {
      toggleClickSound.play();
    }
  });
}
