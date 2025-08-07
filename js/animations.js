export function initAnimations() {
  // === TEXT PARTICLES ===

  document.fonts.ready.then(() => {
    tsParticles.load("textParticles", {
      fullScreen: false,
      particles: {
        number: { value: 70 },
        color: {
          value: "#8B4513",
        },
        shape: {
          type: "char",
          character: {
            value: ["HTML", "CSS", "JS", "TS", "React", "Express.JS", "Node.JS", "MySQL", "MongoDB"],
            font: "Press Start 2P",
            weight: "400",
          },
        },
        size: { value: 8 },
        move: {
          enable: true,
          direction: "top",
          speed: 1.5,
          outModes: { default: "out" },
        },
        opacity: { value: 0.8 },
      },
      detectRetina: true,
      background: { color: "transparent" },
    });
  });

  // === ANIMATION for sections ===
  gsap.registerPlugin(ScrollTrigger);

  const sections = document.querySelectorAll("section");

  sections.forEach((section) => {
    const children = section.querySelectorAll(":scope > *:not(.progress-bar):not(.slider):not(.slides)");

    gsap.set(section, { autoAlpha: 0 });
    gsap.set(children, { autoAlpha: 0, y: 30 });

    ScrollTrigger.create({
      trigger: section,
      start: "25% bottom",
      once: true,
      onEnter: () => {
        // Animate section in
        gsap.to(section, { autoAlpha: 1, duration: 0.4 });

        gsap.to(children, {
          autoAlpha: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.15,
        });
      },
    });
  });

  // === TYPEWRITER EFFECT ===
  const typedElement = document.getElementById("typed-subtitle");
  if (typedElement) {
    new Typed(typedElement, {
      strings: ["17 Year Old Web Builder", "Aspiring Fullstack Developer", "Frontend Programmer"],
      typeSpeed: 20,
      backSpeed: 30,
      backDelay: 1500,
      loop: true,
      smartBackspace: true,
      showCursor: false,
    });
  }
}

// === 3D RANDOM ANIMATION BACKGROUND (THREEJS) ===

import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

export function init3DBackground() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / document.documentElement.scrollHeight, 0.1, 1000);
  camera.position.z = 100; // move camera back to see more

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, document.documentElement.scrollHeight);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = document.documentElement.scrollHeight + "px";
  renderer.domElement.style.zIndex = "-1";
  document.body.appendChild(renderer.domElement);

  // Lights
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(100, 200, 100);
  scene.add(pointLight);
  scene.add(new THREE.AmbientLight(0xffffff, 0.6)); // brighter ambient

  // Simple geometries
  const geometries = [
    new THREE.CircleGeometry(4, 16),
    new THREE.BoxGeometry(6, 6, 1),
    new THREE.SphereGeometry(3.5, 16, 16),
    new THREE.PlaneGeometry(6, 6),
    new THREE.TorusGeometry(3, 1, 8, 16),
    new THREE.ConeGeometry(3, 6, 12),
    new THREE.SphereGeometry(3, 16, 16),
    new THREE.SphereGeometry(3.5, 64, 64),
  ];

  const outlineColors = [0xf5f1e9, 0xd2b48c, 0x8b5e3c];

  const shapes = [];
  const count = 80;

  for (let i = 0; i < count; i++) {
    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const color = outlineColors[Math.floor(Math.random() * outlineColors.length)];
    const fillColor = 0xffffff; // white fill

    // Fill material
    const fillMaterial = new THREE.MeshStandardMaterial({
      color: fillColor,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    });

    // Outline material
    const outlineMaterial = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, fillMaterial);

    // Outline as a child mesh
    const outlineMesh = new THREE.Mesh(geometry, outlineMaterial);
    mesh.add(outlineMesh);

    // Position
    mesh.position.set(
      (Math.random() - 0.5) * 100, // X: spread horizontally
      (Math.random() - 0.4) * 200, // Y: more downward spread
      (Math.random() - 0.5) * 200 // Z: some depth variation
    );

    // Random rotation
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI * 0.5);

    scene.add(mesh);
    shapes.push(mesh);
  }
  // Cursor tracking normalized to [-1,1]
  let mouseX = 0,
    mouseY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.6) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.6) * 2;
  });

  // Animate loop
  function animate() {
    requestAnimationFrame(animate);

    shapes.forEach((shape) => {
      shape.rotation.x += 0.002 + mouseY * 0.02;
      shape.rotation.y += 0.002 + mouseX * 0.02;
    });

    renderer.render(scene, camera);
  }

  animate();

  // Update canvas and camera on resize & scroll
  function updateSize() {
    const width = window.innerWidth;
    const height = document.documentElement.scrollHeight;

    renderer.setSize(width, height);
    renderer.domElement.style.height = height + "px";

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", updateSize);
  window.addEventListener("scroll", updateSize);
}
