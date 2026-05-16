document.addEventListener("DOMContentLoaded", async () => {

  // --- Load Header and Footer Components ---
  const headerPlaceholder = document.getElementById('header-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');

  if (headerPlaceholder) {
    const root = headerPlaceholder.getAttribute('data-root') || './';
    try {
      const res = await fetch(`${root}components/header.html`);
      let html = await res.text();
      html = html.replace(/\{\{ROOT\}\}/g, root);
      headerPlaceholder.innerHTML = html;
    } catch (e) {
      console.error('Failed to load header', e);
    }
  }

  if (footerPlaceholder) {
    const root = footerPlaceholder.getAttribute('data-root') || './';
    try {
      const res = await fetch(`${root}components/footer.html`);
      let html = await res.text();
      html = html.replace(/\{\{ROOT\}\}/g, root);
      footerPlaceholder.innerHTML = html;
    } catch (e) {
      console.error('Failed to load footer', e);
    }
  }

  // --- Initialize UI Interactions ---
  
  // Hamburger menu toggle
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
    });
  }

  // Scroll reveal animation
  const revealSections = document.querySelectorAll("section");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
        revealObserver.unobserve(entry.target); // Animate once
      }
    });
  }, { threshold: 0.1 });

  revealSections.forEach(section => {
    revealObserver.observe(section);
  });

  // Fetch and display last update date
  fetch('https://api.github.com/repos/RealRatnadwip/RealRatnadwip.github.io/commits?')
    .then(response => response.json())
    .then(data => {
      const date = new Date(data[0].commit.committer.date);
      const day = date.getDate().toString().padStart(2, '0');
      const monthName = date.toLocaleString("en-US", { month: "long" });
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const formatted = `Last updated: ${day} ${monthName} ${year} at ${hours}:${minutes}:${seconds} (${timeZone})`;
      
      const lastUpdatedElement = document.getElementById("last-updated");
      if (lastUpdatedElement) {
        lastUpdatedElement.textContent = formatted;
      }
    })
    .catch(error => {
      const lastUpdatedElement = document.getElementById("last-updated");
      if (lastUpdatedElement) {
        lastUpdatedElement.textContent = "Last updated: unavailable";
      }
    });

  // Clock
  function updateClock() {
    const clockEl = document.getElementById("liveClock");
    if (!clockEl) return;
    
    const now = new Date();
    const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
    const monthName = now.toLocaleDateString("en-US", { month: "long" });
    const day = now.getDate();
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const clockText = `Current Time - ${dayName}, ${monthName} ${day}, ${year} ${hours}:${minutes}:${seconds} (${timeZone})`;
    
    clockEl.textContent = clockText;
  }
  
  setInterval(updateClock, 1000);
  updateClock();

  // Redirect countdown (for thanks.html)
  const countdownEl = document.getElementById("countdown");
  const redirectText = document.getElementById("redirect-text");
  
  if (countdownEl && redirectText) {
    let seconds = 10;
    countdownEl.textContent = seconds;
    countdownEl.style.color = "#E0F11F"; // Highlight color
    
    const countdown = setInterval(() => {
      seconds--;
      countdownEl.textContent = seconds.toString().padStart(2, "0");
      if (seconds <= 0) {
        clearInterval(countdown);
        window.location.replace("../"); // Adjust path if needed
      }
    }, 1000);
  }

  // Image Preview
  const previewLayer = document.querySelector('.preview-layer');
  const previewImg = document.querySelector('.preview-img');
  const captionText = document.querySelector('.caption-text');
  const closeBtn = document.querySelector('.close-btn');

  if (previewLayer && previewImg) {
    document.querySelectorAll('.image-card, .pr-image-card').forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        if (img) {
          previewImg.src = img.src;
          if (captionText) captionText.textContent = card.getAttribute('data-caption') || '';
          previewLayer.classList.remove('hidden');
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        previewLayer.classList.add('hidden');
        previewImg.classList.remove('zoomed');
      });
    }

    previewLayer.addEventListener('click', (e) => {
      if (e.target === previewLayer) {
        previewLayer.classList.add('hidden');
        previewImg.classList.remove('zoomed');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        previewLayer.classList.add('hidden');
        previewImg.classList.remove('zoomed');
      }
    });

    previewImg.addEventListener('click', (e) => {
      e.stopPropagation();
      previewImg.classList.toggle('zoomed');
    });

    // Optional zoom effect on click
    try {
      document.styleSheets[0].insertRule(`
        .preview-img.zoomed {
          transform: scale(1.3);
          cursor: zoom-out;
        }
      `, document.styleSheets[0].cssRules.length);
    } catch (e) {}
  }
});