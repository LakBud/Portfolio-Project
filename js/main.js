import { initScripts } from "./scripts.js";
import { initBar } from "./bar.js";
import { initProjects } from "./projects.js";
import { initSlider } from "./slider.js";
import { initAnimations, init3DBackground } from "./animations.js";
import { initSounds } from "./sounds.js";

document.addEventListener("DOMContentLoaded", () => {
  initSounds();
  initScripts();
  initBar();
  initSlider();
  initAnimations();
  init3DBackground();
  initProjects();
});
