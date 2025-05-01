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