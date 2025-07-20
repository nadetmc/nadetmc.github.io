// Text phrases with no blue color (to avoid disappearance)
const phrases = [
  "I'm seling Minecraft Account",
  "helping you install mods",
  "trusted & fast delivery",
  "your gaming partner"
];

let phraseIndex = 0;
let letterIndex = 0;
let currentPhrase = '';
let isDeleting = false;
const changingText = document.getElementById("changing-text");
const cursor = document.querySelector(".cursor");

const typingSpeed = 100; // milliseconds per letter
const pauseTime = 1500; // pause time at full phrase

// Function to generate random pastel-ish RGB color avoiding blue tones
function getRandomColor() {
  // We'll generate colors avoiding high blue values
  const r = Math.floor(150 + Math.random() * 105);
  const g = Math.floor(150 + Math.random() * 105);
  const b = Math.floor(Math.random() * 100); // Keep blue low
  return `rgb(${r},${g},${b})`;
}

function type() {
  if (!isDeleting) {
    // Typing forward
    currentPhrase = phrases[phraseIndex].substring(0, letterIndex + 1);
    changingText.textContent = currentPhrase;
    letterIndex++;

    if (letterIndex === phrases[phraseIndex].length) {
      // Finished typing current phrase
      isDeleting = true;
      setTimeout(type, pauseTime);
      return;
    }
  } else {
    // Deleting backward
    currentPhrase = phrases[phraseIndex].substring(0, letterIndex - 1);
    changingText.textContent = currentPhrase;
    letterIndex--;

    if (letterIndex === 0) {
      // Finished deleting, move to next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  // Change color when phrase is complete or empty
  if (letterIndex === 0 || letterIndex === phrases[phraseIndex].length) {
    changingText.style.color = getRandomColor();
  }

  setTimeout(type, typingSpeed);
}

// Start the typing animation
type();

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navUl = document.querySelector('nav ul');

menuToggle.addEventListener('click', () => {
  navUl.classList.toggle('show');
});

// Close menu if clicking outside menu or toggle on mobile
document.addEventListener('click', (event) => {
  const isClickInsideMenu = navUl.contains(event.target);
  const isClickOnToggle = menuToggle.contains(event.target);

  if (!isClickInsideMenu && !isClickOnToggle) {
    navUl.classList.remove('show');
  }
});

// Custom smooth scroll function that works on all devices
function smoothScrollTo(targetPosition, duration = 800) {
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  // Easing function for smooth animation
  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

// Add smooth scrolling for all navigation links (both mobile and desktop)
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('nav ul li a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Close mobile menu if open
      if (navUl) {
        navUl.classList.remove('show');
      }
      
      // Get the target section
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Calculate offset for sticky nav
        const navHeight = document.querySelector('nav').offsetHeight;
        const targetPosition = targetSection.offsetTop - navHeight;
        
        // Try native smooth scroll first, fallback to custom implementation
        if ('scrollBehavior' in document.documentElement.style) {
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        } else {
          // Use custom smooth scroll for browsers/systems that don't support it
          smoothScrollTo(targetPosition);
        }
      }
    });
  });
});
