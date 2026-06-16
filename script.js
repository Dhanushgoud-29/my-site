/**
 * Dhanush Portfolio Website - Interactive Script Engine
 * Includes: Theme Toggle, Typing Animation, Scroll Observer, Stats Counter,
 * Project Search & Filters, Testimonial Slider, Modals System, and Contact Validator.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       THEME MANAGEMENT (Dark / Light Mode)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Load saved theme or fall back to system preferences
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        htmlElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
    });

    /* ==========================================================================
       MOBILE NAVIGATION TRIGGER
       ========================================================================== */
    const mobileMenuTrigger = document.getElementById('mobile-menu-trigger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    function toggleMobileMenu() {
        const isOpen = mobileMenu.classList.contains('open');
        if (isOpen) {
            mobileMenu.classList.remove('open');
            mobileMenuTrigger.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
        } else {
            mobileMenu.classList.add('open');
            mobileMenuTrigger.setAttribute('aria-expanded', 'true');
            mobileMenu.setAttribute('aria-hidden', 'false');
        }
    }

    mobileMenuTrigger.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('open') && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuTrigger.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    /* ==========================================================================
       STICKY NAVBAR & ACTIVE SECTION LINK HIGHLIGHT
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Scroll bar indicator width
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('scroll-progress').style.width = scrolled + '%';

        // Sticky Navbar background add
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlight calculations
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Set active class
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       TYPING EFFECT (Hero Section)
       ========================================================================== */
    const typingTextElement = document.getElementById('typing-text');
    const wordsToType = ['Machine Learning Developer', 'Web Developer', 'AI Solutions Architect'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeWords() {
        const currentWord = wordsToType[wordIndex];
        
        if (isDeleting) {
            typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster deletion
        } else {
            typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // standard typing
        }

        // Handle states
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000; // pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % wordsToType.length;
            typingSpeed = 500; // pause before typing next
        }

        setTimeout(typeWords, typingSpeed);
    }

    if (typingTextElement) {
        typeWords();
    }

    /* ==========================================================================
       INTERSECTION OBSERVER (Scroll Reveals & Stats Rolls & Skills Fill)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const skillFills = document.querySelectorAll('.skill-fill');
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;
    let skillsAnimated = false;

    // Reveal elements observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                // Optional: stop observing once revealed
                // revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Stats counter trigger observer
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                animateStatistics();
                statsAnimated = true;
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.getElementById('statistics');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateStatistics() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            let count = 0;
            const duration = 2000; // 2 seconds animation
            const increment = target / (duration / 16); // ~60fps
            
            const counterInterval = setInterval(() => {
                count += increment;
                if (count >= target) {
                    stat.textContent = target;
                    clearInterval(counterInterval);
                } else {
                    stat.textContent = Math.floor(count);
                }
            }, 16);
        });
    }

    // Skills bar fill observer
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !skillsAnimated) {
                fillSkillBars();
                skillsAnimated = true;
            }
        });
    }, { threshold: 0.2 });

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    function fillSkillBars() {
        skillFills.forEach(fill => {
            const percent = fill.getAttribute('data-percentage');
            fill.style.width = percent + '%';
        });
    }

    /* ==========================================================================
       GITHUB ACTIVITY MONITOR (Simulated Sync)
       ========================================================================== */
    const commitVal = document.getElementById('git-commits');
    const starVal = document.getElementById('git-stars');
    const prVal = document.getElementById('git-prs');

    function simulateGitHubSync() {
        if (commitVal && starVal && prVal) {
            // Periodic micro additions
            setInterval(() => {
                if (Math.random() > 0.7) {
                    let commits = parseInt(commitVal.textContent.replace(/,/g, ''), 10);
                    commitVal.textContent = (commits + 1).toLocaleString();
                }
                if (Math.random() > 0.95) {
                    let stars = parseInt(starVal.textContent, 10);
                    starVal.textContent = stars + 1;
                }
            }, 5000);
        }
    }
    simulateGitHubSync();

    /* ==========================================================================
       PROJECT SEARCH & CATEGORY FILTERING
       ========================================================================== */
    const searchInput = document.getElementById('project-search');
    const filterTags = document.querySelectorAll('.filter-tag');
    const projectCards = document.querySelectorAll('#projects-grid .project-card');
    const noProjectsMsg = document.getElementById('no-projects-msg');

    let activeFilter = 'all';
    let searchQuery = '';

    function filterProjects() {
        let matchCount = 0;
        
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const tags = card.getAttribute('data-tags').toLowerCase();
            const title = card.querySelector('.project-name').textContent.toLowerCase();
            const desc = card.querySelector('.project-short-desc').textContent.toLowerCase();
            
            const categoryMatches = (activeFilter === 'all' || category === activeFilter);
            const searchMatches = (title.includes(searchQuery) || desc.includes(searchQuery) || tags.includes(searchQuery));

            if (categoryMatches && searchMatches) {
                card.classList.remove('fade-out');
                card.classList.add('fade-in');
                matchCount++;
            } else {
                card.classList.remove('fade-in');
                card.classList.add('fade-out');
            }
        });

        if (matchCount === 0) {
            noProjectsMsg.classList.remove('hidden');
        } else {
            noProjectsMsg.classList.add('hidden');
        }
    }

    // Search input event
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            filterProjects();
        });
    }

    // Filter pill click events
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            activeFilter = tag.getAttribute('data-filter');
            filterProjects();
        });
    });



    /* ==========================================================================
       CASE STUDY DATA & MODAL SYSTEMS
       ========================================================================== */
    const caseStudyData = {
        stock: {
            title: "Stock Market Prediction System",
            img: "assets/project_stock.png",
            challenge: "Traditional financial analytics packages rely on manual computations that fail to parse complex temporal relationships across multi-year asset logs. We set out to design an automated portal that imports public equity indicators and evaluates future value patterns.",
            solution: "Trained recursive Long Short-Term Memory neural network nodes (LSTM) via TensorFlow to digest price trends. Wrapped the model inside a Flask api. Optimized prediction pipelines using normalization modules to complete predictive routines in under 2 seconds.",
            tech: ["Python", "TensorFlow", "Pandas", "Flask", "Keras"],
            metrics: {
                "Model Accuracy": "92.4%",
                "Mean Squared Error (MSE)": "0.0014",
                "Response Latency": "<1.8 sec",
                "Historical Scope": "10+ Years"
            },
            git: "https://github.com",
            demo: "#"
        },
        resume: {
            title: "AI Resume Screening Tool",
            img: "assets/project_resume.png",
            challenge: "Talent acquisition teams are bottlenecked by reviewing hundreds of applications daily. Standard applicant tracking software searches blindly for exact matches. We aimed to build a semantic scanner that reads profiles intelligently.",
            solution: "Constructed NLP word mapping architectures with NLTK and Scikit-learn to tokenize and evaluate text blocks. Developed a Cosine Similarity ranking engine to score profiles against target descriptions, mapping results to a responsive React.js front-end.",
            tech: ["Python", "NLTK", "Scikit-learn", "React", "MongoDB"],
            metrics: {
                "Parsing Match Score": "94.6%",
                "Processing Latency": "<1.2 sec",
                "HR Screening Speedup": "60%",
                "File formats": "PDF, DOCX, TXT"
            },
            git: "https://github.com",
            demo: "#"
        },
        portfolio: {
            title: "Personal Portfolio Design",
            img: "assets/project_portfolio.png",
            challenge: "Contemporary portfolio templates are often bloated with unnecessary frameworks, complex libraries, and massive tracking script dependencies, leading to accessibility errors and high page load overheads.",
            solution: "Crafted this clean single-page site using pure HTML5, vanilla CSS grid configurations, and modular ES6 JavaScript. Used CSS custom variables for layout themes and Intersection Observer routines for animation fades.",
            tech: ["HTML5", "CSS3", "JavaScript", "Vanilla UX", "Figma"],
            metrics: {
                "Lighthouse Performance": "100",
                "Accessibility Score": "100",
                "Page Load Speed": "<0.5s",
                "Third-party Scripts": "Zero"
            },
            git: "https://github.com",
            demo: "#"
        },
        crop: {
            title: "Smart Crop Predictor",
            img: "assets/project_stock.png",
            challenge: "Agricultural planning is frequently disrupted by changing weather patterns. Cultivators struggle to determine crop rotations based on changing soil values (Nitrogen, Phosphorous) and seasonal rainfall statistics.",
            solution: "Built a classification algorithm incorporating Random Forest and XGBoost to map soil profiles against crop datasets. Deployed a Flask interface showing recommended crop options and fertilizer guidelines.",
            tech: ["Python", "Scikit-learn", "Flask", "MySQL", "NumPy"],
            metrics: {
                "Classification Accuracy": "95.8%",
                "API Sync Latency": "<1.1 sec",
                "Cross-Validation score": "95%",
                "Soil variables mapped": "7 Parameters"
            },
            git: "https://github.com",
            demo: "#"
        },
        chat: {
            title: "Real-time Collaborative Dashboard",
            img: "assets/project_portfolio.png",
            challenge: "Web environments require live sync platforms to support active chat channels. Traditional HTTP polling structures drain network channels and display high delays.",
            solution: "Coded a Node.js framework supporting Socket.io channels to establish client WebSockets. Implemented custom chatrooms, active indicator pulses, and text logging synced with a MongoDB document database.",
            tech: ["Node.js", "Socket.io", "Express", "MongoDB", "CSS3"],
            metrics: {
                "Connection Sync Latency": "<50ms",
                "Max Concurrent Users": "1,500+",
                "Storage efficiency": "98%",
                "Encryption": "TLS Protected"
            },
            git: "https://github.com",
            demo: "#"
        },
        uikit: {
            title: "Glowing UI Glass Component Kit",
            img: "assets/project_resume.png",
            challenge: "Design teams spend redundant hours crafting responsive layout systems, dark/light transitions, and complex grid patterns for every new development project.",
            solution: "Assembled a library of CSS glass cards, layout grids, animated skill meters, and inputs with high accessibility support and clean custom properties.",
            tech: ["HTML5", "CSS3", "Glassmorphism", "Figma", "UX Flow"],
            metrics: {
                "Component Files": "24 modules",
                "CSS Bundle Size": "<15KB",
                "Dark Mode compliance": "Native",
                "Responsive triggers": "Universal"
            },
            git: "https://github.com",
            demo: "#"
        }
    };

    const caseStudyModal = document.getElementById('case-study-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const openCaseStudyBtns = document.querySelectorAll('.open-case-study');

    const modalTitle = document.getElementById('modal-project-title');
    const modalImg = document.getElementById('modal-project-img');
    const modalChallenge = document.getElementById('modal-project-challenge');
    const modalSolution = document.getElementById('modal-project-solution');
    const modalTech = document.getElementById('modal-project-tech');
    const modalMetrics = document.getElementById('modal-project-metrics');
    const modalGit = document.getElementById('modal-project-git');
    const modalDemo = document.getElementById('modal-project-demo');

    function openCaseStudy(projKey) {
        const data = caseStudyData[projKey];
        if (!data) return;

        // Inject Data
        modalTitle.textContent = data.title;
        modalImg.src = data.img;
        modalImg.alt = data.title + " Hero Image";
        modalChallenge.textContent = data.challenge;
        modalSolution.textContent = data.solution;
        
        // Clear and add tech tags
        modalTech.innerHTML = '';
        data.tech.forEach(t => {
            const span = document.createElement('span');
            span.textContent = t;
            modalTech.appendChild(span);
        });

        // Clear and add metrics
        modalMetrics.innerHTML = '';
        Object.entries(data.metrics).forEach(([label, val]) => {
            const div = document.createElement('div');
            div.className = 'metric-item';
            div.innerHTML = `${label} <span>${val}</span>`;
            modalMetrics.appendChild(div);
        });

        // Links
        modalGit.href = data.git;
        modalDemo.href = data.demo;
        if (data.demo === "#") {
            modalDemo.style.display = 'none';
        } else {
            modalDemo.style.display = 'inline-flex';
        }

        // Show Modal & lock screen scroll
        caseStudyModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeCaseStudy() {
        caseStudyModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    openCaseStudyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectKey = btn.getAttribute('data-project');
            openCaseStudy(projectKey);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeCaseStudy);
    }

    // Modal background close
    if (caseStudyModal) {
        caseStudyModal.addEventListener('click', (e) => {
            if (e.target === caseStudyModal) {
                closeCaseStudy();
            }
        });
    }

    // Escape key closes modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCaseStudy();
        }
    });

    /* ==========================================================================
       CONTACT FORM VALIDATION & SIMULATION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    function validateEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(String(email).toLowerCase());
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const messageInput = document.getElementById('contact-message');
            const submitBtn = document.getElementById('form-submit-btn');

            let isFormValid = true;

            // Name check
            if (nameInput.value.trim() === '') {
                nameInput.parentElement.classList.add('invalid');
                isFormValid = false;
            } else {
                nameInput.parentElement.classList.remove('invalid');
            }

            // Email check
            if (!validateEmail(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('invalid');
                isFormValid = false;
            } else {
                emailInput.parentElement.classList.remove('invalid');
            }

            // Message check
            if (messageInput.value.trim() === '') {
                messageInput.parentElement.classList.add('invalid');
                isFormValid = false;
            } else {
                messageInput.parentElement.classList.remove('invalid');
            }

            // If valid, simulate submission
            if (isFormValid) {
                submitBtn.disabled = true;
                const originalBtnContent = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Sending... <span class="spinner"></span>';
                
                formStatus.className = 'form-status-alert hidden';

                // Simulate network latency (1.5 seconds)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                    
                    formStatus.textContent = "Thank you, Dhanush has received your message! He will get back to you shortly.";
                    formStatus.className = 'form-status-alert success';
                    
                    // Reset fields
                    contactForm.reset();
                    
                    // Auto-hide alert after 8 seconds
                    setTimeout(() => {
                        formStatus.className = 'form-status-alert hidden';
                    }, 8000);

                }, 1500);
            }
        });

        // Keyup listeners to clear errors on active typing
        const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    if (input.type === 'email') {
                        if (validateEmail(input.value.trim())) {
                            input.parentElement.classList.remove('invalid');
                        }
                    } else {
                        input.parentElement.classList.remove('invalid');
                    }
                }
            });
        });
    }



    /* ==========================================================================
       BACK TO TOP BUTTON
       ========================================================================== */
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.pointerEvents = 'auto';
                backToTopBtn.style.transform = 'translateY(0)';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.pointerEvents = 'none';
                backToTopBtn.style.transform = 'translateY(10px)';
            }
        });

        // Initialize state
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
        backToTopBtn.style.transform = 'translateY(10px)';
        backToTopBtn.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
