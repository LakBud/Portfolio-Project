import { initScripts } from "./scripts.js";
import { initBar } from "./bar.js";
import { initProjects } from "./projects.js";
import { initSlider } from "./slider.js";
import { initAnimations } from "./animations.js";
import { init3DBackground } from "./animations.js";
import { initSounds } from "./sounds.js";

document.addEventListener("DOMContentLoaded", () => {
  initSounds();
  initScripts();
  initBar();
  initSlider();
  initAnimations();
  initProjects();
  init3DBackground();
});
