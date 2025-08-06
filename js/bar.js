export function initBar() {
  // === DRAG BARS ===

  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll(".interests ul").forEach((list) => {
    list.querySelectorAll(".progress-bar").forEach((bar) => {
      const progress = bar.querySelector(".progress");
      let dragging = false;
      let animationRunning = false;

      // Drag logic
      function updateWidth(clientX) {
        const rect = bar.getBoundingClientRect();
        let percent = ((clientX - rect.left) / rect.width) * 100;
        percent = Math.min(Math.max(percent, 0), 100);
        progress.style.width = percent + "%";
        progress.textContent = Math.round(percent) + "%";
      }

      progress.addEventListener("mousedown", () => {
        if (animationRunning) return;
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

      // GSAP animation
      const targetWidthStr = progress.style.getPropertyValue("--progress-width");
      const targetWidth = parseFloat(targetWidthStr) || 0;
      const numberObj = { val: 0 };

      // Reset initial state
      gsap.set(progress, { width: 0 });
      progress.textContent = "0%";

      // Animate width
      gsap.to(progress, {
        width: targetWidth + "%",
        duration: 0.5,
        ease: "power1.out",
        scrollTrigger: {
          trigger: progress,
          start: "20% bottom",
          once: true,
          onEnter: () => {
            animationRunning = true;
          },
          onLeave: () => {
            animationRunning = false;
          },
          onLeaveBack: () => {
            animationRunning = false;
          },
        },
        onComplete: () => {
          animationRunning = false;
        },
      });

      // Animate number
      gsap.to(numberObj, {
        val: targetWidth,
        duration: 3,
        ease: "power1.out",
        scrollTrigger: {
          trigger: progress,
          start: "20% bottom",
          once: true,
        },
        onUpdate() {
          const currentWidth = parseFloat(progress.style.width) || 0;
          const displayVal = Math.min(numberObj.val, currentWidth);
          progress.textContent = Math.round(displayVal) + "%";
        },
      });
    });
  });
}
