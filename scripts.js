document.addEventListener("DOMContentLoaded", () => {
  // === IMAGE SLIDER ===
  const slides = document.querySelectorAll(".slides img");
  let slideIndex = 0;
  let intervalID = null;

  if (slides.length > 0) {
    slides.forEach(slide => (slide.style.display = "none"));
    showSlide(slideIndex);
    intervalID = setInterval(() => changeSlide(1), 5000);
  }

  function showSlide(index) {
    slides.forEach(slide => (slide.style.display = "none"));
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    slides[index].style.display = "block";
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

  // === EMAILJS CONTACT FORM ===
  const contactForm = document.getElementById("contactForm");
  const result = document.getElementById("result");

  if (contactForm && result) {
    emailjs.init("fJ4bUNEbuwI76kNto");

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      emailjs.sendForm("service_ejb45tm", "template_gpy5l1d", this)
        .then(() => {
          result.textContent = "✅ Message sent successfully!";
          result.style.color = "green";
          contactForm.reset();

          setTimeout(() => {
            result.textContent = "If you would like to get in touch with me, you can reach me via email or socials";
          }, 5000);
        })
        .catch(error => {
          result.textContent = "❌ Something went wrong. Please try again.";
          result.style.color = "red";

          setTimeout(() => {
            result.textContent = "If you would like to get in touch with me, you can reach me via email or socials";
          }, 5000);

          console.error("❌ FAILED:", error);
        });
    });
  }

  // === DARK/LIGHT TOGGLE ===
  const toggleBtn = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  if (toggleBtn && themeIcon) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      themeIcon.src = isDark ? "ASSETS/sun.png" : "ASSETS/moon.png";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });

    // Load saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      themeIcon.src = "ASSETS/sun.png";
    } else {
      themeIcon.src = "ASSETS/moon.png";
    }
  }
});

// FETCH JSON PROJECTS

const projects = [
  {
    "title": "Buddo's Portfolio",
    "date": "9/6/2025",
    "description": "The one you are looking at!",
    "image": "ASSETS/placeholder.png",
    "skills": ["HTML", "CSS", "JavaScript", "JSON"],
    "link": "http://127.0.0.1:5500/Portfolio/index.html"
  }
];



document.addEventListener("DOMContentLoaded", () => {
  fetch("projects.json")
    .then((res) => res.json())
    .then((projects) => {
      const projectList = document.getElementById("project-list");

      projects.forEach((project) => {
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
            <a href="${project.link}" target="_blank">View Project</a>
          </div>
        `;

        projectList.appendChild(article);
      });
    })
    .catch((error) => console.error("Failed to load projects:", error));
});


