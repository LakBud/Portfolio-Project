document.addEventListener("DOMContentLoaded", () => {


  // === IMAGE SLIDER ===
  const slides = document.querySelectorAll(".slides img");
  let slideIndex = 0;
  let intervalID = null;

  if (slides.length > 0) {
    slides.forEach(slide => slide.classList.remove("active"));
    showSlide(slideIndex);
    intervalID = setInterval(() => changeSlide(1), 5000);
  }

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove("active"));
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

  document.querySelectorAll('.interests ul').forEach(list => {
    
    list.querySelectorAll('.progress-bar').forEach(bar => {
      const progress = bar.querySelector('.progress');
      let dragging = false;
  
      function updateWidth(clientX) {
        const rect = bar.getBoundingClientRect();
        let percent = ((clientX - rect.left) / rect.width) * 100;
        percent = Math.min(Math.max(percent, 0), 100);
        progress.style.width = percent + '%';
      }
  
      progress.addEventListener('mousedown', () => dragging = true);
      progress.addEventListener('touchstart', () => dragging = true);
  
      window.addEventListener('mouseup', () => dragging = false);
      window.addEventListener('touchend', () => dragging = false);
  
      window.addEventListener('mousemove', e => {
        if (!dragging) return;
        updateWidth(e.clientX);
      });
  
      progress.addEventListener('touchmove', e => {
        if (!dragging) return;
        e.preventDefault(); 
        updateWidth(e.touches[0].clientX);
      }, { passive: false });
      
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
      items.forEach(item => goalList.appendChild(item));
    };
  }

  // === DARK/LIGHT TOGGLE ===
  const toggleBtn = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  const themeSound = new Howl({
    src: ['ASSETS/sounds/woosh.mp3'],
    volume: 0.6,
    preload: true
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
    .then(res => res.json())
    .then(projects => {
      const projectList = document.getElementById("project-list");
      if (!projectList) return;

      projects.forEach(project => {
        const article = document.createElement("article");
        article.classList.add("project-container");

        article.innerHTML = `
          <img src="${project.image}" alt="${project.title}" class="project-img" />
          <div class="project-txt">
            <h3 class="project-h3">${project.title}</h3>
            <p class="project-p">${project.description}</p>
            <div class="skills-container">
              ${project.skills.map(skill => `<span class="skills">${skill}</span>`).join("")}
            </div>
            <p class="project-date">${project.date}</p>
            <a href="${project.link}" target="_blank" class="project-link">View</a>
          </div>
        `;
        projectList.appendChild(article);

        article.querySelectorAll('.skills').forEach(skillEl => {
          skillEl.addEventListener('mouseenter', () => hoverSound.play());
        });

        const link = article.querySelector('.project-link');
        if (link) {
          link.addEventListener('click', () => clickSound.play());
        }
      });
    })
    .catch(error => console.error("Failed to load projects:", error));

  

  // === ANIMATION ===
  const sections = document.querySelectorAll("section");
  const progressBars = document.querySelectorAll(".progress");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;

      if (target.tagName === "SECTION") {
        target.classList.add("section-visible");
        target.querySelectorAll(".section-child").forEach((child, i) => {
          setTimeout(() => child.classList.add("section-child-visible"), i * 150);
        });
      } else if (target.classList.contains("progress")) {
        target.style.width = target.style.getPropertyValue("--progress-width");
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => {
    section.classList.add("section-hidden");
    section.querySelectorAll(
      ":scope > *:not(.progress-bar):not(.slider):not(.slides)"
    ).forEach(child => child.classList.add("section-child"));
    observer.observe(section);
  });

  progressBars.forEach(bar => {
    bar.style.width = 0;
    observer.observe(bar);
  });

  // === TYPEWRITER EFFECT ===
  new Typed('#typed-subtitle', {
    strings: [
      "17 Year Old Web Developer",
      "Aspiring Fullstack Developer",
      "Tech Learner"
    ],
    typeSpeed: 20,
    backSpeed: 30,
    backDelay: 1500,
    loop: true,
    smartBackspace: true,
    showCursor: false
  });

  // === CLEAR FORM ===
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      form.reset();
    });
  }

  // === TOGGLE VOLUME ===
  const volumeToggle = document.getElementById('volumeToggle');
  const volumeIcon = document.getElementById('volumeIcon');

  const toggleClickSound = new Howl({
    src: ['ASSETS/sounds/volume-click.mp3'],
    volume: 0.5
  });

  let soundOn = true;

  const savedSoundOn = localStorage.getItem('soundOn');
  if (savedSoundOn !== null) {
    soundOn = savedSoundOn === 'true';
    Howler.mute(!soundOn);
    volumeIcon.src = soundOn ? 'ASSETS/images/volume.webp' : 'ASSETS/images/volume-muted.webp';
    volumeIcon.alt = soundOn ? 'Volume On' : 'Volume Off';
  } else {
    Howler.mute(false);
    volumeIcon.src = 'ASSETS/images/volume.webp';
    volumeIcon.alt = 'Volume On';
  }

  volumeToggle.addEventListener('click', () => {
    soundOn = !soundOn;

    Howler.mute(!soundOn);

    volumeIcon.src = soundOn ? 'ASSETS/images/volume.webp' : 'ASSETS/images/volume-muted.webp';
    volumeIcon.alt = soundOn ? 'Volume On' : 'Volume Off';

    localStorage.setItem('soundOn', soundOn);

    if (soundOn) {
      toggleClickSound.play();
    }
  });

  // === SOUND EFFECTS ===
  const hoverSound = new Howl({
    src: ['ASSETS/sounds/hover.mp3'],
    volume: 0.3
  });
  const clickSound = new Howl({
    src: ['ASSETS/sounds/click.mp3'],
    volume: 0.6
  });

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => hoverSound.play());
    if (el.id === 'nextBtn' || el.id === 'prevBtn' || el.id === 'themeToggle' || el.id === 'volumeToggle') return;
    el.addEventListener('click', () => clickSound.play());
  });

  const slideSound = new Howl({
    src: ['ASSETS/sounds/slide.mp3'],
    volume: 0.3
  });

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (prevBtn) prevBtn.addEventListener('click', () => slideSound.play());
  if (nextBtn) nextBtn.addEventListener('click', () => slideSound.play());

  const dogSound = new Howl({
    src: ['ASSETS/sounds/dog.mp3'],
    volume: 0.5,
    loop: false
  });

  document.querySelectorAll('.logo').forEach(dogEl => {
    dogEl.addEventListener('click', () => {
      dogSound.play();
    });
  });

  

  
  
    

});
