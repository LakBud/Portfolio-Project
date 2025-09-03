export function initBar() {
  // === DRAG BARS ===
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll([".interests ul", ".skills-section ul"]).forEach((list) => {
    list.querySelectorAll(".progress-bar").forEach((bar) => {
      const progress = bar.querySelector(".progress");
      let dragging = false;
      let animationRunning = false;

      // DRAG LOGIC
      function updateWidth(clientX) {
        const rect = bar.getBoundingClientRect();
        let percent = ((clientX - rect.left) / rect.width) * 100;
        percent = Math.min(Math.max(percent, 0), 100);
        progress.style.width = percent + "%";
        progress.textContent = Math.round(percent) + "%";
      }

      // Use named handlers so we can add/remove listeners if needed
      function onMouseDown() {
        if (animationRunning) return;
        dragging = true;
      }
      function onTouchStart(e) {
        if (animationRunning) return;
        dragging = true;
        e.preventDefault(); // Prevent scrolling when dragging progress
      }
      function onMouseUp() {
        dragging = false;
      }
      function onTouchEnd() {
        dragging = false;
      }
      function onMouseMove(e) {
        if (!dragging || animationRunning) return;
        updateWidth(e.clientX);
      }
      function onTouchMove(e) {
        if (!dragging || animationRunning) return;
        e.preventDefault();
        updateWidth(e.touches[0].clientX);
      }

      // Add event listeners with passive option where appropriate
      progress.addEventListener("mousedown", onMouseDown);
      progress.addEventListener("touchstart", onTouchStart, { passive: false }); // passive false to allow preventDefault
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchend", onTouchEnd);
      window.addEventListener("mousemove", onMouseMove);
      progress.addEventListener("touchmove", onTouchMove, { passive: false });

      // GSAP ANIMATION SETUP
      const targetWidthStr = progress.style.getPropertyValue("--progress-width");
      const targetWidth = parseFloat(targetWidthStr) || 0;
      const numberObj = { val: 0 };

      // Reset initial state
      gsap.set(progress, { width: 0 });
      progress.textContent = "0%";

      // Animate width on scroll trigger
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

      // Animate number counting
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
