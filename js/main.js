/**
 * BEYOND FRAMES - Interactive Portfolio & Studio Engine
 * Full-featured Photography, Videography, Cinematography & Post-Production Platform
 * Includes In-Browser Live CMS / Customizer (Logo upload, Photo upload, Contact updates, WhatsApp sync)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initStorageSync();
  initPortfolio();
  initLightbox();
  initColorGradingSlider();
  initShowreelModal();
  initContactForm();
  initStudioManager();
  initSpecBuilder();
  initCameraHUD();
  initCameraSoundFX();
  initCinemaLutSwitcher();
  initLensSimulator();
  initCommercialVideoShowcase();
  initCommercialColorSlider();
  initAICreativeProducer();
  initCardTiltPhysics();
  initDirectorsConsole();
  updateInquiriesBadge();
  if (window.lucide) lucide.createIcons();
});

/* ==========================================
   0. CAMERA VIEWFINDER & HUD TIMECODE TICKER
   ========================================== */
function initCameraHUD() {
  const tcElement = document.getElementById('hud-timecode');
  if (tcElement) {
    let frames = 18;
    let seconds = 24;
    let minutes = 4;
    let hours = 0;

    setInterval(() => {
      frames++;
      if (frames >= 24) {
        frames = 0;
        seconds++;
        if (seconds >= 60) {
          seconds = 0;
          minutes++;
          if (minutes >= 60) {
            minutes = 0;
            hours++;
          }
        }
      }
      const fStr = String(frames).padStart(2, '0');
      const sStr = String(seconds).padStart(2, '0');
      const mStr = String(minutes).padStart(2, '0');
      const hStr = String(hours).padStart(2, '0');
      tcElement.textContent = `${hStr}:${mStr}:${sStr}:${fStr}`;
    }, 41.6);
  }

  // Camera HUD Viewfinder Grid Toggle
  const gridToggleBtn = document.getElementById('hud-grid-toggle');
  const gridStatus = document.getElementById('hud-grid-status');
  const hudGrids = document.querySelectorAll('.camera-hud-grid');
  let hudActive = true;

  if (gridToggleBtn && gridStatus) {
    gridToggleBtn.addEventListener('click', () => {
      hudActive = !hudActive;
      hudGrids.forEach(grid => {
        grid.style.opacity = hudActive ? '1' : '0';
      });
      gridStatus.textContent = hudActive ? 'ON' : 'OFF';
      gridStatus.className = hudActive ? 'text-emerald-400 font-bold' : 'text-slate-500 font-bold';
    });
  }
}

/* ==========================================
   1. NAVBAR & SCROLL BEHAVIOR
   ========================================== */
function initNavbar() {
  const navbar = document.getElementById('main-navbar');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (!mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
      });
    });
  }
}

/* ==========================================
   2. LOCAL STORAGE SYNC (RESTORES CUSTOM LOGO & DATA)
   ========================================== */
function initStorageSync() {
  // Restore custom logo if user uploaded one (data:image)
  const savedLogo = localStorage.getItem('beyond_frames_logo');
  if (savedLogo && savedLogo.startsWith('data:image')) {
    document.querySelectorAll('.brand-logo-img').forEach(img => {
      img.src = savedLogo;
    });
  } else if (savedLogo && savedLogo.includes('.svg')) {
    // Clear legacy placeholder SVG
    localStorage.removeItem('beyond_frames_logo');
  }

  // Clear legacy placeholder phone / location if set
  if (localStorage.getItem('beyond_frames_phone') === '+1 (555) 890-FILM') {
    localStorage.removeItem('beyond_frames_phone');
  }
  if (localStorage.getItem('beyond_frames_whatsapp') === '15558903456') {
    localStorage.removeItem('beyond_frames_whatsapp');
  }
  if (localStorage.getItem('beyond_frames_location') === 'Available Locally & Traveling Worldwide') {
    localStorage.removeItem('beyond_frames_location');
  }
  if (localStorage.getItem('beyond_frames_email') === 'contact@beyondframes.com' || localStorage.getItem('beyond_frames_email') === 'hello@beyondframes.com') {
    localStorage.removeItem('beyond_frames_email');
  }

  // Restore custom contact info
  const savedPhone = localStorage.getItem('beyond_frames_phone') || '+91 98929 67174';
  const savedWhatsApp = localStorage.getItem('beyond_frames_whatsapp') || '919892967174';
  const savedEmail = localStorage.getItem('beyond_frames_email') || 'beyondframess10@gmail.com';
  const savedLocation = localStorage.getItem('beyond_frames_location') || 'Available All Over Maharashtra';
  const savedInstagram = localStorage.getItem('beyond_frames_instagram') || 'https://www.instagram.com/abrarphotography2010';

  document.querySelectorAll('.brand-phone-text').forEach(el => el.textContent = savedPhone);
  document.querySelectorAll('.brand-phone-link').forEach(el => el.href = `tel:${savedPhone.replace(/[^0-9+]/g, '')}`);

  document.querySelectorAll('.brand-email-text').forEach(el => el.textContent = savedEmail);
  document.querySelectorAll('.brand-email-link').forEach(el => el.href = `mailto:${savedEmail}`);

  document.querySelectorAll('.brand-location-text').forEach(el => el.textContent = savedLocation);
  
  document.querySelectorAll('.brand-instagram-link').forEach(el => el.href = savedInstagram);
  
  updateWhatsAppLinks(savedWhatsApp);
}

function updateWhatsAppLinks(rawPhone) {
  const cleanNumber = rawPhone.replace(/[^0-9]/g, '');
  document.querySelectorAll('.whatsapp-direct-btn').forEach(btn => {
    btn.href = `https://wa.me/${cleanNumber}?text=Hi%20Beyond%20Frames,%20I%20am%20interested%20in%20booking%20a%20production%20or%20photo%20shoot!`;
  });
}

/* ==========================================
   3. PORTFOLIO FILTERING & DYNAMIC RENDERING
   ========================================== */
function initPortfolio() {
  renderCustomUploadedWorks();
  refreshPortfolioFilters();
}

function renderCustomUploadedWorks() {
  const customWorks = JSON.parse(localStorage.getItem('beyond_frames_user_works') || '[]');
  const grid = document.getElementById('portfolio-grid');
  if (!grid || customWorks.length === 0) return;

  // Insert user uploaded works at the top of the grid
  customWorks.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = `portfolio-card ${item.aspectRatio || 'aspect-[16/10]'} user-uploaded-card`;
    card.setAttribute('data-category', item.category);
    card.setAttribute('data-title', item.title);
    card.setAttribute('data-category-label', item.categoryLabel || item.category.toUpperCase());
    card.setAttribute('data-gear', item.gear || 'Beyond Frames Cinema Suite');
    card.setAttribute('data-client', item.client || 'Original Production');
    card.setAttribute('data-user-index', index);

    card.innerHTML = `
      <img src="${item.imageData}" data-highres="${item.imageData}" alt="${item.title}" loading="lazy">
      <div class="portfolio-overlay">
        <div class="flex items-center justify-between w-full mb-1">
          <span class="px-2.5 py-1 rounded text-[10px] font-bold tracking-widest uppercase badge-gold">${item.category.toUpperCase()}</span>
          <span class="text-[10px] bg-amber-500/20 text-brand-gold px-2 py-0.5 rounded border border-brand-gold/30">Your Upload</span>
        </div>
        <h3 class="text-lg sm:text-xl font-bold font-display text-white">${item.title}</h3>
        <p class="text-xs text-slate-300 mt-0.5">${item.gear || 'High-Res Production'}</p>
      </div>
    `;

    grid.insertBefore(card, grid.firstChild);
  });
}

function refreshPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-card');

  // Multi-category counting (supports items matching both commercial & editing)
  const counts = { all: items.length };
  items.forEach(item => {
    const cats = (item.getAttribute('data-category') || '').trim().split(/\s+/);
    cats.forEach(c => {
      if (c) {
        counts[c] = (counts[c] || 0) + 1;
      }
    });
  });

  filterBtns.forEach(btn => {
    const target = btn.getAttribute('data-filter');
    const badge = btn.querySelector('.badge-count');
    if (badge && counts[target] !== undefined) {
      badge.textContent = counts[target];
    }

    btn.onclick = () => {
      playShutterSound();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      items.forEach(item => {
        const cats = (item.getAttribute('data-category') || '').trim().split(/\s+/);
        if (target === 'all' || cats.includes(target)) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(15px) scale(0.96)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    };
  });

  // Hover video preview playback
  items.forEach(card => {
    const preview = card.querySelector('.hover-preview-video');
    if (preview) {
      card.addEventListener('mouseenter', () => {
        preview.play().catch(() => {});
      });
      card.addEventListener('mouseleave', () => {
        preview.pause();
      });
    }
  });
}

/* ==========================================
   4. CINEMATIC LIGHTBOX MODAL
   ========================================== */
let currentLightboxIndex = 0;
let visiblePortfolioItems = [];

function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxGear = document.getElementById('lightbox-gear');
  const lightboxClient = document.getElementById('lightbox-client');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!modal) return;

  function updateVisibleItems() {
    visiblePortfolioItems = Array.from(document.querySelectorAll('.portfolio-card')).filter(
      card => card.style.display !== 'none'
    );
  }

  function openLightbox(index) {
    playShutterSound();
    triggerShutterFlash();
    updateVisibleItems();
    if (visiblePortfolioItems.length === 0) return;
    
    currentLightboxIndex = (index + visiblePortfolioItems.length) % visiblePortfolioItems.length;
    const card = visiblePortfolioItems[currentLightboxIndex];
    
    const imgEl = card.querySelector('img');
    const title = card.getAttribute('data-title') || 'Untitled Masterpiece';
    const cat = card.getAttribute('data-category-label') || 'Photography';
    const gear = card.getAttribute('data-gear') || 'Sony FX3 &bull; 35mm f/1.4 GM';
    const client = card.getAttribute('data-client') || 'Client Production';
    const videoSrc = card.getAttribute('data-video-src');

    if (videoSrc && lightboxVideo) {
      if (lightboxImg) lightboxImg.classList.add('hidden');
      lightboxVideo.classList.remove('hidden');
      lightboxVideo.src = videoSrc;
      lightboxVideo.play().catch(() => {});
    } else {
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.src = '';
        lightboxVideo.classList.add('hidden');
      }
      if (lightboxImg) {
        lightboxImg.classList.remove('hidden');
        lightboxImg.src = imgEl ? (imgEl.getAttribute('data-highres') || imgEl.src) : '';
      }
    }

    lightboxTitle.textContent = title;
    lightboxCategory.textContent = cat;
    lightboxGear.innerHTML = gear;
    lightboxClient.textContent = client;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.src = '';
    }
    document.body.style.overflow = '';
  }

  // Delegated click for lightbox (supports dynamically uploaded cards)
  const portfolioGrid = document.getElementById('portfolio-grid');
  if (portfolioGrid) {
    portfolioGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.portfolio-card');
      if (card) {
        updateVisibleItems();
        const idx = visiblePortfolioItems.indexOf(card);
        if (idx !== -1) {
          openLightbox(idx);
        }
      }
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playShutterSound();
    openLightbox(currentLightboxIndex - 1);
  });
  if (nextBtn) nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playShutterSound();
    openLightbox(currentLightboxIndex + 1);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-backdrop')) {
      closeLightbox();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(currentLightboxIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(currentLightboxIndex + 1);
  });
}

/* ==========================================
   5. BEFORE / AFTER COLOR GRADING SLIDER
   ========================================== */
function initColorGradingSlider() {
  const container = document.getElementById('grading-slider-container');
  const overlay = document.getElementById('grading-overlay');
  const handle = document.getElementById('grading-handle');

  if (!container || !overlay || !handle) return;

  let isDragging = false;

  function updateSliderPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percentage = (x / rect.width) * 100;
    overlay.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* ==========================================
   6. SHOWREEL VIDEO MODAL
   ========================================== */
function initShowreelModal() {
  const openButtons = document.querySelectorAll('.open-showreel-btn');
  const modal = document.getElementById('showreel-modal');
  const closeBtn = document.getElementById('showreel-close');
  const videoIframe = document.getElementById('showreel-iframe');

  if (!modal) return;

  const defaultReel = "https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&mute=0&rel=0";

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const customUrl = localStorage.getItem('beyond_frames_reel_url') || defaultReel;
      modal.classList.add('active');
      if (videoIframe) {
        videoIframe.src = customUrl;
      }
      document.body.style.overflow = 'hidden';
    });
  });

  function closeReel() {
    modal.classList.remove('active');
    if (videoIframe) {
      videoIframe.src = "";
    }
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeReel);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('reel-backdrop')) {
      closeReel();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (modal.classList.contains('active') && e.key === 'Escape') {
      closeReel();
    }
  });
}

/* ==========================================
   6B. COMMERCIAL VIDEO EDITING SHOWCASE CONTROLLER
   ========================================== */
function initCommercialVideoShowcase() {
  const video = document.getElementById('commercial-editing-video');
  const toggleBtn = document.getElementById('toggle-sound-btn');
  if (!video) return;

  // Toggle play/pause on direct video click
  video.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });

  if (toggleBtn) {
    const soundText = toggleBtn.querySelector('.sound-text');
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      if (video.muted) {
        if (soundText) soundText.textContent = 'UNMUTE SOUND';
        toggleBtn.classList.remove('bg-brand-gold', 'text-brand-black');
      } else {
        if (soundText) soundText.textContent = 'SOUND ACTIVE 🔊';
        toggleBtn.classList.add('bg-brand-gold', 'text-brand-black');
        if (video.paused) video.play().catch(() => {});
      }
      if (window.lucide) lucide.createIcons();
    });
  }
}

/* ==========================================
   7. CONTACT & INQUIRY FORM (+ WHATSAPP DIRECT SEND & GMAIL SYNC)
   ========================================== */
