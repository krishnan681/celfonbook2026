import confetti from "canvas-confetti";

/**
 * Fires celebration confetti in Indian Flag tricolor colors:
 * Saffron (#FF9933, #FF671F), White (#FFFFFF), Green (#138808, #046A38), and Ashoka Blue (#000088)
 * zIndex is set to 1000000 to ensure confetti always displays ON TOP of all modals and overlays.
 */
export const fireIndependenceConfetti = (options = {}) => {
  const tricolorPalette = [
    "#FF9933", // Saffron
    "#FF671F", // Deep Saffron
    "#FFFFFF", // Pure White
    "#E2E8F0", // Silver White
    "#138808", // India Green
    "#046A38", // Deep Green
    "#000088", // Ashoka Navy Blue
  ];

  const zIndex = options.zIndex || 1000000;

  // 1. Center burst
  confetti({
    particleCount: options.particleCount || 75,
    spread: options.spread || 80,
    origin: options.origin || { y: 0.6 },
    colors: tricolorPalette,
    disableForReducedMotion: true,
    shapes: ["square", "circle"],
    ticks: 220,
    gravity: 0.9,
    scalar: 1.1,
    zIndex,
  });

  // 2. Dual cannon blast (left & right)
  const duration = 1200;
  const animationEnd = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: tricolorPalette,
      gravity: 0.85,
      zIndex,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: tricolorPalette,
      gravity: 0.85,
      zIndex,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  requestAnimationFrame(frame);
};

export const fireGrandFireworks = () => {
  const tricolorPalette = ["#FF9933", "#FFFFFF", "#138808", "#000088"];
  const count = 220;
  const zIndex = 1000000;
  const defaults = {
    origin: { y: 0.7 },
    colors: tricolorPalette,
    zIndex,
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
      zIndex,
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};
