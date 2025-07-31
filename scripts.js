document.addEventListener("DOMContentLoaded", () => {
  // === IMAGE SLIDER ===
  const slides = document.querySelectorAll(".slides img");
  let slideIndex = 0;
  let intervalID = null;

  if (slides.length > 0) {
    slides.forEach((slide) => slide.classList.remove("active"));
    showSlide(slideIndex);
    intervalID = setInterval(() => changeSlide(1), 5000);
  }

  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    slides[index].classList.add("active");
    slideIndex = index;
  }

  function changeSlide(step) {
    let newIndex = slideIndex + step;
    if (newIndex >= slides.length) newIndex = 0;
    if (newIndex < 0) newIndex = slides.length - 1;
    showSlide(newIndex);
  }

  window.nextSlide = function () {
    clearInterval(intervalID);
    changeSlide(1);
    intervalID = setInterval(() => changeSlide(1), 5000);
  };

  window.prevSlide = function () {
    clearInterval(intervalID);
    changeSlide(-1);
    intervalID = setInterval(() => changeSlide(1), 5000);
  };

  // === DRAG INTEREST BARS ===

  document.querySelectorAll(".interests ul").forEach((list) => {
    list.querySelectorAll(".progress-bar").forEach((bar) => {
      const progress = bar.querySelector(".progress");
      let dragging = false;
      let animationRunning = false; // per progress element animation flag

      function updateWidth(clientX) {
        const rect = bar.getBoundingClientRect();
        let percent = ((clientX - rect.left) / rect.width) * 100;
        percent = Math.min(Math.max(percent, 0), 100);
        progress.style.width = percent + "%";
        progress.textContent = Math.round(percent) + "%";
      }

      progress.addEventListener("mousedown", () => {
        if (animationRunning) return; // block drag during animation
        dragging = true;
      });

      progress.addEventListener("touchstart", () => {
        if (animationRunning) return;
        dragging = true;
      });

      window.addEventListener("mouseup", () => (dragging = false));
      window.addEventListener("touchend", () => (dragging = false));

      window.addEventListener("mousemove", (e) => {
        if (!dragging || animationRunning) return;
        updateWidth(e.clientX);
      });

      progress.addEventListener(
        "touchmove",
        (e) => {
          if (!dragging || animationRunning) return;
          e.preventDefault();
          updateWidth(e.touches[0].clientX);
        },
        { passive: false }
      );

      // Observer for animation of this progress bar
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(({ target, isIntersecting }) => {
            if (!isIntersecting) return;
            if (target === progress) {
              const targetWidthStr = target.style.getPropertyValue("--progress-width");
              const targetWidth = parseFloat(targetWidthStr) || 0;

              target.style.width = targetWidth + "%";
              target.textContent = "0%";

              animationRunning = true;
              const animationDuration = 2500;
              const startTime = performance.now();

              function updateText(time) {
                const elapsed = time - startTime;
                const progressVal = Math.min(elapsed / animationDuration, 1);
                const current = Math.floor(progressVal * targetWidth);

                target.textContent = current + "%";

                if (progressVal < 1) {
                  requestAnimationFrame(updateText);
                } else {
                  animationRunning = false;
                  observer.unobserve(target);
                }
              }
              requestAnimationFrame(updateText);
            }
          });
        },
        { threshold: 0.2 }
      );

      observer.observe(progress);
    });
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

  // === PROJECT FETCH ===
  fetch("projects.json")
    .then((res) => res.json())
    .then((projects) => {
      const projectList = document.getElementById("project-list");
      if (!projectList) return;

      projects.forEach((project) => {
        const article = document.createElement("article");
        article.classList.add("project-container");

        // === IMAGE ===
        const img = document.createElement("img");
        img.src = project.image;
        img.alt = project.title;
        img.className = "project-img";

        // === TITLE ===
        const h3 = document.createElement("h3");
        h3.className = "project-h3";
        h3.textContent = project.title;

        // === DESCRIPTION ===
        const p = document.createElement("p");
        p.className = "project-p";
        p.textContent = project.description;

        // === SKILLS ===
        const skillsContainer = document.createElement("div");
        skillsContainer.className = "skills-container";
        project.skills.forEach((skill) => {
          const skillEl = document.createElement("span");
          skillEl.className = "skills";
          skillEl.textContent = skill;
          skillEl.addEventListener("mouseenter", () => hoverSound.play());
          skillsContainer.appendChild(skillEl);
        });

        // === DATE ===
        const date = document.createElement("p");
        date.className = "project-date";
        date.textContent = project.date;

        // === LINK ===
        const link = document.createElement("a");
        link.href = project.link;
        link.target = "_blank";
        link.className = "project-link";
        link.textContent = "View";
        link.addEventListener("click", () => clickSound.play());

        // === WRAP TEXTS ===
        const txtDiv = document.createElement("div");
        txtDiv.className = "project-txt";
        txtDiv.append(h3, p, skillsContainer, date, link);

        // === APPEND TO ARTICLE ===
        article.append(img, txtDiv);
        projectList.appendChild(article);
      });
    })
    .catch((error) => console.error("Failed to load projects:", error));

  // === ANIMATION for sections ===
  const sections = document.querySelectorAll("section");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;

        if (target.tagName === "SECTION") {
          target.classList.add("section-visible");
          target.querySelectorAll(".section-child").forEach((child, i) => {
            setTimeout(() => child.classList.add("section-child-visible"), i * 150);
          });
        }
      });
    },
    { threshold: 0.2 }
  );

  sections.forEach((section) => {
    section.classList.add("section-hidden");
    section
      .querySelectorAll(":scope > *:not(.progress-bar):not(.slider):not(.slides)")
      .forEach((child) => child.classList.add("section-child"));
    sectionObserver.observe(section);
  });

  // === TYPEWRITER EFFECT ===
  new Typed("#typed-subtitle", {
    strings: ["17 Year Old Web Developer", "Aspiring Fullstack Developer", "Tech Learner"],
    typeSpeed: 20,
    backSpeed: 30,
    backDelay: 1500,
    loop: true,
    smartBackspace: true,
    showCursor: false,
  });

  // === CLEAR FORM ===
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      form.reset();
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
});
