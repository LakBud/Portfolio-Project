export function initProjects() {
  // === PROJECT FETCH ===

  const hoverSound = new Howl({
    src: ["ASSETS/sounds/hover.mp3"],
    volume: 0.3,
  });
  const clickSound = new Howl({
    src: ["ASSETS/sounds/click.mp3"],
    volume: 0.6,
  });

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
}
