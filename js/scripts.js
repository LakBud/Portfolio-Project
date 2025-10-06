export function initScripts() {
  // Cache frequently used elements early, but keep minimal upfront queries
  const goalsList = document.querySelector(".goals ol");
  const clearBtn = document.getElementById("toggleClearBtn");
  const goalList = document.getElementById("goals-list");
  const toggleBtn = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const form = document.getElementById("contactForm");
  const volumeToggle = document.getElementById("volumeToggle");
  const volumeIcon = document.getElementById("volumeIcon");

  // === CLEAR FORM ===
  window.onbeforeunload = () => {
    for (const form of document.getElementsByTagName("form")) {
      form.reset();
    }
  };

  // === SORTABLE ===
  if (goalsList) {
    Sortable.create(goalsList, { animation: 150 });
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
    let themeSound;
    // Delay creating Howl instance until first click to avoid preloading upfront
    toggleBtn.addEventListener(
      "click",
      () => {
        if (!themeSound) {
          themeSound = new Howl({
            src: ["ASSETS/sounds/woosh.mp3"],
            volume: 0.6,
            preload: true,
          });
        }
        const isDark = document.body.classList.toggle("dark-mode");
        themeIcon.src = isDark ? "ASSETS/images/sun.webp" : "ASSETS/images/moon.webp";
        localStorage.setItem("theme", isDark ? "dark" : "light");
        themeSound.play();
      },
      { passive: true }
    );

    // Restore saved theme on load
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
      themeIcon.src = "ASSETS/images/sun.webp";
    } else {
      themeIcon.src = "ASSETS/images/moon.webp";
    }
  }

  // === FORM SCRIPTS ===
  // On form submit - save a flag
  if (form) {
    form.addEventListener(
      "submit",
      () => {
        localStorage.setItem("formSubmitted", "true");
        // Form submits naturally and redirects
      },
      { passive: true }
    );
  }

  // On page load - check if they just submitted
  window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("formSubmitted") === "true") {
      // Clear the flag
      localStorage.removeItem("formSubmitted");

      // Show success message
      const form = document.querySelector("form");
      if (form) {
        form.reset(); // Clear the form

        const nameInput = form.querySelector("input[name='name']");
        const emailInput = form.querySelector("input[name='email']");
        const messageInput = form.querySelector("textarea[name='message']");

        if (nameInput) nameInput.placeholder = "Message Sent Successfully! ✓";
        if (emailInput) emailInput.placeholder = "I'll respond quickly!";
        if (messageInput) messageInput.placeholder = "Feel free to send another message anytime!";

        const banner = document.createElement("div");
        banner.textContent = "✓ Your message was sent successfully if you cleared the form!";
        banner.style.cssText =
          "background:#4CAF50;color:white;padding:15px;text-align:center;font-weight:bold;margin:10px auto;max-width:600px;border-radius:8px;";
        form.insertAdjacentElement("beforebegin", banner);
      }
    }
  });

  // === TOGGLE VOLUME ===
  if (volumeToggle && volumeIcon) {
    let toggleClickSound;
    let soundOn = localStorage.getItem("soundOn") !== null ? localStorage.getItem("soundOn") === "true" : true;

    // Initialize Howler mute state immediately, but delay Howl creation
    Howler.mute(!soundOn);

    volumeIcon.src = soundOn ? "ASSETS/images/volume.webp" : "ASSETS/images/volume-muted.webp";
    volumeIcon.alt = soundOn ? "Volume On" : "Volume Off";

    volumeToggle.addEventListener(
      "click",
      () => {
        soundOn = !soundOn;
        Howler.mute(!soundOn);

        volumeIcon.src = soundOn ? "ASSETS/images/volume.webp" : "ASSETS/images/volume-muted.webp";
        volumeIcon.alt = soundOn ? "Volume On" : "Volume Off";

        localStorage.setItem("soundOn", soundOn);

        // Lazy load toggleClickSound on first click if needed
        if (soundOn) {
          if (!toggleClickSound) {
            toggleClickSound = new Howl({
              src: ["ASSETS/sounds/volume-click.mp3"],
              volume: 0.5,
            });
          }
          toggleClickSound.play();
        }
      },
      { passive: true }
    );
  }
}
