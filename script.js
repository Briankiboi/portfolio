// Navigation highlight on scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('main > section');
  const navLinks = document.querySelectorAll('.navbar a');
  
  let currentSection = '';
  
  sections.forEach(section => {
    if (section.classList.contains('active')) {
      const container = section.querySelector('.section-container');
      const sectionTop = container.offsetTop - 100;
      const sectionHeight = container.clientHeight;
      const scrollPosition = container.scrollTop;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = '#' + section.id;
      }
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentSection) {
      link.classList.add('active');
    }
  });
});

// Contact form submission (placeholder)
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for your message! (This is a placeholder alert.)');
      form.reset();
    });
  }

  // SPA-style navigation with section visibility control and animations
  const navLinks = document.querySelectorAll('.navbar a');
  const sections = document.querySelectorAll('main > section');

  // Hide all sections initially except skills section
  sections.forEach(section => {
    if (section.id === 'skills-section') {
      section.style.display = 'block';
      section.classList.add('active');
    } else {
      section.style.display = 'none';
      section.classList.remove('active');
    }
  });

  async function showSection(hash) {
    const targetId = hash.replace('#', '');
    
    // Find current active section
    const currentSection = document.querySelector('section.active');
    
    // Find target section
    const targetSection = document.getElementById(targetId);
    
    if (!targetSection || currentSection === targetSection) return;

    // If showing gallery section, trigger "All" filter
    if (targetId === 'gallery') {
      const allFilterButton = document.querySelector('.portfolio-categories button[data-filter="all"]');
      if (allFilterButton) {
        allFilterButton.click();
      }
    }

    // Store scroll position of all sections
    const scrollPositions = new Map();
    document.querySelectorAll('section').forEach(section => {
      const container = section.querySelector('.section-container');
      if (container) {
        scrollPositions.set(section.id, container.scrollTop);
      }
    });

    // Fade out current section
    if (currentSection) {
      currentSection.style.animation = 'fadeOutDown 0.3s ease forwards';
      await new Promise(resolve => setTimeout(resolve, 300));
      currentSection.classList.remove('active');
      currentSection.style.display = 'none';
    }

    // Show and fade in target section
    targetSection.style.display = 'block';
    targetSection.style.animation = 'fadeInUp 0.5s ease forwards';
    
    // Restore scroll position or reset to top
    const targetContainer = targetSection.querySelector('.section-container');
    if (targetContainer) {
      // Enable smooth scrolling temporarily
      targetContainer.style.scrollBehavior = 'smooth';
      
      // If returning to a section, restore its scroll position
      if (scrollPositions.has(targetId)) {
        setTimeout(() => {
          targetContainer.scrollTop = scrollPositions.get(targetId);
        }, 50);
      } else {
        // New section visit, scroll to top
        targetContainer.scrollTop = 0;
      }
      
      // Reset scroll behavior after animation
      setTimeout(() => {
        targetContainer.style.scrollBehavior = 'auto';
      }, 500);
    }

    setTimeout(() => {
      targetSection.classList.add('active');
    }, 50);

    // Update active state in navigation
    navLinks.forEach(link => {
      if (link.getAttribute('href') === hash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Handle navigation clicks with smooth scroll to top option
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const hash = this.getAttribute('href');
      const currentSection = document.querySelector('section.active');
      const currentContainer = currentSection?.querySelector('.section-container');
      
      // If clicking the same section and not at top, scroll to top
      if (currentSection?.id === hash.substring(1) && currentContainer?.scrollTop > 0) {
        currentContainer.style.scrollBehavior = 'smooth';
        currentContainer.scrollTop = 0;
        setTimeout(() => {
          currentContainer.style.scrollBehavior = 'auto';
        }, 500);
      } else {
        // Switch to different section
        showSection(hash);
      }
      history.replaceState(null, '', hash);
    });
  });

  // Add scroll event listeners to each section container
  document.querySelectorAll('.section-container').forEach(container => {
    container.addEventListener('scroll', () => {
      // Add shadow when scrolled
      if (container.scrollTop > 0) {
        container.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
      } else {
        container.style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)';
      }
    });
  });

  const whatDoingTab = document.getElementById('whatdoing-tab');
  const skillsTab = document.getElementById('skills-tab');
  const whatDoingSection = document.getElementById('whatdoing-section');
  const skillsSection = document.getElementById('skills-section');

  function setActive(tab) {
    if (tab === 'whatdoing') {
      whatDoingSection.style.display = 'block';
      skillsSection.style.display = 'none';
      whatDoingTab.classList.add('active');
      skillsTab.classList.remove('active');
    } else {
      whatDoingSection.style.display = 'none';
      skillsSection.style.display = 'block';
      whatDoingTab.classList.remove('active');
      skillsTab.classList.add('active');
    }
  }

  whatDoingTab.addEventListener('click', function(e) {
    e.preventDefault();
    setActive('whatdoing');
  });
  skillsTab.addEventListener('click', function(e) {
    e.preventDefault();
    setActive('skills');
  });

  // Set default tab
  setActive('skills');

  // Handle initial hash on page load
  if (window.location.hash) {
    showSection(window.location.hash);
  } else {
    // If no hash, show skills section by default
    showSection('#skills-section');
  }

  // Add click handler for rate card image to open in new tab
  const rateCardImage = document.querySelector('.rate-card-image');
  if (rateCardImage) {
    rateCardImage.addEventListener('click', function() {
      window.open(this.src, '_blank');
    });
  }

  // Payment Modal Functionality
  const paymentOptions = document.querySelectorAll('.payment-option');
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close-button');

  paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
      const modalId = option.getAttribute('data-modal-target');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'block';
      }
    });
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });

  window.addEventListener('click', (event) => {
    modals.forEach(modal => {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    });
  });

  // Portfolio filtering
  const filterButtons = document.querySelectorAll('.portfolio-categories button');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 0);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Handle Portfolio link from Testimonial
  const portfolioLink = document.querySelector('.portfolio-link');
  if (portfolioLink) {
    portfolioLink.addEventListener('click', function(e) {
      e.preventDefault();
      const hash = this.getAttribute('href');
      showSection(hash);
      history.replaceState(null, '', hash);
    });
  }
});

