// Minecraft-themed text phrases
const phrases = [
  "សួរស្ដី! Welcome to my world!",
  "ខ្ញុំមានលក់អាខោន​ Minecraft",
  "ធានាសុវត្ថិភាព 100%!",
  "ស្មោះត្រង់និងច្បាស់លាស់",
  "Ready to craft your adventure?",
  "Let's build something amazing!"
];

let phraseIndex = 0;
let letterIndex = 0;
let currentPhrase = '';
let isDeleting = false;
const changingText = document.getElementById("changing-text");
const cursor = document.querySelector(".minecraft-cursor");

const typingSpeed = 100; // milliseconds per letter
const pauseTime = 2000; // pause time at full phrase

// Function to generate Minecraft-themed colors
function getMinecraftColor() {
  const colors = [
    '#7cb342', // grass green
    '#f1c40f', // gold yellow
    '#5dade2', // diamond blue
    '#cd853f', // wood light
    '#85c1e9', // diamond light
    '#d4ac0d'  // gold dark
  ];
  return colors[Math.floor(Math.random() * colors.length)];
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
    changingText.style.color = getMinecraftColor();
  }

  setTimeout(type, typingSpeed);
}

// Start the typing animation
document.addEventListener('DOMContentLoaded', function() {
  type();
});

// Enhanced Mobile menu toggle for Minecraft toolbar - Fixed for iPhone 6s Plus
let menuToggle, toolbarItems;

function initMobileMenu() {
  menuToggle = document.querySelector('.menu-toggle');
  toolbarItems = document.querySelector('.toolbar-items');

  if (menuToggle && toolbarItems) {
    // Remove any existing event listeners
    menuToggle.removeEventListener('click', toggleMenu);
    menuToggle.removeEventListener('touchstart', toggleMenu);
    
    // Add both click and touch events for better iOS compatibility
    menuToggle.addEventListener('click', toggleMenu, { passive: false });
    menuToggle.addEventListener('touchstart', toggleMenu, { passive: false });
    
    // Prevent default behavior on menu toggle
    menuToggle.addEventListener('touchend', function(e) {
      e.preventDefault();
    }, { passive: false });
  }
}

function toggleMenu(event) {
  event.preventDefault();
  event.stopPropagation();
  
  if (toolbarItems) {
    const isOpen = toolbarItems.classList.contains('show');
    
    if (isOpen) {
      toolbarItems.classList.remove('show');
      menuToggle.setAttribute('aria-expanded', 'false');
    } else {
      toolbarItems.classList.add('show');
      menuToggle.setAttribute('aria-expanded', 'true');
    }
  }
}

// Enhanced outside click handler for iOS
function handleOutsideClick(event) {
  if (!menuToggle || !toolbarItems) return;
  
  const isClickInsideMenu = toolbarItems.contains(event.target);
  const isClickOnToggle = menuToggle.contains(event.target);
  const isMenuOpen = toolbarItems.classList.contains('show');

  if (isMenuOpen && !isClickInsideMenu && !isClickOnToggle) {
    toolbarItems.classList.remove('show');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
}

// Initialize menu after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  
  // Add outside click listeners with proper iOS support
  document.addEventListener('click', handleOutsideClick, true);
  document.addEventListener('touchstart', handleOutsideClick, { passive: true });
});

// Enhanced smooth scroll function for Minecraft navigation
function smoothScrollTo(targetPosition, duration = 1000) {
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

// Add smooth scrolling for all navigation links
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.minecraft-link[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Close mobile menu if open
      if (toolbarItems) {
        toolbarItems.classList.remove('show');
      }
      
      // Get the target section
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Calculate offset for sticky nav
        const navHeight = document.querySelector('.minecraft-toolbar').offsetHeight;
        const targetPosition = targetSection.offsetTop - navHeight;
        
        // Use custom smooth scroll for consistent behavior
        smoothScrollTo(targetPosition, 800);
      }
    });
  });
});

// Minecraft block hover effects
document.addEventListener('DOMContentLoaded', function() {
  // Add hover sound effect simulation (visual feedback)
  const hoverElements = document.querySelectorAll('.craft-button, .inventory-slot, .sign-board, .toolbar-slot');
  
  hoverElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      // Add a subtle scale effect on hover
      this.style.transform = this.style.transform + ' scale(1.02)';
    });
    
    element.addEventListener('mouseleave', function() {
      // Remove the scale effect
      this.style.transform = this.style.transform.replace(' scale(1.02)', '');
    });
  });
});

// Parallax effect for floating blocks
document.addEventListener('DOMContentLoaded', function() {
  const floatingBlocks = document.querySelectorAll('.block');
  
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    floatingBlocks.forEach((block, index) => {
      const speed = 0.2 + (index * 0.1); // Different speeds for each block
      block.style.transform = `translateY(${rate * speed}px)`;
    });
  });
});