function initContactForm() {
  const form = document.getElementById('booking-inquiry-form');
  const successNotice = document.getElementById('form-success-message');
  const resetBtn = document.getElementById('form-reset-btn');
  const sendWhatsAppDirectBtn = document.getElementById('form-send-whatsapp-btn');
  const sendEmailDirectBtn = document.getElementById('form-send-email-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('client-name').value.trim();
    const phoneInput = document.getElementById('client-phone');
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const email = document.getElementById('client-email').value.trim();
    const projectType = document.getElementById('project-type').value;
    const budget = document.getElementById('budget-range').value;
    const date = document.getElementById('project-date').value || 'Flexible';
    const location = document.getElementById('project-location').value.trim() || 'Maharashtra';
    const details = document.getElementById('project-details').value.trim();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      Logging & Dispatching Inquiry...
    `;

    const rawPhone = localStorage.getItem('beyond_frames_whatsapp') || '919892967174';
    const targetEmail = localStorage.getItem('beyond_frames_email') || 'beyondframess10@gmail.com';
    const cleanNumber = rawPhone.replace(/[^0-9]/g, '');

    // 1. Create Inquiry Object & Save to Local CRM backup
    const newInquiry = {
      id: 'inq_' + Date.now(),
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }),
      name,
      phone,
      email,
      projectType,
      budget,
      date,
      location,
      details
    };

    try {
      let existing = JSON.parse(localStorage.getItem('beyond_frames_inquiries') || '[]');
      existing.unshift(newInquiry);
      localStorage.setItem('beyond_frames_inquiries', JSON.stringify(existing));
      updateInquiriesBadge();
    } catch (err) {
      console.warn('Inquiry backup storage error:', err);
    }

    // 2. Background Dispatch to beyondframess10@gmail.com via FormSubmit AJAX
    try {
      fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New Beyond Frames Lead: ${name} (${projectType})`,
          _template: 'table',
          _captcha: 'false',
          'Client Name / Brand': name,
          'Client Phone / WhatsApp': phone,
          'Client Email': email,
          'Project Discipline': projectType,
          'Estimated Budget': budget,
          'Estimated Shoot Date': date,
          'Location': location,
          'Vision & Deliverables': details,
          'Timestamp (IST)': newInquiry.timestamp
        })
      }).catch(e => console.log('Background email dispatch dispatched (FormSubmit):', e));
    } catch (e) {}

    // 3. Prepare Instant WhatsApp & Email Action URLs
    const plainText = 
      `New Production Inquiry for Beyond Frames\n\n` +
      `Name / Brand: ${name}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n` +
      `Project: ${projectType}\n` +
      `Budget: ${budget}\n` +
      `Date: ${date}\n` +
      `Location: ${location}\n\n` +
      `Vision & Deliverables:\n${details}`;

    const waMessage = encodeURIComponent(
      `*New Production Inquiry for Beyond Frames*\n\n` +
      `*Name / Brand:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Email:* ${email}\n` +
      `*Project:* ${projectType}\n` +
      `*Budget:* ${budget}\n` +
      `*Date:* ${date}\n` +
      `*Location:* ${location}\n\n` +
      `*Vision & Deliverables:*\n${details}`
    );
    const waUrl = `https://wa.me/${cleanNumber}?text=${waMessage}`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.classList.add('hidden');
      if (successNotice) {
        successNotice.classList.remove('hidden');
      }

      if (sendWhatsAppDirectBtn) {
        sendWhatsAppDirectBtn.href = waUrl;
      }

      if (sendEmailDirectBtn) {
        const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(`New Production Inquiry from ${name}`)}&body=${encodeURIComponent(plainText)}`;
        sendEmailDirectBtn.href = mailtoUrl;
      }

      // Automatically launch WhatsApp so the studio director receives instant lead notification
      window.open(waUrl, '_blank');

      if (window.lucide) lucide.createIcons();
    }, 700);
  });

  if (resetBtn && successNotice) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.classList.remove('hidden');
      successNotice.classList.add('hidden');
    });
  }
}

/* Inquiries Badge & List Helpers */
function updateInquiriesBadge() {
  const badge = document.getElementById('cms-inquiries-badge');
  if (!badge) return;
  try {
    const list = JSON.parse(localStorage.getItem('beyond_frames_inquiries') || '[]');
    if (list.length > 0) {
      badge.textContent = list.length;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  } catch (e) {
    badge.classList.add('hidden');
  }
}

function refreshInquiriesList() {
  const container = document.getElementById('cms-inquiries-list');
  if (!container) return;

  let list = [];
  try {
    list = JSON.parse(localStorage.getItem('beyond_frames_inquiries') || '[]');
  } catch (e) { list = []; }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-500 text-xs border border-dashed border-white/10 rounded-xl">
        <i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-600"></i>
        <p>No inquiries logged yet.</p>
        <p class="text-[10px] text-slate-600 mt-0.5">When clients fill out your booking form, their inquiries appear here automatically.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="p-3.5 rounded-xl bg-brand-dark border border-white/10 space-y-2 text-xs">
      <div class="flex items-start justify-between gap-2">
        <div>
          <span class="font-bold text-white text-sm">${escapeHtml(item.name)}</span>
          <div class="text-[10px] text-brand-gold font-mono uppercase">${escapeHtml(item.projectType || 'Production')} &bull; ${escapeHtml(item.budget || 'Flexible')}</div>
        </div>
        <span class="text-[9px] text-slate-500 font-mono">${escapeHtml(item.timestamp || '')}</span>
      </div>

      <div class="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
        <div><strong class="text-slate-400">Phone:</strong> <a href="tel:${escapeHtml(item.phone || '')}" class="text-brand-gold hover:underline">${escapeHtml(item.phone || 'N/A')}</a></div>
        <div><strong class="text-slate-400">Email:</strong> <a href="mailto:${escapeHtml(item.email || '')}" class="text-brand-gold hover:underline">${escapeHtml(item.email || 'N/A')}</a></div>
        <div><strong class="text-slate-400">Date:</strong> ${escapeHtml(item.date || 'Flexible')}</div>
        <div><strong class="text-slate-400">City:</strong> ${escapeHtml(item.location || 'Maharashtra')}</div>
      </div>

      <div class="p-2 rounded bg-black/40 border border-white/5 text-[11px] text-slate-300 italic">
        "${escapeHtml(item.details || '')}"
      </div>

      <div class="flex items-center gap-2 pt-1">
        ${item.phone ? `
          <a href="https://wa.me/${escapeHtml(item.phone.replace(/[^0-9]/g, ''))}?text=${encodeURIComponent(`Hi ${item.name}, thank you for reaching out to Beyond Frames regarding your ${item.projectType} project!`)}" target="_blank" rel="noopener" class="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all">
            <i data-lucide="message-circle" class="w-3 h-3"></i> WhatsApp Client
          </a>
        ` : ''}
        ${item.email ? `
          <a href="mailto:${escapeHtml(item.email)}?subject=${encodeURIComponent(`Beyond Frames Production Proposal: ${item.name}`)}" class="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all">
            <i data-lucide="mail" class="w-3 h-3"></i> Email Client
          </a>
        ` : ''}
        <button onclick="deleteInquiry('${item.id}')" class="ml-auto text-[10px] text-red-400 hover:text-red-300 underline">
          Delete
        </button>
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

window.deleteInquiry = function(id) {
  try {
    let list = JSON.parse(localStorage.getItem('beyond_frames_inquiries') || '[]');
    list = list.filter(item => item.id !== id);
    localStorage.setItem('beyond_frames_inquiries', JSON.stringify(list));
    refreshInquiriesList();
    updateInquiriesBadge();
  } catch (e) {}
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


/* =========================================================================
   9. BEYOND FRAMES IN-BROWSER STUDIO CMS / CUSTOMIZER
   ========================================================================= */
function initStudioManager() {
  const openCmsBtn = document.getElementById('open-studio-cms-btn');
  const closeCmsBtn = document.getElementById('close-studio-cms-btn');
  const cmsDrawer = document.getElementById('studio-cms-drawer');
  const tabBtns = document.querySelectorAll('.cms-tab-btn');
  const tabPanels = document.querySelectorAll('.cms-tab-panel');

  if (!cmsDrawer) return;

  function openCms() {
    cmsDrawer.classList.remove('hidden');
    cmsDrawer.classList.add('flex');
    document.body.style.overflow = 'hidden';
    refreshUploadedWorksList();
    refreshInquiriesList();
    updateInquiriesBadge();
    if (window.lucide) lucide.createIcons();
  }

  // Open & Close Studio Manager
  if (openCmsBtn) {
    openCmsBtn.addEventListener('click', openCms);
  }

  // Secret Owner Shortcut: Press Ctrl + Shift + A (or Cmd + Shift + A) to toggle Studio Manager
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.code === 'KeyA')) {
      e.preventDefault();
      if (cmsDrawer.classList.contains('hidden')) {
        openCms();
        showToast('Owner Access: Studio Manager Unlocked');
      } else {
        closeCms();
      }
    } else if (e.key === 'Escape' && !cmsDrawer.classList.contains('hidden')) {
      closeCms();
    }
  });

  // Secret URL Access Trigger: Add #admin or ?admin to address bar (e.g. site.com/#admin)
  function checkAdminAccess() {
    const isHashAdmin = window.location.hash.toLowerCase() === '#admin';
    const isQueryAdmin = new URLSearchParams(window.location.search).has('admin');
    if (isHashAdmin || isQueryAdmin) {
      openCms();
      showToast('Owner Access: Studio Manager Unlocked');
    }
  }

  checkAdminAccess();
  window.addEventListener('hashchange', checkAdminAccess);

  function closeCms() {
    cmsDrawer.classList.add('hidden');
    cmsDrawer.classList.remove('flex');
    document.body.style.overflow = '';
    // Clean up URL hash so #admin does not linger in address bar when closed
    if (window.location.hash.toLowerCase() === '#admin') {
      history.replaceState(null, document.title, window.location.pathname + window.location.search);
    }
  }

  if (closeCmsBtn) closeCmsBtn.addEventListener('click', closeCms);

  cmsDrawer.addEventListener('click', (e) => {
    if (e.target === cmsDrawer || e.target.classList.contains('cms-backdrop')) {
      closeCms();
    }
  });

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active', 'border-brand-gold', 'text-brand-gold'));
      tabBtns.forEach(b => b.classList.add('text-slate-400', 'border-transparent'));
      btn.classList.add('active', 'border-brand-gold', 'text-brand-gold');
      btn.classList.remove('text-slate-400', 'border-transparent');

      const target = btn.getAttribute('data-tab');
      tabPanels.forEach(panel => {
        if (panel.id === target) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
    });
  });

  /* -------------------------------------------
     CMS Feature 1: Live Logo Upload & Preview
     ------------------------------------------- */
  const logoInput = document.getElementById('cms-logo-input');
  const logoPreview = document.getElementById('cms-logo-preview');
  const resetLogoBtn = document.getElementById('cms-logo-reset');

  if (logoInput) {
    logoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        localStorage.setItem('beyond_frames_logo', dataUrl);

        // Update all logos across site live
        document.querySelectorAll('.brand-logo-img').forEach(img => {
          img.src = dataUrl;
        });
        if (logoPreview) logoPreview.src = dataUrl;
        showToast('Logo updated successfully!');
      };
      reader.readAsDataURL(file);
    });
  }

  if (resetLogoBtn) {
    resetLogoBtn.addEventListener('click', () => {
      localStorage.removeItem('beyond_frames_logo');
      const defaultLogo = 'assets/logo/beyond-frames-official-logo.jpg';
      document.querySelectorAll('.brand-logo-img').forEach(img => {
        img.src = defaultLogo;
      });
      if (logoPreview) logoPreview.src = defaultLogo;
      showToast('Beyond Frames official logo restored.');
    });
  }

  /* -------------------------------------------
     CMS Feature 2: Add Work to Portfolio
     ------------------------------------------- */
  const addWorkForm = document.getElementById('cms-add-work-form');
  const workImageInput = document.getElementById('cms-work-image');

  if (addWorkForm && workImageInput) {
    addWorkForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const file = workImageInput.files[0];
      if (!file) {
        alert('Please select an image file from your computer.');
        return;
      }

      const title = document.getElementById('cms-work-title').value.trim();
      const category = document.getElementById('cms-work-category').value;
      const gear = document.getElementById('cms-work-gear').value.trim();
      const client = document.getElementById('cms-work-client').value.trim();
      const aspect = document.getElementById('cms-work-aspect').value;

      const reader = new FileReader();
      reader.onload = (event) => {
        const newProject = {
          title,
          category,
          categoryLabel: category.toUpperCase(),
          gear: gear || 'Beyond Frames Cinema Camera Rig',
          client: client || 'Direct Studio Commission',
          aspectRatio: aspect,
          imageData: event.target.result,
          createdAt: new Date().toISOString()
        };

        const existingWorks = JSON.parse(localStorage.getItem('beyond_frames_user_works') || '[]');
        existingWorks.unshift(newProject);
        localStorage.setItem('beyond_frames_user_works', JSON.stringify(existingWorks));

        addWorkForm.reset();
        refreshUploadedWorksList();
        showToast('New project added to portfolio!');
        
        // Reload portfolio items live
        document.querySelectorAll('.user-uploaded-card').forEach(c => c.remove());
        renderCustomUploadedWorks();
        refreshPortfolioFilters();
        if (window.lucide) lucide.createIcons();
      };
      reader.readAsDataURL(file);
    });
  }

  /* -------------------------------------------
     CMS Feature 3: Contact & WhatsApp Sync
     ------------------------------------------- */
  const contactForm = document.getElementById('cms-contact-form');
  if (contactForm) {
    // Preload current settings
    const phoneInput = document.getElementById('cms-phone');
    const waInput = document.getElementById('cms-whatsapp');
    const emailInput = document.getElementById('cms-email');
    const locInput = document.getElementById('cms-location');
    const igInput = document.getElementById('cms-instagram');
    const reelInput = document.getElementById('cms-reel-url');

    if (phoneInput) phoneInput.value = localStorage.getItem('beyond_frames_phone') || '+91 98929 67174';
    if (waInput) waInput.value = localStorage.getItem('beyond_frames_whatsapp') || '919892967174';
    if (emailInput) emailInput.value = localStorage.getItem('beyond_frames_email') || 'beyondframess10@gmail.com';
    if (locInput) locInput.value = localStorage.getItem('beyond_frames_location') || 'Available All Over Maharashtra';
    if (igInput) igInput.value = localStorage.getItem('beyond_frames_instagram') || 'https://www.instagram.com/abrarphotography2010';
    if (reelInput) reelInput.value = localStorage.getItem('beyond_frames_reel_url') || 'https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&mute=0&rel=0';

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      localStorage.setItem('beyond_frames_phone', phoneInput.value.trim());
      localStorage.setItem('beyond_frames_whatsapp', waInput.value.trim());
      localStorage.setItem('beyond_frames_email', emailInput.value.trim());
      localStorage.setItem('beyond_frames_location', locInput.value.trim());
      if (igInput && igInput.value.trim()) {
        localStorage.setItem('beyond_frames_instagram', igInput.value.trim());
      }
      if (reelInput.value.trim()) {
        localStorage.setItem('beyond_frames_reel_url', reelInput.value.trim());
      }

      initStorageSync();
      showToast('Contact info, Instagram & WhatsApp links updated!');
    });
  }

  /* -------------------------------------------
     CMS Feature 4: Reset All Customizations
     ------------------------------------------- */
  const resetAllBtn = document.getElementById('cms-reset-all-btn');
  if (resetAllBtn) {
    resetAllBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all custom uploads and restore default sample data?')) {
        localStorage.removeItem('beyond_frames_logo');
        localStorage.removeItem('beyond_frames_user_works');
        localStorage.removeItem('beyond_frames_phone');
        localStorage.removeItem('beyond_frames_whatsapp');
        localStorage.removeItem('beyond_frames_email');
        localStorage.removeItem('beyond_frames_location');
        localStorage.removeItem('beyond_frames_instagram');
        localStorage.removeItem('beyond_frames_reel_url');
        location.reload();
      }
    });
  }

  /* -------------------------------------------
     CMS Feature 5: Clear Inquiries Log
     ------------------------------------------- */
  const clearInquiriesBtn = document.getElementById('cms-clear-inquiries-btn');
  if (clearInquiriesBtn) {
    clearInquiriesBtn.addEventListener('click', () => {
      if (confirm('Clear all client inquiries from your local backup log?')) {
        localStorage.removeItem('beyond_frames_inquiries');
        refreshInquiriesList();
        updateInquiriesBadge();
        showToast('Inquiry log cleared.');
      }
    });
  }
}

// Refresh list of user-uploaded works inside CMS drawer
function refreshUploadedWorksList() {
  const listContainer = document.getElementById('cms-uploaded-works-list');
  if (!listContainer) return;

  const works = JSON.parse(localStorage.getItem('beyond_frames_user_works') || '[]');
  listContainer.innerHTML = '';

  if (works.length === 0) {
    listContainer.innerHTML = `
      <div class="text-xs text-slate-500 py-3 text-center border border-dashed border-white/10 rounded-lg">
        No custom uploads yet. Add your first project above!
      </div>
    `;
    return;
  }

  works.forEach((work, index) => {
    const item = document.createElement('div');
    item.className = 'flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs';
    item.innerHTML = `
      <div class="flex items-center gap-3 truncate">
        <img src="${work.imageData}" class="w-10 h-10 rounded object-cover border border-white/10">
        <div class="truncate">
          <div class="font-bold text-white truncate">${work.title}</div>
          <div class="text-[10px] text-brand-gold uppercase">${work.category}</div>
        </div>
      </div>
      <button class="delete-work-btn text-red-400 hover:text-red-300 p-1.5 rounded transition-colors" data-index="${index}" title="Delete project">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    `;

    item.querySelector('.delete-work-btn').addEventListener('click', () => {
      const current = JSON.parse(localStorage.getItem('beyond_frames_user_works') || '[]');
      current.splice(index, 1);
      localStorage.setItem('beyond_frames_user_works', JSON.stringify(current));
      refreshUploadedWorksList();
      
      // Update grid live
      document.querySelectorAll('.user-uploaded-card').forEach(c => c.remove());
      renderCustomUploadedWorks();
      refreshPortfolioFilters();
      showToast('Project removed.');
    });

    listContainer.appendChild(item);
  });
}

// Toast notification helper
function showToast(message) {
  let toast = document.getElementById('studio-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'studio-toast';
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[100000] px-5 py-2.5 rounded-full bg-brand-gold text-brand-black text-xs font-bold uppercase tracking-wider shadow-2xl transition-all duration-300 opacity-0 pointer-events-none';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translate(-50%, -10px)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, 0)';
  }, 2500);
}

/* ==========================================
   9. HIGH-TECH CAMERA AUDIO & OPTICAL ENGINE
   ========================================== */
let cameraAudioCtx = null;
let soundFXEnabled = true;

function playShutterSound() {
  if (!soundFXEnabled) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!cameraAudioCtx) {
      cameraAudioCtx = new AudioContextClass();
    }
    if (cameraAudioCtx.state === 'suspended') {
      cameraAudioCtx.resume();
    }

    const t = cameraAudioCtx.currentTime;

    // Pulse 1: Mechanical shutter curtain trip (crisp click)
    const osc1 = cameraAudioCtx.createOscillator();
    const gain1 = cameraAudioCtx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1350, t);
    osc1.frequency.exponentialRampToValueAtTime(140, t + 0.038);
    gain1.gain.setValueAtTime(0.35, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.038);
    osc1.connect(gain1);
    gain1.connect(cameraAudioCtx.destination);
    osc1.start(t);
    osc1.stop(t + 0.038);

    // Pulse 2: Mirror box & focal plane shutter reset (snick click)
    const osc2 = cameraAudioCtx.createOscillator();
    const gain2 = cameraAudioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(750, t + 0.045);
    osc2.frequency.exponentialRampToValueAtTime(70, t + 0.095);
    gain2.gain.setValueAtTime(0.28, t + 0.045);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.095);
    osc2.connect(gain2);
    gain2.connect(cameraAudioCtx.destination);
    osc2.start(t + 0.045);
    osc2.stop(t + 0.095);
  } catch (err) {
    // Graceful fallback if audio is not permitted yet
  }
}

function triggerShutterFlash() {
  const flashEl = document.getElementById('camera-shutter-flash');
  if (flashEl) {
    flashEl.classList.add('flash-active');
    setTimeout(() => {
      flashEl.classList.remove('flash-active');
    }, 70);
  }
}

function initCameraSoundFX() {
  const soundToggle = document.getElementById('hud-sound-toggle');
  const soundStatus = document.getElementById('hud-sound-status');
  const soundIcon = document.getElementById('hud-sound-icon');

  if (soundToggle) {
    soundToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      soundFXEnabled = !soundFXEnabled;
      if (soundStatus) {
        soundStatus.textContent = soundFXEnabled ? 'SFX ON' : 'SFX MUTED';
        soundStatus.className = soundFXEnabled ? 'text-emerald-400 font-bold' : 'text-slate-500 font-bold';
      }
      if (soundIcon) {
        soundIcon.textContent = soundFXEnabled ? '🔊' : '🔇';
      }
      if (soundFXEnabled) {
        playShutterSound();
        showToast('Mechanical Shutter Sound: Enabled');
      } else {
        showToast('Mechanical Shutter Sound: Muted');
      }
    });
  }
}

/* ==========================================
   10. INTERACTIVE CINEMA LUT GRADE SWITCHER
   ========================================== */
function initCinemaLutSwitcher() {
  const lutBtns = document.querySelectorAll('.lut-btn');
  if (!lutBtns.length) return;

  const lutClasses = ['lut-gold', 'lut-cyber', 'lut-falsecolor'];

  lutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      playShutterSound();
      triggerShutterFlash();

      const selectedLut = btn.dataset.lut;
      document.body.classList.remove(...lutClasses);

      lutBtns.forEach(b => {
        b.className = 'lut-btn px-1.5 py-0.5 rounded text-[8.5px] font-mono border border-white/20 text-slate-300 hover:text-white transition-all';
      });

      btn.className = 'lut-btn px-1.5 py-0.5 rounded text-[8.5px] font-mono border border-brand-gold/40 bg-brand-gold text-black font-bold transition-all';

      if (selectedLut === 'gold') {
        document.body.classList.add('lut-gold');
        showToast('Grade Applied: Golden Cine Kodak 2383');
      } else if (selectedLut === 'cyber') {
        document.body.classList.add('lut-cyber');
        showToast('Grade Applied: Cyan Matrix / Teal & Orange');
      } else if (selectedLut === 'falsecolor') {
        document.body.classList.add('lut-falsecolor');
        showToast('Sensor Mode: False Color Exposure Map');
      } else {
        showToast('Grade Applied: Neutral REC.709');
      }
    });
  });
}

/* ==========================================
   11. OPTICAL LENS & FOV CALIBRATION LAB
   ========================================== */
function initLensSimulator() {
  const lensGroup = document.getElementById('lens-selector-group');
  if (!lensGroup) return;

  const lensBtns = lensGroup.querySelectorAll('.focal-btn');
  const previewImg = document.getElementById('lens-sim-preview');
  const hudFocal = document.getElementById('lens-sim-hud-focal');
  const hudFov = document.getElementById('lens-sim-hud-fov');
  const apertureHole = document.getElementById('lens-sim-aperture-hole');
  const specFov = document.getElementById('lens-spec-fov');
  const specAperture = document.getElementById('lens-spec-aperture');
  const specDof = document.getElementById('lens-spec-dof');
  const specApp = document.getElementById('lens-spec-app');
  const specNote = document.getElementById('lens-spec-note');

  const LENS_DATA = {
    16: {
      focalStr: '16MM T/2.0',
      fovStr: 'FOV 107.0°',
      fov: '107° Ultra-Wide',
      aperture: 'f/2.8 Ultra-Fast',
      dof: 'Deep / Infinite Horizon',
      app: 'Gimbal & Drone Landscapes',
      note: 'Optical Coating: Multi-Layer Nano Cinema Glass • Zero Breathing',
      zoom: 'scale(1)',
      blur: 'blur(0px)',
      radius: '10'
    },
    35: {
      focalStr: '35MM T/1.5',
      fovStr: 'FOV 63.4°',
      fov: '63° Standard Cine',
      aperture: 'f/1.4 Cine Prime',
      dof: 'Moderate Separation',
      app: 'Narrative Story & Street Mood',
      note: 'Anamorphic Characteristics: Gentle Oval Bokeh & Horizontal Flares',
      zoom: 'scale(1.18)',
      blur: 'blur(1px)',
      radius: '16'
    },
    50: {
      focalStr: '50MM T/1.2',
      fovStr: 'FOV 46.8°',
      fov: '47° Natural Vision',
      aperture: 'f/1.2 High-Speed',
      dof: 'Silky Soft Falloff',
      app: 'Human Emotion & Commercials',
      note: 'Zero Distortion: Exact Human Eye Geometry & Color Neutrality',
      zoom: 'scale(1.36)',
      blur: 'blur(2px)',
      radius: '22'
    },
    85: {
      focalStr: '85MM T/1.4',
      fovStr: 'FOV 28.6°',
      fov: '29° Compression',
      aperture: 'f/1.4 Portrait Master',
      dof: 'Dreamy Painterly Bokeh',
      app: 'Editorial & High-Fashion',
      note: 'Flattering Facial Compression • Ultra-Creamy Circular Iris',
      zoom: 'scale(1.58)',
      blur: 'blur(3.5px)',
      radius: '27'
    },
    135: {
      focalStr: '135MM T/1.8',
      fovStr: 'FOV 18.2°',
      fov: '18° Telephoto Beast',
      aperture: 'f/1.8 Razor Sharp',
      dof: 'Microscopic Razor Plane',
      app: 'Cinematic Drama & Close-ups',
      note: 'Extreme Perspective Squeeze • Hollywood Feature Film Standard',
      zoom: 'scale(1.88)',
      blur: 'blur(5px)',
      radius: '32'
    }
  };

  lensBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const focal = btn.dataset.focal;
      const data = LENS_DATA[focal];
      if (!data) return;

      playShutterSound();
      triggerShutterFlash();

      lensBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (hudFocal) hudFocal.textContent = data.focalStr;
      if (hudFov) hudFov.textContent = data.fovStr;
      if (specFov) specFov.textContent = data.fov;
      if (specAperture) specAperture.textContent = data.aperture;
      if (specDof) specDof.textContent = data.dof;
      if (specApp) specApp.textContent = data.app;
      if (specNote) specNote.textContent = data.note;

      if (apertureHole) {
        apertureHole.setAttribute('r', data.radius);
      }

      if (previewImg) {
        previewImg.style.transform = data.zoom;
        previewImg.style.filter = `brightness(0.92) contrast(1.08) ${data.blur}`;
      }
    });
  });
}

/* =========================================================================
   12. INTERACTIVE PRODUCTION PACKAGE & SPEC ESTIMATOR
   ========================================================================= */
function initSpecBuilder() {
  const genreGroup = document.getElementById('config-genre-group');
  const scaleGroup = document.getElementById('config-scale-group');
  const gearGroup = document.getElementById('config-gear-group');
  const delivGroup = document.getElementById('config-deliv-group');
  const locationGroup = document.getElementById('config-location-group');

  if (!genreGroup || !scaleGroup || !gearGroup || !delivGroup || !locationGroup) return;

  // Initial State
  let currentGenre = 'Brand Commercial & Corporate Film';
  let currentScale = 'Full-Day Intensive Production (8-10 Hours)';
  let selectedGear = new Set(['4K Cinema Rig', '4K Drone Aerials', 'Studio Lighting Rig', 'Wireless Mic Audio']);
  let selectedDeliv = new Set(['Full 4K Cinema Film', 'Vertical Reels Pack (3-5 Cuts)']);
  let currentLocation = 'Mumbai / Navi Mumbai / Thane';

  // Readout elements
  const manifestGenre = document.getElementById('manifest-genre');
  const manifestScale = document.getElementById('manifest-scale');
  const manifestGear = document.getElementById('manifest-gear');
  const manifestGearCount = document.getElementById('manifest-gear-count');
  const manifestDeliv = document.getElementById('manifest-deliv');
  const manifestDelivCount = document.getElementById('manifest-deliv-count');
  const manifestLocation = document.getElementById('manifest-location');
  const whatsappBtn = document.getElementById('manifest-whatsapp-btn');

  function updateManifest() {
    if (manifestGenre) manifestGenre.textContent = currentGenre;
    if (manifestScale) manifestScale.textContent = currentScale;
    
    const gearArr = Array.from(selectedGear);
    if (manifestGearCount) manifestGearCount.textContent = gearArr.length;
    if (manifestGear) manifestGear.textContent = gearArr.length > 0 ? gearArr.join(', ') : 'Standard Essential Package';

    const delivArr = Array.from(selectedDeliv);
    if (manifestDelivCount) manifestDelivCount.textContent = delivArr.length;
    if (manifestDeliv) manifestDeliv.textContent = delivArr.length > 0 ? delivArr.join(', ') : 'Standard Master Cut';

    if (manifestLocation) manifestLocation.textContent = currentLocation;

    // Generate WhatsApp link
    const waText = 
`🎬 *NEW PRODUCTION SPECIFICATION | BEYOND FRAMES*
----------------------------------------
*01. Project Discipline:* ${currentGenre}
*02. Production Schedule:* ${currentScale}
*03. Camera & Gear Setup:* ${gearArr.length > 0 ? gearArr.join(', ') : 'Standard Essential'}
*04. Deliverables Requested:* ${delivArr.length > 0 ? delivArr.join(', ') : 'Standard Master'}
*05. Shoot Location:* ${currentLocation}
----------------------------------------
Hello Abrar, I configured this project manifest on your Beyond Frames website. Please share availability and a custom quote for this production!`;

    const waUrl = `https://api.whatsapp.com/send?phone=919892967174&text=${encodeURIComponent(waText)}`;
    if (whatsappBtn) {
      whatsappBtn.href = waUrl;
    }
  }

  // Genre single-select
  genreGroup.querySelectorAll('.spec-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      genreGroup.querySelectorAll('.spec-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGenre = btn.getAttribute('data-genre') || btn.textContent.trim();
      playShutterSound();
      updateManifest();
    });
  });

  // Scale single-select
  scaleGroup.querySelectorAll('.spec-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      scaleGroup.querySelectorAll('.spec-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentScale = btn.getAttribute('data-scale') || btn.textContent.trim();
      playShutterSound();
      updateManifest();
    });
  });

  // Gear multi-select
  gearGroup.querySelectorAll('.spec-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.getAttribute('data-gear-item') || btn.textContent.trim();
      if (selectedGear.has(item)) {
        selectedGear.delete(item);
        btn.classList.remove('active');
      } else {
        selectedGear.add(item);
        btn.classList.add('active');
      }
      playShutterSound();
      updateManifest();
    });
  });

  // Deliverables multi-select
  delivGroup.querySelectorAll('.spec-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.getAttribute('data-deliv-item') || btn.textContent.trim();
      if (selectedDeliv.has(item)) {
        selectedDeliv.delete(item);
        btn.classList.remove('active');
      } else {
        selectedDeliv.add(item);
        btn.classList.add('active');
      }
      playShutterSound();
      updateManifest();
    });
  });

  // Location single-select
  locationGroup.querySelectorAll('.spec-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      locationGroup.querySelectorAll('.spec-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLocation = btn.getAttribute('data-location') || btn.textContent.trim();
      playShutterSound();
      updateManifest();
    });
  });

  // Button click trigger shutter sound & flash
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      playShutterSound();
      triggerShutterFlash();
      showToast('Transmitting Production Spec to WhatsApp...');
    });
  }

  // Initial render
  updateManifest();
}