// Sidebar Toggle Functionality
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.sidebar-overlay');

function toggleSidebar() {
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
  document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
}

sidebarToggle.addEventListener('click', toggleSidebar);
overlay.addEventListener('click', toggleSidebar);

// Close sidebar when clicking on a navigation link
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', () => {
    if (sidebar.classList.contains('active')) {
      toggleSidebar();
    }
  });
});

// Portfolio Modal Functionality
const portfolioModal = document.getElementById('portfolio-modal');
const portfolioModalImg = document.getElementById('portfolio-modal-img');
const portfolioModalTitle = document.getElementById('portfolio-modal-title');
const portfolioModalDesc = document.getElementById('portfolio-modal-desc');
const portfolioModalClose = document.querySelector('.portfolio-modal-close');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const zoomResetBtn = document.getElementById('zoom-reset');

let currentZoom = 1;
const zoomStep = 0.5;
const maxZoom = 4;
const minZoom = 1;

// Open modal when clicking on portfolio items
document.querySelectorAll('.portfolio-item').forEach(item => {
  item.addEventListener('click', function(e) {
    const img = this.querySelector('img');
    const title = this.querySelector('.portfolio-item-overlay h3')?.textContent || 'Portfolio Item';
    const desc = this.querySelector('.portfolio-item-overlay p')?.textContent || 'UI/UX Design';
    
    if (img) {
      portfolioModalImg.src = img.src;
      portfolioModalImg.alt = img.alt;
      portfolioModalTitle.textContent = title;
      portfolioModalDesc.textContent = desc;
      
      // Reset zoom
      currentZoom = 1;
      portfolioModalImg.style.transform = 'scale(1)';
      portfolioModalImg.classList.remove('zoomed');
      
      // Show modal
      portfolioModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
});

// Close modal
function closeModal() {
  portfolioModal.classList.remove('active');
  document.body.style.overflow = '';
  currentZoom = 1;
  portfolioModalImg.style.transform = 'scale(1)';
  portfolioModalImg.classList.remove('zoomed');
}

portfolioModalClose.addEventListener('click', closeModal);

// Close modal when clicking outside the image
portfolioModal.addEventListener('click', function(e) {
  if (e.target === portfolioModal) {
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && portfolioModal.classList.contains('active')) {
    closeModal();
  }
});

// Zoom functionality
zoomInBtn.addEventListener('click', function() {
  if (currentZoom < maxZoom) {
    currentZoom += zoomStep;
    portfolioModalImg.style.transform = `scale(${currentZoom})`;
    portfolioModalImg.classList.add('zoomed');
  }
});

zoomOutBtn.addEventListener('click', function() {
  if (currentZoom > minZoom) {
    currentZoom -= zoomStep;
    if (currentZoom <= minZoom) {
      currentZoom = minZoom;
      portfolioModalImg.classList.remove('zoomed');
    }
    portfolioModalImg.style.transform = `scale(${currentZoom})`;
  }
});

zoomResetBtn.addEventListener('click', function() {
  currentZoom = 1;
  portfolioModalImg.style.transform = 'scale(1)';
  portfolioModalImg.classList.remove('zoomed');
});

// Double-click to zoom in/out
portfolioModalImg.addEventListener('dblclick', function() {
  if (currentZoom === 1) {
    currentZoom = 2;
    portfolioModalImg.style.transform = 'scale(2)';
    portfolioModalImg.classList.add('zoomed');
  } else {
    currentZoom = 1;
    portfolioModalImg.style.transform = 'scale(1)';
    portfolioModalImg.classList.remove('zoomed');
  }
});

// Mouse wheel zoom (optional)
portfolioModalImg.addEventListener('wheel', function(e) {
  e.preventDefault();
  if (e.deltaY < 0) {
    // Zoom in
    if (currentZoom < maxZoom) {
      currentZoom += 0.1;
      portfolioModalImg.style.transform = `scale(${currentZoom})`;
      portfolioModalImg.classList.add('zoomed');
    }
  } else {
    // Zoom out
    if (currentZoom > minZoom) {
      currentZoom -= 0.1;
      if (currentZoom <= minZoom) {
        currentZoom = minZoom;
        portfolioModalImg.classList.remove('zoomed');
      }
      portfolioModalImg.style.transform = `scale(${currentZoom})`;
    }
  }
}, { passive: false }); 