// Inventory slot click effects
document.addEventListener('DOMContentLoaded', function() {
  const inventorySlots = document.querySelectorAll('.inventory-slot');
  
  inventorySlots.forEach(slot => {
    slot.addEventListener('click', function(e) {
      // Don't trigger if clicking on a button inside the slot
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        return;
      }
      
      // Add a "selected" effect
      this.style.boxShadow = 'inset 4px 4px 8px rgba(241, 196, 15, 0.6), inset -4px -4px 8px rgba(0,0,0,0.4), 0 0 20px rgba(241, 196, 15, 0.5)';
      
      // Remove the effect after a short time
      setTimeout(() => {
        this.style.boxShadow = '';
      }, 300);
    });
  });
});

// Achievement unlock animation
document.addEventListener('DOMContentLoaded', function() {
  const achievements = document.querySelectorAll('.achievement');
  
  // Animate achievements on scroll
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const achievementObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'achievementUnlock 0.6s ease-out forwards';
        entry.target.style.animationDelay = `${Array.from(achievements).indexOf(entry.target) * 0.2}s`;
      }
    });
  }, observerOptions);
  
  achievements.forEach(achievement => {
    achievement.style.opacity = '0';
    achievement.style.transform = 'translateX(-50px)';
    achievementObserver.observe(achievement);
  });
});

// Add CSS animation for achievement unlock
const style = document.createElement('style');
style.textContent = `
  @keyframes achievementUnlock {
    0% {
      opacity: 0;
      transform: translateX(-50px) scale(0.8);
    }
    50% {
      opacity: 1;
      transform: translateX(10px) scale(1.1);
    }
    100% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }
`;
document.head.appendChild(style);

// Gallery placeholder interaction
document.addEventListener('DOMContentLoaded', function() {
  const galleryFrames = document.querySelectorAll('.screenshot-frame');
  
  galleryFrames.forEach(frame => {
    frame.addEventListener('click', function() {
      const placeholder = this.querySelector('.screenshot-placeholder');
      const icon = placeholder.querySelector('.placeholder-icon');
      
      // Animate the icon
      icon.style.transform = 'scale(1.5) rotate(360deg)';
      icon.style.transition = 'transform 0.5s ease';
      
      // Reset after animation
      setTimeout(() => {
        icon.style.transform = 'scale(1) rotate(0deg)';
      }, 500);
    });
  });
});

// XP bar animation trigger
document.addEventListener('DOMContentLoaded', function() {
  const xpBar = document.querySelector('.xp-fill');
  
  if (xpBar) {
    const observerOptions = {
      threshold: 0.5
    };
    
    const xpObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'xpFill 2s ease-in-out forwards';
        }
      });
    }, observerOptions);
    
    xpObserver.observe(xpBar);
  }
});

// Block letter animation for title
document.addEventListener('DOMContentLoaded', function() {
  const blockLetters = document.querySelectorAll('.block-letter');
  
  // Trigger animation on page load
  setTimeout(() => {
    blockLetters.forEach((letter, index) => {
      letter.style.animationDelay = `${index * 0.1}s`;
    });
  }, 500);
});

// Sign board click effects with color changes
document.addEventListener('DOMContentLoaded', function() {
  const signBoards = document.querySelectorAll('.sign-board');
  
  signBoards.forEach(sign => {
    sign.addEventListener('click', function() {
      // Add a brief glow effect
      this.style.boxShadow = 'inset 3px 3px 6px rgba(255,255,255,0.6), inset -3px -3px 6px rgba(0,0,0,0.6), 0 0 30px rgba(241, 196, 15, 0.8)';
      
      // Reset after a short time
      setTimeout(() => {
        this.style.boxShadow = '';
      }, 200);
    });
  });
});

// Responsive handling for mobile devices
document.addEventListener('DOMContentLoaded', function() {
  function handleResize() {
    const isMobile = window.innerWidth <= 768;
    const toolbarItems = document.querySelector('.toolbar-items');
    
    if (!isMobile && toolbarItems) {
      toolbarItems.classList.remove('show');
    }
  }
  
  window.addEventListener('resize', handleResize);
  handleResize(); // Call once on load
});

// Add loading animation for the page
document.addEventListener('DOMContentLoaded', function() {
  // Hide loading elements initially
  const animatedElements = document.querySelectorAll('.inventory-slot, .screenshot-frame, .sign-board');
  
  animatedElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    
    // Animate in with staggered delay
    setTimeout(() => {
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 100 + 500);
  });
});

// Console easter egg for Minecraft fans
console.log(`
🎮 Welcome to NadetMC's Minecraft World! 🎮
⛏️  Ready to craft your adventure?
🏗️  Built with love and lots of blocks!
💎 Find any bugs? Let me know on Telegram!
`);