/* ==========================================
   13. 3D HOLOGRAPHIC CARD PHYSICS & ANAMORPHIC SHEEN
   ========================================== */
function initCardTiltPhysics() {
  const cards = document.querySelectorAll('.portfolio-card');
  cards.forEach(card => {
    // Inject sheen element if missing
    if (!card.querySelector('.portfolio-card-sheen')) {
      const sheen = document.createElement('div');
      sheen.className = 'portfolio-card-sheen';
      card.appendChild(sheen);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const pctX = ((x / rect.width) - 0.5) * 2;
      const pctY = ((y / rect.height) - 0.5) * 2;

      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
      card.style.transform = `perspective(1000px) rotateX(${-pctY * 7}deg) rotateY(${pctX * 7}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================
   14. THE DIRECTOR'S CONTROL DECK & OPTICAL LOUPE
   ========================================== */
function initDirectorsConsole() {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;

  // Aspect Ratio Mode Switcher
  const aspectBtns = document.querySelectorAll('.aspect-mode-btn');
  aspectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playShutterSound();
      aspectBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const aspect = btn.getAttribute('data-aspect');
      if (aspect === 'default') {
        grid.removeAttribute('data-aspect-override');
      } else {
        grid.setAttribute('data-aspect-override', aspect);
      }
    });
  });

  // Film Stock Switcher
  const stockBtns = document.querySelectorAll('.film-stock-btn');
  stockBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playShutterSound();
      stockBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const stock = btn.getAttribute('data-stock');
      grid.setAttribute('data-film-stock', stock);
    });
  });

  // Director's 2.5x Optical Loupe Tool
  const loupeBtn = document.getElementById('toggle-loupe-tool');
  const loupe = document.getElementById('directors-loupe');
  let loupeActive = false;

  if (loupeBtn && loupe) {
    loupeBtn.addEventListener('click', () => {
      playShutterSound();
      loupeActive = !loupeActive;
      if (loupeActive) {
        loupeBtn.classList.add('bg-brand-gold', 'text-brand-black');
        loupeBtn.classList.remove('text-brand-gold');
        document.body.classList.add('loupe-mode-active');
        showToast('Director 2.5x Loupe: ACTIVE (Hover any photo)');
      } else {
        loupeBtn.classList.remove('bg-brand-gold', 'text-brand-black');
        loupeBtn.classList.add('text-brand-gold');
        loupe.classList.remove('active');
        document.body.classList.remove('loupe-mode-active');
        showToast('Director 2.5x Loupe: DEACTIVATED');
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (!loupeActive) return;
      const target = e.target.closest('.portfolio-card');
      if (target) {
        const img = target.querySelector('img');
        if (img) {
          const rect = img.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
            loupe.classList.add('active');
            loupe.style.left = `${e.clientX}px`;
            loupe.style.top = `${e.clientY}px`;
            loupe.style.backgroundImage = `url('${img.src}')`;
            loupe.style.backgroundSize = `${rect.width * 2.5}px ${rect.height * 2.5}px`;
            loupe.style.backgroundPosition = `-${x * 2.5 - 85}px -${y * 2.5 - 85}px`;
            return;
          }
        }
      }
      loupe.classList.remove('active');
    });
  }
}

/* ==========================================================================
   COMMERCIAL DAVINCI COLOR SUITE & LOOKBOOK ENGINE
   ========================================================================== */
function initCommercialColorSlider() {
  const stage = document.getElementById('color-grade-stage');
  if (!stage) return;

  const beforeImg = document.getElementById('grade-img-before');
  const afterImg = document.getElementById('grade-img-after');
  const titleEl = document.getElementById('grade-shot-title');
  const specEl = document.getElementById('grade-shot-spec');
  const lensEl = document.getElementById('grade-shot-lens');
  const isoEl = document.getElementById('grade-shot-iso');
  const shutterEl = document.getElementById('grade-shot-shutter');
  const tabs = document.querySelectorAll('.commercial-shot-tab');
  const chips = document.querySelectorAll('.palette-chip');

  let isDragging = false;

  function updateGradePosition(clientX) {
    const rect = stage.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;
    const pct = Math.max(2, Math.min(98, (x / rect.width) * 100));
    stage.style.setProperty('--grade-pos', `${pct}%`);
  }

  stage.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateGradePosition(e.clientX);
    if (typeof playShutterSound === 'function') playShutterSound();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateGradePosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch support for mobile & tablet
  stage.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      isDragging = true;
      updateGradePosition(e.touches[0].clientX);
    }
  }, { passive: true });

  stage.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches || e.touches.length === 0) return;
    updateGradePosition(e.touches[0].clientX);
  }, { passive: true });

  stage.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Hover tracking when not dragging
  stage.addEventListener('mousemove', (e) => {
    if (isDragging) return;
    updateGradePosition(e.clientX);
  });

  // Shot Switcher Tabs
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const imgSrc = tab.getAttribute('data-img');
      const title = tab.getAttribute('data-title');
      const spec = tab.getAttribute('data-spec');
      const lens = tab.getAttribute('data-lens');
      const iso = tab.getAttribute('data-iso');
      const shutter = tab.getAttribute('data-shutter');

      if (beforeImg) beforeImg.src = imgSrc;
      if (afterImg) afterImg.src = imgSrc;
      if (titleEl) titleEl.textContent = title;
      if (specEl) specEl.textContent = spec;
      if (lensEl) lensEl.textContent = lens;
      if (isoEl) isoEl.textContent = iso;
      if (shutterEl) shutterEl.textContent = shutter;

      if (typeof playShutterSound === 'function') playShutterSound();
      if (typeof showToast === 'function') showToast(`Loaded: ${title}`);
    });
  });

  // Palette Chips interaction
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const colorTitle = chip.getAttribute('title') || 'Color Swatch';
      if (typeof showToast === 'function') {
        showToast(`Palette: ${colorTitle}`);
      }
      if (typeof playShutterSound === 'function') playShutterSound();
    });
  });
}

/* ==========================================================================
   AI CREATIVE PRODUCER (CLIENT PROJECT COPILOT)
   ========================================================================== */
function initAICreativeProducer() {
  const triggerBtn = document.getElementById('ai-producer-trigger-btn');
  const drawer = document.getElementById('ai-producer-drawer');
  const minimizeBtn = document.getElementById('ai-producer-minimize');
  const chatMessages = document.getElementById('ai-chat-messages');
  const chatForm = document.getElementById('ai-chat-form');
  const chatInput = document.getElementById('ai-chat-input');
  const quickPills = document.querySelectorAll('.ai-quick-pill');

  if (!triggerBtn || !drawer || !chatForm || !chatInput || !chatMessages) return;

  function toggleDrawer(forceState) {
    const isOpen = typeof forceState === 'boolean' ? forceState : !drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.add('open');
      triggerBtn.classList.add('active');
      chatInput.focus();
      if (typeof playShutterSound === 'function') playShutterSound();
    } else {
      drawer.classList.remove('open');
      triggerBtn.classList.remove('active');
    }
  }

  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDrawer();
  });

  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDrawer(false);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggleDrawer(false);
    }
  });

  // Quick prompt pills
  quickPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const promptText = pill.getAttribute('data-prompt');
      if (promptText) {
        chatInput.value = promptText;
        chatForm.dispatchEvent(new Event('submit'));
      }
    });
  });

  function appendUserMessage(text) {
    const bubble = document.createElement('div');
    bubble.className = 'ai-msg-bubble ai-msg-user';
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'ai-typing-indicator';
    indicator.id = 'ai-typing-indicator';
    indicator.innerHTML = `
      <div class="ai-typing-dot"></div>
      <div class="ai-typing-dot"></div>
      <div class="ai-typing-dot"></div>
    `;
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return indicator;
  }

  function removeTypingIndicator() {
    const ind = document.getElementById('ai-typing-indicator');
    if (ind) ind.remove();
  }

  function appendAssistantMessage(htmlContent) {
    const bubble = document.createElement('div');
    bubble.className = 'ai-msg-bubble ai-msg-assistant';
    bubble.innerHTML = htmlContent;
    chatMessages.appendChild(bubble);
    if (window.lucide) lucide.createIcons();
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Backup inquiry in Studio Manager
  function backupAIInquiry(userQuery) {
    try {
      const inquiries = JSON.parse(localStorage.getItem('beyond_frames_inquiries') || '[]');
      inquiries.unshift({
        id: 'AI-' + Date.now(),
        name: 'AI Copilot Prospect',
        email: 'Direct Website Chat',
        phone: 'WhatsApp Ready',
        category: 'ai-copilot-brief',
        budget: 'In Consultation',
        message: userQuery,
        timestamp: new Date().toLocaleString(),
        status: 'Unread AI Lead'
      });
      localStorage.setItem('beyond_frames_inquiries', JSON.stringify(inquiries.slice(0, 50)));
      if (typeof updateInquiriesBadge === 'function') updateInquiriesBadge();
    } catch (e) {
      console.warn('AI inquiry backup warning:', e);
    }
  }

  // Intelligent Production Engine
  function generateAIResponse(query) {
    const lower = query.toLowerCase();

    // Color Grading / DaVinci Resolve Master
    if (lower.includes('color') || lower.includes('grade') || lower.includes('grading') || lower.includes('davinci') || lower.includes('lut') || lower.includes('palette')) {
      const waText = encodeURIComponent(`Hi Abrar, I'm inquiring through your AI Creative Producer regarding professional DaVinci Resolve color grading and post-production for my project: "${query}".`);
      return `
        <p>🎨 <strong>DAVINCI RESOLVE COLOR GRADING & MASTERING</strong></p>
        <p>Director Abrar grades projects in <strong>DaVinci Resolve Studio</strong> utilizing color-managed ACEScc and Wide Gamut color pipelines.</p>
        <ul>
          <li><strong>Cinema Film Emulation:</strong> Kodak 2383, Vision3 500T, and Fujifilm Eterna film print textures.</li>
          <li><strong>Skin-Tone Calibration:</strong> Precise hue isolation for natural, radiant skin tones under all lighting.</li>
          <li><strong>Commercial Delivery:</strong> 10-bit 4:2:2 ProRes master exports optimized for OTT, web, and Instagram 4K HDR.</li>
        </ul>
        <a href="https://api.whatsapp.com/send?phone=919892967174&text=${waText}" target="_blank" rel="noopener" class="ai-whatsapp-pill">
          <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
          <span>Discuss Color Grading on WhatsApp</span>
        </a>
      `;
    }
    // 1. Food / Cafe / Restaurant / Dessert / Commercial
    if (lower.includes('food') || lower.includes('cafe') || lower.includes('restaurant') || lower.includes('dessert') || lower.includes('commercial') || lower.includes('waffle') || lower.includes('kulfi') || lower.includes('hotel') || lower.includes('storefront') || lower.includes('bakery')) {
      const waText = encodeURIComponent(`Hi Abrar, I used your AI Creative Producer to plan a commercial food & brand shoot in Maharashtra. My project: "${query}". Can we discuss dates and booking?`);
      return `
        <p>🎬 <strong>COMMERCIAL BRAND PRODUCTION BRIEF</strong></p>
        <p>Based on Director Abrar’s commercial portfolio (including the <em>Golden Desserts & More</em> campaign), here is the recommended shoot blueprint:</p>
        <ul>
          <li><strong>Recommended Camera Rig:</strong> Sony A7 IV (33MP Full-Frame) + Sony FE 90mm f/2.8 Macro GM (food textures) + 24-70mm f/2.8 GM (storefront/interiors).</li>
          <li><strong>Lighting Setup:</strong> Godox LC500 RGB Tubes (rim specular highlights) + 300W Bi-color Softbox (soft appetizing top light).</li>
          <li><strong>Deliverables:</strong> 15-20 color-graded 4K master stills + 2x high-retention 9:16 vertical commercial reels for Instagram/Ads.</li>
          <li><strong>Turnaround:</strong> 48 to 72 hours with DaVinci Resolve ACES 10-bit grade.</li>
          <li><strong>Estimated Tier:</strong> Professional Tier (₹12,000 – ₹18,000 complete turnkey).</li>
        </ul>
        <a href="https://api.whatsapp.com/send?phone=919892967174&text=${waText}" target="_blank" rel="noopener" class="ai-whatsapp-pill">
          <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
          <span>Send Brief to Abrar on WhatsApp</span>
        </a>
      `;
    }

    // 2. Wedding / Reception / Engagement / Pre-wedding / Bride / Groom
    if (lower.includes('wedding') || lower.includes('reception') || lower.includes('engagement') || lower.includes('marriage') || lower.includes('pre-wedding') || lower.includes('haldi') || lower.includes('sangeet')) {
      const waText = encodeURIComponent(`Hi Abrar, I used your AI Creative Producer for wedding cinematography & photography in Maharashtra. Project details: "${query}". When can we discuss package availability?`);
      return `
        <p>💍 <strong>ROYAL WEDDING CINEMATOGRAPHY BLUEPRINT</strong></p>
        <p>For wedding celebrations across Maharashtra, Director Abrar deploys a dual-operator cinematic unit:</p>
        <ul>
          <li><strong>Camera Package:</strong> Dual-Cam Setup: Sony A7 IV (Cine A-Cam, 4K 60p slow-motion) + Canon EOS R (B-Cam Prime Portraiture).</li>
          <li><strong>Motion & Aerials:</strong> Ronin RS3 Pro Gimbals + 4K Drone Aerial Venue Establishing Coverage.</li>
          <li><strong>Lighting & Audio:</strong> Dual Porta continuous floodlights + wireless lavalier audio for vows & rituals.</li>
          <li><strong>Deliverables:</strong> 1x Cinematic Teaser Reel (60-90s) + 1x Full-Length Feature Master Film + 40+ retouched royal portraits.</li>
          <li><strong>Pricing:</strong> Basic starts at ₹8,000 | Professional at ₹15,000 | Multi-day Turnkey on custom quote.</li>
        </ul>
        <a href="https://api.whatsapp.com/send?phone=919892967174&text=${waText}" target="_blank" rel="noopener" class="ai-whatsapp-pill">
          <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
          <span>Book Wedding Shoot on WhatsApp</span>
        </a>
      `;
    }

    // 3. Video Editing / Post-Production / Reels
    if (lower.includes('edit') || lower.includes('reel') || lower.includes('color grade') || lower.includes('davinci') || lower.includes('post') || lower.includes('cut') || lower.includes('showreel')) {
      const waText = encodeURIComponent(`Hi Abrar, I saw your commercial video editing portfolio and want to hire you for video editing. Project notes: "${query}".`);
      return `
        <p>✂️ <strong>COMMERCIAL VIDEO EDITING & COLOR GRADING</strong></p>
        <p>Beyond Frames specializes in high-velocity, high-retention video sculpting engineered for social algorithms and broadcast standards:</p>
        <ul>
          <li><strong>Format:</strong> 9:16 Vertical (Reels / Shorts / TikTok / Ads) & 16:9 4K Cinema DCI.</li>
          <li><strong>Hook & Pacing:</strong> Kinetic match-cuts, micro-zooms, dynamic sound design, and sub-bass audio risers.</li>
          <li><strong>Color Finishing:</strong> DaVinci Resolve ACES pipeline with customized film grain and specular contrast curves.</li>
          <li><strong>Turnaround:</strong> Express 24-48 hours.</li>
          <li><strong>Pricing:</strong> Starting from ₹2,500 – ₹5,000 per commercial reel depending on duration.</li>
        </ul>
        <a href="https://api.whatsapp.com/send?phone=919892967174&text=${waText}" target="_blank" rel="noopener" class="ai-whatsapp-pill">
          <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
          <span>Discuss Video Editing with Abrar</span>
        </a>
      `;
    }

    // 4. Cinema Gear / Camera / Lenses / Lights
    if (lower.includes('gear') || lower.includes('camera') || lower.includes('lens') || lower.includes('sony') || lower.includes('canon') || lower.includes('rig') || lower.includes('drone') || lower.includes('light')) {
      return `
        <p>🎥 <strong>BEYOND FRAMES CINEMA ARSENAL</strong></p>
        <p>Director Abrar works exclusively with certified cinema and commercial production gear:</p>
        <ul>
          <li><strong>Bodies:</strong> Sony A7 Mark IV (33MP Full-Frame, 4K 60p 10-bit 4:2:2, S-Cinetone/S-Log3) & Canon EOS R Series & iPhone 16 Pro Max 4K ProRes Log.</li>
          <li><strong>Optics:</strong> Sony FE 24-70mm f/2.8 G-Master, Sony FE 90mm f/2.8 Macro GM, Canon EF/RF 35mm f/1.4 L.</li>
          <li><strong>Stabilization:</strong> Ronin RS3 Pro Gimbals, motorized sliders, and fluid-head video tripods.</li>
          <li><strong>Lighting:</strong> High-output Porta continuous lights, Godox LC500 RGB light batons, diffused softboxes.</li>
          <li><strong>Monitoring & Audio:</strong> 4K calibrated external monitors, wireless mic transmitters, and DaVinci grading control panels.</li>
        </ul>
        <p class="text-xs text-slate-400 mt-2">All equipment is owned and operated directly by Director Abrar with full on-set redundancy.</p>
      `;
    }

    // 5. Pricing / Cost / Budget / Packages / Travel / Locations
    if (lower.includes('price') || lower.includes('cost') || lower.includes('package') || lower.includes('budget') || lower.includes('travel') || lower.includes('pune') || lower.includes('mumbai') || lower.includes('maharashtra') || lower.includes('nashik') || lower.includes('rate')) {
      const waText = encodeURIComponent(`Hi Abrar, I would like to get a direct quote for a shoot in Maharashtra. My project: "${query}".`);
      return `
        <p>💰 <strong>PACKAGES & COVERAGE IN MAHARASHTRA</strong></p>
        <p>Transparent pricing tailored to production scale:</p>
        <ul>
          <li><strong>Basic Package (Starts from ₹8,000):</strong> Canon R Series, iPhone 16 Pro Max Gimbal, Porta light, Godox LC500, full event coverage, 1 graded master video.</li>
          <li><strong>Professional Package (Starts from ₹15,000):</strong> Sony A7 IV + Canon R dual-cam, dual gimbals, dual Porta lights + LC500, 3 master deliverables.</li>
          <li><strong>Custom Package (Custom Quote):</strong> Turnkey multi-day, multi-operator, 4K drone aerials, raw archives.</li>
          <li><strong>Travel:</strong> Available all across Maharashtra (Mumbai, Pune, Nashik, Chhatrapati Sambhajinagar, Kolhapur, Nagpur, etc.). Travel billed transparently at actuals.</li>
        </ul>
        <a href="https://api.whatsapp.com/send?phone=919892967174&text=${waText}" target="_blank" rel="noopener" class="ai-whatsapp-pill">
          <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
          <span>Inquire for Custom Quote</span>
        </a>
      `;
    }

    // 6. Generic / Custom Creative Idea
    const waText = encodeURIComponent(`Hi Abrar, I used your AI Creative Producer to formulate this shoot concept: "${query}". Let's discuss bringing this vision to life.`);
    return `
      <p>💡 <strong>DIRECTOR'S PRODUCTION RECOMMENDATION</strong></p>
      <p>Thank you for sharing your concept: <em>"${escapeHtml(query)}"</em>.</p>
      <p>Here is Director Abrar’s recommended approach:</p>
      <ul>
        <li><strong>Creative Direction:</strong> Cinematic pacing with deliberate lighting contrast, focusing on genuine human emotion and brand value.</li>
        <li><strong>Suggested Equipment:</strong> Sony A7 Mark IV Full-Frame with prime optics for shallow depth-of-field and organic bokeh.</li>
        <li><strong>Post-Production:</strong> 10-bit DaVinci Resolve color master with custom film stock emulation.</li>
      </ul>
      <p class="text-xs text-slate-300 mt-2">To lock in production dates or receive an exact itemized quotation, connect directly with Director Abrar below:</p>
      <a href="https://api.whatsapp.com/send?phone=919892967174&text=${waText}" target="_blank" rel="noopener" class="ai-whatsapp-pill">
        <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
        <span>Send This Concept on WhatsApp</span>
      </a>
    `;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = chatInput.value.trim();
    if (!query) return;

    appendUserMessage(query);
    backupAIInquiry(query);
    chatInput.value = '';

    const typingEl = showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      const responseHtml = generateAIResponse(query);
      appendAssistantMessage(responseHtml);
      if (typeof playShutterSound === 'function') playShutterSound();
    }, 450);
  });
}
