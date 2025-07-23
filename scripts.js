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

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      themeIcon.src = "ASSETS/sun.png";
    } else {
      themeIcon.src = "ASSETS/moon.png";
    }
  }

  // === INTERACTIVE DOG DIALOGUE ===
  let petCount = 0;
  let smileys = "";
  
  const dogResponse = document.getElementById("dogResponse");
  const questionList = document.getElementById("questionList");
  const petDog = document.getElementById("petDog");
  
  if (petDog && dogResponse && questionList) {
    petDog.addEventListener("click", () => {
      petCount++;
      
      // Add a smiley every 10th pet
      if (petCount % 10 === 0) {
        smileys += " :D";
      }
  
      dogResponse.textContent = `Clicks: ${petCount}${smileys}`;
    });
  
    const responses = {
      updateLog: "I am currently working on the basics of React, however I still need to find a good tutorial first.",
      services: "I am willing to create websites for cheap prices like this one! Contact me for more details!",
      projects: "No projects yet, but I am working on it! Check back later!",
      discord: ".buddo is my Discord",
    };
  
    Object.entries(responses).forEach(([key, message]) => {
      const btn = document.createElement("button");
      btn.textContent = key.charAt(0).toUpperCase() + key.slice(1);
      btn.onclick = () => {
        dogResponse.textContent = message;
      };
      questionList.appendChild(btn);
    });
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

        article.innerHTML = `
          <img src="${project.image}" alt="${project.title}" class="project-img" />
          <div class="project-txt">
            <h3 class="project-h3">${project.title}</h3>
            <p class="project-p">${project.description}</p>
            <div class="skills-container">
              ${project.skills.map(skill => `<span class="skills">${skill}</span>`).join("")}
            </div>
            <p class="project-date">${project.date}</p>
            <a href="${project.link}" target="_blank">View</a>
          </div>
        `;

        projectList.appendChild(article);
      });
    })
    .catch((error) => console.error("Failed to load projects:", error));
});
