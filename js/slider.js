export function initSlider() {
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
}
