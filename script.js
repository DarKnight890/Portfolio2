

class PortfolioManager {
    constructor() {
        this.settings = {
            theme: localStorage.getItem('theme') || 'dark',
            fontSize: parseInt(localStorage.getItem('fontSize')) || 16,
            enableAnimations: localStorage.getItem('enableAnimations') !== 'false',
            reducedMotion: localStorage.getItem('reducedMotion') === 'true',
            highContrast: localStorage.getItem('highContrast') === 'true',
            screenReader: localStorage.getItem('screenReader') === 'true',
            analytics: localStorage.getItem('analytics') !== 'false',
            cookies: localStorage.getItem('cookies') !== 'false',
            language: localStorage.getItem('language') || 'en',
            pageWidth: localStorage.getItem('pageWidth') || 'container'
        };
        
        this.elements = {};
        this.isMobile = this.detectMobile();
        this.isAndroid = this.detectAndroid();
        this.init();
    }

    // ============ MOBILE/ANDROID DETECTION ============
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768) ||
               ('ontouchstart' in window);
    }

    detectAndroid() {
        return /Android/i.test(navigator.userAgent);
    }

    // ============ INITIALIZATION ============
    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.applySettings();
        this.initializeAnimations();
        this.initializeScrollEffects();
        this.initializeMobileOptimizations();
        console.log('🚀 Portfolio initialized successfully!');
        console.log(`📱 Mobile: ${this.isMobile}, Android: ${this.isAndroid}`);
    }

    // ============ MOBILE OPTIMIZATIONS ============
    initializeMobileOptimizations() {
        if (this.isMobile) {
            this.setupTouchOptimizations();
            this.setupMobileViewport();
            this.optimizePerformance();
        }

        if (this.isAndroid) {
            this.setupAndroidSpecific();
        }

        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });

        // Handle viewport changes (Android keyboard)
        window.addEventListener('resize', this.debounce(() => {
            this.handleViewportChange();
        }, 250));
    }

    setupTouchOptimizations() {
        // Improve touch responsiveness
        document.body.style.touchAction = 'manipulation';
        
        // Add touch feedback
        const touchElements = document.querySelectorAll('.settings-btn, .nav-link, .font-btn, .checkbox-label, .expand-btn');
        touchElements.forEach(el => {
            el.addEventListener('touchstart', (e) => {
                el.style.transform = 'scale(0.95)';
                el.style.opacity = '0.8';
            }, { passive: true });
            
            el.addEventListener('touchend', (e) => {
                setTimeout(() => {
                    el.style.transform = '';
                    el.style.opacity = '';
                }, 150);
            }, { passive: true });
        });
    }

    setupMobileViewport() {
        // Fix viewport height issues on mobile
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', () => {
            setTimeout(setVH, 100);
        });
    }

    setupAndroidSpecific() {
        // Android-specific optimizations
        document.body.classList.add('android-device');
        
        // Improve scrolling on Android
        document.body.style.overscrollBehavior = 'contain';
        
        // Fix Android Chrome address bar height changes
        if (/Chrome/i.test(navigator.userAgent) && this.isAndroid) {
            document.body.classList.add('android-chrome');
        }
    }

    optimizePerformance() {
        // Reduce animations on mobile for better performance
        if (this.isMobile && !this.settings.enableAnimations) {
            document.body.classList.add('reduced-motion');
        }
        
        // Use passive event listeners for better scroll performance
        const scrollHandler = this.debounce((e) => {
            this.handleScroll(e);
        }, 16); // 60fps
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    handleOrientationChange() {
        // Handle orientation changes
        const orientation = window.orientation || 0;
        document.body.classList.remove('portrait', 'landscape');
        document.body.classList.add(Math.abs(orientation) === 90 ? 'landscape' : 'portrait');
        
        // Close settings panel on orientation change
        if (this.elements.settingsPanel?.classList.contains('active')) {
            this.toggleSettingsPanel(false);
        }
        
        // Recalculate viewport
        this.setupMobileViewport();
    }

    handleViewportChange() {
        // Handle Android keyboard showing/hiding
        if (this.isAndroid) {
            const currentHeight = window.innerHeight;
            const fullHeight = screen.height;
            
            if (currentHeight < fullHeight * 0.75) {
                document.body.classList.add('keyboard-visible');
            } else {
                document.body.classList.remove('keyboard-visible');
            }
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    cacheElements() {
        this.elements = {
            // Settings
            settingsBtn: document.getElementById('settingsBtn'),
            settingsPanel: document.getElementById('settingsPanel'),
            closeSettings: document.getElementById('closeSettings'),
            
            // Theme
            themeSwitch: document.getElementById('checkbox'),
            
            // Font
            decreaseFont: document.getElementById('decreaseFont'),
            increaseFont: document.getElementById('increaseFont'),
            currentSize: document.getElementById('currentSize'),
            
            // Settings checkboxes
            enableAnimations: document.getElementById('enableAnimations'),
            reducedMotion: document.getElementById('reducedMotion'),
            highContrast: document.getElementById('highContrast'),
            screenReader: document.getElementById('screenReader'),
            analytics: document.getElementById('analytics'),
            cookies: document.getElementById('cookies'),
            
            // Selects
            languageSelect: document.getElementById('languageSelect'),
            pageWidth: document.getElementById('pageWidth'),
            
            // Badges
            animationBadge: document.getElementById('animationBadge'),
            accessibilityBadge: document.getElementById('accessibilityBadge'),
            privacyBadge: document.getElementById('privacyBadge'),
            
            // Navigation
            navLinks: document.querySelectorAll('.nav-link'),
            
            // Sections
            contentSections: document.querySelectorAll('.content-section'),
            allSections: document.querySelectorAll('main section'),
            
            // Logo
            logoContainer: document.querySelector('.logo-container'),
            logo: document.querySelector('.logo'),
            firstName: document.querySelector('.first-name'),
            lastName: document.querySelector('.last-name'),
            statement: document.querySelector('.statement')
        };
    }

    // ============ EVENT LISTENERS ============
    setupEventListeners() {
        this.setupSettingsPanel();
        this.setupThemeToggle();
        this.setupFontControls();
        this.setupSettingsControls();
        this.setupNavigation();
        this.setupLogoEffects();
    }

    setupSettingsPanel() {
        // Settings panel toggle
        this.elements.settingsBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSettingsPanel(true);
            this.addCoolClickEffect(e.target);
        });

        this.elements.closeSettings?.addEventListener('click', () => {
            this.toggleSettingsPanel(false);
        });

        // Setup expandable sections
        this.setupExpandableSections();

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.elements.settingsPanel && 
                !this.elements.settingsPanel.contains(e.target) && 
                !this.elements.settingsBtn.contains(e.target) && 
                this.elements.settingsPanel.classList.contains('active')) {
                this.toggleSettingsPanel(false);
            }
        });

        // Prevent panel close on internal clicks
        this.elements.settingsPanel?.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    setupExpandableSections() {
        const expandableSections = document.querySelectorAll('.settings-item.expandable');
        
        expandableSections.forEach(section => {
            const expandBtn = section.querySelector('.expand-btn');
            
            expandBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Close other expanded sections
                expandableSections.forEach(otherSection => {
                    if (otherSection !== section) {
                        otherSection.classList.remove('expanded');
                    }
                });
                
                // Toggle current section
                section.classList.toggle('expanded');
                
                // Add cool click effect
                this.addCoolClickEffect(expandBtn);
            });
        });
    }

    setupThemeToggle() {
        this.elements.themeSwitch?.addEventListener('change', () => {
            this.settings.theme = this.elements.themeSwitch.checked ? 'light' : 'dark';
            this.applyTheme();
            this.saveSettings();
            this.addSwitchEffect(this.elements.themeSwitch);
        });
    }

    setupFontControls() {
        this.elements.decreaseFont?.addEventListener('click', () => {
            if (this.settings.fontSize > 12) {
                this.settings.fontSize -= 2;
                this.applyFontSize();
                this.saveSettings();
                this.addButtonPulse(this.elements.decreaseFont);
            }
        });

        this.elements.increaseFont?.addEventListener('click', () => {
            if (this.settings.fontSize < 24) {
                this.settings.fontSize += 2;
                this.applyFontSize();
                this.saveSettings();
                this.addButtonPulse(this.elements.increaseFont);
            }
        });
    }

    setupSettingsControls() {
        // Animation settings
        this.elements.enableAnimations?.addEventListener('change', () => {
            this.settings.enableAnimations = this.elements.enableAnimations.checked;
            this.applyAnimationSettings();
            this.updateBadgeCount('animation');
            this.saveSettings();
        });

        this.elements.reducedMotion?.addEventListener('change', () => {
            this.settings.reducedMotion = this.elements.reducedMotion.checked;
            this.applyAnimationSettings();
            this.updateBadgeCount('animation');
            this.saveSettings();
        });

        // Accessibility settings
        this.elements.highContrast?.addEventListener('change', () => {
            this.settings.highContrast = this.elements.highContrast.checked;
            this.applyAccessibilitySettings();
            this.updateBadgeCount('accessibility');
            this.saveSettings();
        });

        this.elements.screenReader?.addEventListener('change', () => {
            this.settings.screenReader = this.elements.screenReader.checked;
            this.applyAccessibilitySettings();
            this.updateBadgeCount('accessibility');
            this.saveSettings();
        });

        // Privacy settings
        this.elements.analytics?.addEventListener('change', () => {
            this.settings.analytics = this.elements.analytics.checked;
            this.updateBadgeCount('privacy');
            this.saveSettings();
            console.log('Analytics:', this.settings.analytics ? 'enabled' : 'disabled');
        });

        this.elements.cookies?.addEventListener('change', () => {
            this.settings.cookies = this.elements.cookies.checked;
            this.updateBadgeCount('privacy');
            this.saveSettings();
            console.log('Cookies:', this.settings.cookies ? 'enabled' : 'disabled');
        });

        // Language and display
        this.elements.languageSelect?.addEventListener('change', () => {
            this.settings.language = this.elements.languageSelect.value;
            this.saveSettings();
            console.log('Language changed to:', this.settings.language);
        });

        this.elements.pageWidth?.addEventListener('change', () => {
            this.settings.pageWidth = this.elements.pageWidth.value;
            this.applyPageWidth();
            this.saveSettings();
        });
    }

    setupNavigation() {
        this.elements.navLinks.forEach(link => {
            // Smooth scrolling
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    this.addNavClickEffect(link);
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });

            // Hover effects
            link.addEventListener('mouseenter', () => {
                this.addNavHoverEffect(link);
            });
        });
    }

    setupLogoEffects() {
        if (this.elements.logoContainer) {
            this.elements.logoContainer.addEventListener('click', () => {
                this.addLogoClickEffect();
            });
            
            // Remove JavaScript hover effects - let CSS handle the hover animation
            // CSS :hover pseudo-class is more reliable and smoother
        }
    }

    // ============ SETTINGS APPLICATION ============
    applySettings() {
        this.applyTheme();
        this.applyFontSize();
        this.applyAnimationSettings();
        this.applyAccessibilitySettings();
        this.applyPageWidth();
        this.updateAllBadges();
        this.syncSettingsUI();
    }

    applyTheme() {
        document.body.classList.toggle('light-mode', this.settings.theme === 'light');
    }

    applyFontSize() {
        document.documentElement.style.fontSize = `${this.settings.fontSize}px`;
        if (this.elements.currentSize) {
            this.elements.currentSize.textContent = `${this.settings.fontSize}px`;
        }
    }

    applyAnimationSettings() {
        const speed = this.settings.enableAnimations ? '1' : '0';
        document.body.style.setProperty('--animation-speed', speed);
        document.body.classList.toggle('reduced-motion', this.settings.reducedMotion);
    }

    applyAccessibilitySettings() {
        document.body.classList.toggle('high-contrast', this.settings.highContrast);
        document.body.classList.toggle('screen-reader-optimized', this.settings.screenReader);
    }

    applyPageWidth() {
        document.body.className = document.body.className.replace(/width-\w+/g, '');
        document.body.classList.add(`width-${this.settings.pageWidth}`);
    }

    syncSettingsUI() {
        if (this.elements.themeSwitch) {
            this.elements.themeSwitch.checked = this.settings.theme === 'light';
        }
        if (this.elements.enableAnimations) {
            this.elements.enableAnimations.checked = this.settings.enableAnimations;
        }
        if (this.elements.reducedMotion) {
            this.elements.reducedMotion.checked = this.settings.reducedMotion;
        }
        if (this.elements.highContrast) {
            this.elements.highContrast.checked = this.settings.highContrast;
        }
        if (this.elements.screenReader) {
            this.elements.screenReader.checked = this.settings.screenReader;
        }
        if (this.elements.analytics) {
            this.elements.analytics.checked = this.settings.analytics;
        }
        if (this.elements.cookies) {
            this.elements.cookies.checked = this.settings.cookies;
        }
        if (this.elements.languageSelect) {
            this.elements.languageSelect.value = this.settings.language;
        }
        if (this.elements.pageWidth) {
            this.elements.pageWidth.value = this.settings.pageWidth;
        }
    }

    // ============ ANIMATIONS & EFFECTS ============
    initializeAnimations() {
        // Initialize scroll-triggered animations
        this.setupScrollObserver();
        
        // Add entrance animations to elements
        this.addEntranceAnimations();
    }

    setupScrollObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.addScrollRevealEffect(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.contentSections.forEach(section => {
            observer.observe(section);
        });
    }

    initializeScrollEffects() {
        // Navigation visibility based on sections
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.id;
                    this.updateNavigationVisibility(activeId);
                }
            });
        }, {
            threshold: 0.5
        });

        this.elements.allSections.forEach(section => {
            navObserver.observe(section);
        });
    }

    // ============ COOL EFFECTS ============
    addCoolClickEffect(element) {
        if (!element) return;
        
        element.style.transform = 'scale(0.95) rotate(10deg)';
        element.style.transition = 'all 0.1s ease';
        
        setTimeout(() => {
            element.style.transform = 'scale(1.05) rotate(-5deg)';
            setTimeout(() => {
                element.style.transform = '';
            }, 150);
        }, 100);
    }

    addButtonPulse(button) {
        if (!button) return;
        
        button.style.animation = 'pulse 0.3s ease';
        setTimeout(() => {
            button.style.animation = '';
        }, 300);
    }

    addSwitchEffect(switchElement) {
        const slider = switchElement.parentElement.querySelector('.slider');
        if (slider) {
            slider.style.transform = 'scale(1.1)';
            setTimeout(() => {
                slider.style.transform = '';
            }, 200);
        }
    }

    addNavHoverEffect(navLink) {
        navLink.style.transform = 'translateX(-15px) scale(1.05)';
    }

    addNavClickEffect(navLink) {
        navLink.style.transform = 'translateX(-5px) scale(0.98)';
        navLink.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        
        setTimeout(() => {
            navLink.style.transform = '';
            navLink.style.background = '';
        }, 200);
    }

    addLogoClickEffect() {
        if (this.elements.logo) {
            this.elements.logo.style.animation = 'epicEntrance 2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            setTimeout(() => {
                this.elements.logo.style.animation = '';
            }, 2000);
        }
    }

    addScrollRevealEffect(element) {
        element.style.animation = 'slideInUp 0.6s ease-out';
    }

    addEntranceAnimations() {
        // Add staggered animations to settings items
        document.querySelectorAll('.settings-item').forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.style.animation = 'slideInLeft 0.5s ease-out forwards';
        });

        // Add animations to nav links
        this.elements.navLinks.forEach((link, index) => {
            link.style.animationDelay = `${index * 0.2}s`;
            link.style.animation = 'slideInRight 0.5s ease-out forwards';
        });
    }

    // ============ UTILITY FUNCTIONS ============
    toggleSettingsPanel(show) {
        if (this.elements.settingsPanel) {
            this.elements.settingsPanel.classList.toggle('active', show);
        }
    }

    updateNavigationVisibility(activeId) {
        this.elements.navLinks.forEach(link => {
            const linkHref = link.getAttribute('href').substring(1);
            if (linkHref === activeId) {
                link.style.opacity = '0.5';
                link.style.pointerEvents = 'none';
            } else {
                link.style.opacity = '1';
                link.style.pointerEvents = 'auto';
            }
        });
    }

    updateBadgeCount(section) {
        const badge = this.elements[`${section}Badge`];
        if (!badge) return;
        
        let count = 0;
        
        switch (section) {
            case 'animation':
                if (this.settings.enableAnimations) count++;
                if (this.settings.reducedMotion) count++;
                break;
            case 'accessibility':
                if (this.settings.highContrast) count++;
                if (this.settings.screenReader) count++;
                break;
            case 'privacy':
                if (this.settings.analytics) count++;
                if (this.settings.cookies) count++;
                break;
        }
        
        badge.textContent = count;
        badge.style.display = count > 0 ? 'block' : 'none';
        
        if (count > 0) {
            badge.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                badge.style.animation = 'pulse 2s infinite';
            }, 500);
        }
    }

    updateAllBadges() {
        this.updateBadgeCount('animation');
        this.updateBadgeCount('accessibility');
        this.updateBadgeCount('privacy');
    }

    saveSettings() {
        Object.keys(this.settings).forEach(key => {
            localStorage.setItem(key, this.settings[key]);
        });
    }
}

// ============ ADDITIONAL ANIMATIONS ============
// Add slideInUp animation for scroll reveals
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ============ INITIALIZE ON DOM READY ============
document.addEventListener('DOMContentLoaded', () => {
    // Create global portfolio manager instance
    window.portfolio = new PortfolioManager();
});

// ============ ADDITIONAL INTERACTIVE FEATURES ============
document.addEventListener('DOMContentLoaded', () => {
    // Add particle cursor effect
    addParticleCursor();
    
    // Add smooth scroll to top on logo click
    document.querySelector('.logo-container')?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.portfolio?.toggleSettingsPanel(false);
        }
    });
});

function addParticleCursor() {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    document.addEventListener('click', (e) => {
        createClickParticles(e.clientX, e.clientY);
    });
}

function createClickParticles(x, y) {
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            animation: particleExplosion 0.6s ease-out forwards;
        `;
        
        particle.style.setProperty('--angle', `${i * 60}deg`);
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 600);
    }
}

// Add particle explosion animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleExplosion {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(30px) scale(0);
        }
    }
`;
document.head.appendChild(particleStyle);
