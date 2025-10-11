// Mobile menu toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn")
const mobileMenu = document.getElementById("mobileMenu")

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("active")
  mobileMenuBtn.classList.toggle("active") // Ensure this line is present
  // Remove direct span style manipulation for hamburger/X
})

// Close mobile menu when clicking a link
const mobileMenuLinks = mobileMenu.querySelectorAll("a")
mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active")
    mobileMenuBtn.classList.remove("active") // Ensure this line is present
    // Remove direct span style manipulation for hamburger/X
  })
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const offsetTop = target.offsetTop - 80 // Account for fixed nav
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  })
})

// Lazy load images for better mobile performance
document.querySelectorAll('img').forEach(img => {
  img.loading = 'lazy'
})

// Add scroll effect to navigation (throttled)
let lastScroll = 0
const nav = document.querySelector(".nav")
let ticking = false

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const currentScroll = window.pageYOffset
      if (currentScroll > 100) {
        nav.style.background = "rgba(10, 14, 26, 0.95)"
      } else {
        nav.style.background = "rgba(10, 14, 26, 0.8)"
      }
      lastScroll = currentScroll
      ticking = false
    })
    ticking = true
  }
}, { passive: true })

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe all cards and sections
const animatedElements = document.querySelectorAll(".skill-card, .stat-card, .project-card, .social-card")
animatedElements.forEach((el) => {
  el.style.opacity = "0"
  el.style.transform = "translateY(20px)"
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  observer.observe(el)
})

// Counter animation for stats
const statNumbers = document.querySelectorAll(".stat-number")
const animateCounter = (element) => {
  const target = element.textContent
  const number = Number.parseInt(target.replace(/\D/g, ""))
  const suffix = target.replace(/[0-9]/g, "")
  const duration = 2000
  const increment = number / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += increment
    if (current >= number) {
      element.textContent = target
      clearInterval(timer)
    } else {
      element.textContent = Math.floor(current) + suffix
    }
  }, 16)
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains("animated")) {
        animateCounter(entry.target)
        entry.target.classList.add("animated")
      }
    })
  },
  { threshold: 0.5 },
)

statNumbers.forEach((stat) => statsObserver.observe(stat))

// Minecraft server status (replace with your server IP or domain)
const serverIp = "romdoulmc.vip";
const statusDiv = document.getElementById("mcServerStatus");

function fetchServerStatus() {
  let loadingTimeout = setTimeout(() => {
    statusDiv.innerHTML = '<p>Loading server status...</p>';
  }, 500);

  fetch(`https://api.mcsrvstat.us/2/${serverIp}`)
    .then(res => res.json())
    .then(data => {
      clearTimeout(loadingTimeout);
      if (!data.online) {
        statusDiv.innerHTML = "<p>Server is offline.</p>";
      } else {
        let html = `<p>Server is <strong>Online</strong></p>`;
        html += `<p>Players: <strong>${data.players.online}</strong> / ${data.players.max}</p>`;
        if (data.players.list && data.players.list.length > 0) {
          html += `<p>Online: ${data.players.list.join(", ")}</p>`;
        }
        statusDiv.innerHTML = html;
      }
    })
    .catch(() => {
      clearTimeout(loadingTimeout);
      statusDiv.innerHTML = "<p>Unable to fetch server status.</p>";
    });
}

if (statusDiv) {
  fetchServerStatus();
  setInterval(fetchServerStatus, 15000); // refresh every 15 seconds
}

// Click to copy server IP (improved for mobile)
function copyServerIp() {
  const ipText = serverIpSpan ? serverIpSpan.textContent : "";
  if (ipText) {
    // Use a fallback for older mobile browsers
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(ipText)
        .then(() => {
          if (copyStatus) {
            copyStatus.textContent = "Copied!";
            setTimeout(() => { copyStatus.textContent = ""; }, 1200);
          }
        });
    } else {
      // Fallback for insecure context or unsupported clipboard API
      const tempInput = document.createElement("input");
      tempInput.value = ipText;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      if (copyStatus) {
        copyStatus.textContent = "Copied!";
        setTimeout(() => { copyStatus.textContent = ""; }, 1200);
      }
    }
  }
}

const serverIpSpan = document.getElementById("serverIp");
const copyIcon = document.getElementById("copyIcon");
const copyStatus = document.getElementById("copyStatus");

if (serverIpSpan) {
  serverIpSpan.addEventListener("click", copyServerIp);
  serverIpSpan.addEventListener("touchend", copyServerIp);
}
if (copyIcon) {
  copyIcon.addEventListener("click", copyServerIp);
  copyIcon.addEventListener("touchend", copyServerIp);
}

// Preserve scroll position after refresh
window.addEventListener("beforeunload", () => {
  sessionStorage.setItem("scrollPos", window.scrollY);
});
window.addEventListener("load", () => {
  const scrollPos = sessionStorage.getItem("scrollPos");
  if (scrollPos) {
    window.scrollTo(0, parseInt(scrollPos, 10));
    sessionStorage.removeItem("scrollPos");
  }
})

