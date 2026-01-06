// Mobile menu toggle functionality
(function() {
    'use strict';

    // Clone sidebar content from desktop to mobile drawer
    function cloneSidebarContent() {
        // Clone navigation
        const mainNavList = document.getElementById('main-nav-list');
        const drawerNavList = document.querySelector('.drawer-nav-list');
        
        if (mainNavList && drawerNavList) {
            // Clear existing content
            drawerNavList.innerHTML = '';
            // Clone the navigation list
            const clonedNav = mainNavList.cloneNode(true);
            clonedNav.id = ''; // Remove ID from clone
            drawerNavList.appendChild(clonedNav);
        }

        // Clone branding
        const mainBranding = document.getElementById('main-sidebar-branding');
        const drawerBranding = document.querySelector('.drawer-branding');
        
        if (mainBranding && drawerBranding) {
            // Clear existing content
            drawerBranding.innerHTML = '';
            // Clone the branding
            const clonedBranding = mainBranding.cloneNode(true);
            clonedBranding.id = ''; // Remove ID from clone
            drawerBranding.appendChild(clonedBranding);
        }

        // Clone footer
        const mainFooter = document.getElementById('main-sidebar-footer');
        const drawerFooter = document.querySelector('.drawer-footer');
        
        if (mainFooter && drawerFooter) {
            // Clear existing content
            drawerFooter.innerHTML = '';
            // Clone the footer
            const clonedFooter = mainFooter.cloneNode(true);
            clonedFooter.id = ''; // Remove ID from clone
            drawerFooter.appendChild(clonedFooter);
        }
    }

    // Clone sidebar content on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            cloneSidebarContent();
            initializeNavigation();
        });
    } else {
        cloneSidebarContent();
        initializeNavigation();
    }

    // Create overlay element
    function createOverlay() {
        const overlayEl = document.createElement('div');
        overlayEl.className = 'overlay';
        overlayEl.setAttribute('role', 'presentation');
        overlayEl.setAttribute('aria-hidden', 'true');
        document.body.appendChild(overlayEl);
        return overlayEl;
    }

    function initializeNavigation() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileDrawer = document.querySelector('.mobile-drawer');
        const navLinks = document.querySelectorAll('.nav-link');
        const overlay = createOverlay();
        
        setupNavigation(mobileMenuToggle, mobileDrawer, navLinks, overlay);
    }

    function setupNavigation(mobileMenuToggle, mobileDrawer, navLinks, overlay) {
        // Toggle mobile menu
        function toggleMobileMenu() {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            const newState = !isExpanded;

            mobileMenuToggle.setAttribute('aria-expanded', String(newState));
            mobileDrawer.classList.toggle('open', newState);
            overlay.classList.toggle('active', newState);
            overlay.setAttribute('aria-hidden', String(!newState));

            // Prevent body scroll when menu is open
            document.body.style.overflow = newState ? 'hidden' : '';
        }

        // Close mobile menu
        function closeMobileMenu() {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileDrawer.classList.remove('open');
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        // Handle mobile menu toggle click
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }

        // Close menu when overlay is clicked
        overlay.addEventListener('click', closeMobileMenu);

        // Close menu when nav link is clicked (mobile and tablet)
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 1024) {
                    closeMobileMenu();
                }
            });
        });

        // Close menu when logo is clicked (mobile and tablet)
        const logoLinks = document.querySelectorAll('.logo-link');
        logoLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 1024) {
                    closeMobileMenu();
                }
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
                closeMobileMenu();
            }
        });

        // Hash-based navigation and active state management
        function updateActiveNavLink() {
            const hash = window.location.hash || '';
            const targetId = hash.substring(1);

            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (hash && href === hash) {
                    link.classList.add('active');
                } else if (!hash && href === '#hero') {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Scroll to section with offset for mobile header
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const headerOffset = window.innerWidth < 1024 ? 60 : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }

        // Update active nav link on hash change
        window.addEventListener('hashchange', updateActiveNavLink);

        // Update active nav link on page load
        window.addEventListener('load', function() {
            updateActiveNavLink();
            // Also check scroll position on load to set correct initial state
            updateActiveNavOnScroll();
        });

        // Update active nav link based on scroll position
        function updateActiveNavOnScroll() {
            const sections = document.querySelectorAll('#voice, #lifecycle');
            const headerOffset = window.innerWidth < 1024 ? 100 : 150;
            let currentSection = '';

            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                if (sectionTop <= headerOffset) {
                    currentSection = section.getAttribute('id');
                }
            });

            if (currentSection) {
                const targetHash = '#' + currentSection;
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === targetHash) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                // Update URL hash without scrolling
                if (window.location.hash !== targetHash) {
                    history.replaceState(null, null, targetHash);
                }
            } else if (window.scrollY < 200) {
                // If near top, set hero as active
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === '#hero') {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
                if (window.location.hash && window.location.hash !== '#hero') {
                    history.replaceState(null, null, window.location.pathname);
                }
            }
        }

        // Throttle scroll event for performance
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(updateActiveNavOnScroll, 100);
        });

        // Handle window resize - close mobile menu if switching to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 1024 && mobileDrawer.classList.contains('open')) {
                closeMobileMenu();
            }
        });
    }

    // Tab and Pill Switching Functionality
    // Alumni/ECUAA Tab Switching
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    function switchTab(targetTab) {
        // Update tab buttons
        tabButtons.forEach(btn => {
            const isActive = btn.getAttribute('data-tab') === targetTab;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', String(isActive));
        });
        
        // Update filter pills visibility
        const alumniPills = document.querySelector('.filter-pills-alumni');
        const ecuaaPills = document.querySelector('.filter-pills-ecuaa');
        if (targetTab === 'alumni') {
            if (alumniPills) alumniPills.classList.add('active');
            if (ecuaaPills) ecuaaPills.classList.remove('active');
        } else {
            if (alumniPills) alumniPills.classList.remove('active');
            if (ecuaaPills) ecuaaPills.classList.add('active');
        }
        
        // Update tab panels
        tabPanels.forEach(panel => {
            panel.classList.remove('active');
        });
        const targetPanel = document.querySelector(`.tab-panel[data-panel="${targetTab}"]`);
        if (targetPanel) {
            targetPanel.classList.add('active');
            // Activate first category panel in the new tab
            const firstCategoryPanel = targetTab === 'alumni' 
                ? targetPanel.querySelector('.category-panel[data-category-panel*="solicitation"]')
                : targetPanel.querySelector('.category-panel[data-category-panel*="operational"]');
            if (firstCategoryPanel) {
                // Remove active from all category panels in this tab
                targetPanel.querySelectorAll('.category-panel').forEach(panel => {
                    panel.classList.remove('active');
                });
                // Activate first one
                firstCategoryPanel.classList.add('active');
                
                // Update pills - activate first pill for the active tab
                const activePillsContainer = targetTab === 'alumni' ? alumniPills : ecuaaPills;
                if (activePillsContainer) {
                    const pills = activePillsContainer.querySelectorAll('.pill');
                    pills.forEach(pill => {
                        pill.classList.remove('active');
                        pill.setAttribute('aria-pressed', 'false');
                    });
                    const firstCategory = targetTab === 'alumni' ? 'solicitation' : 'operational';
                    const firstPill = activePillsContainer.querySelector(`.pill[data-category="${firstCategory}"]`);
                    if (firstPill) {
                        firstPill.classList.add('active');
                        firstPill.setAttribute('aria-pressed', 'true');
                    }
                }
            }
        }
    }
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // Category Pill Switching
    const pills = document.querySelectorAll('.pill');
    
    pills.forEach(pill => {
        pill.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const activeTab = document.querySelector('.tab-button.active');
            const tabName = activeTab ? activeTab.getAttribute('data-tab') : 'alumni';
            
            // Get the active pills container for the current tab
            const activePillsContainer = tabName === 'alumni' 
                ? document.querySelector('.filter-pills-alumni')
                : document.querySelector('.filter-pills-ecuaa');
            
            // Update pills in the active container only
            if (activePillsContainer) {
                const activePills = activePillsContainer.querySelectorAll('.pill');
                activePills.forEach(p => {
                    p.classList.remove('active');
                    p.setAttribute('aria-pressed', 'false');
                });
            }
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            // Update category panels
            const activePanel = document.querySelector(`.tab-panel[data-panel="${tabName}"]`);
            if (activePanel) {
                activePanel.querySelectorAll('.category-panel').forEach(panel => {
                    panel.classList.remove('active');
                });
                const targetCategoryPanel = activePanel.querySelector(`.category-panel[data-category-panel="${tabName}-${category}"]`);
                if (targetCategoryPanel) {
                    targetCategoryPanel.classList.add('active');
                }
            }
        });
    });

    // Initialize default states on page load
    window.addEventListener('DOMContentLoaded', function() {
        // Set default tab to alumni (first tab)
        switchTab('alumni');
        
        // Ensure first lifecycle stage (student) is active (should already be in HTML)
        const defaultStagePanel = document.querySelector('.stage-panel[data-stage-panel="student"]');
        if (defaultStagePanel && !defaultStagePanel.classList.contains('active')) {
            document.querySelectorAll('.stage-panel').forEach(panel => panel.classList.remove('active'));
            defaultStagePanel.classList.add('active');
            const defaultStageTab = document.querySelector('.stage-tab[data-stage="student"]');
            if (defaultStageTab) {
                document.querySelectorAll('.stage-tab').forEach(tab => {
                    tab.classList.remove('active');
                    tab.setAttribute('aria-selected', 'false');
                });
                defaultStageTab.classList.add('active');
                defaultStageTab.setAttribute('aria-selected', 'true');
            }
        }
    });

    // Stage Tab Switching
    const stageTabs = document.querySelectorAll('.stage-tab');
    const stagePanels = document.querySelectorAll('.stage-panel');
    
    stageTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetStage = this.getAttribute('data-stage');
            
            // Update stage tabs
            stageTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // Update stage panels
            stagePanels.forEach(panel => {
                panel.classList.remove('active');
            });
            const targetStagePanel = document.querySelector(`.stage-panel[data-stage-panel="${targetStage}"]`);
            if (targetStagePanel) {
                targetStagePanel.classList.add('active');
            }
        });
    });
})();
