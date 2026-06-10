/* ==========================================================================
   HEALTH INSURANCE AGENT PORTFOLIO - LOGIC & INTERACTIVE SUITE
   ========================================================================== */

// ==========================================================================
// CONFIGURATION
// ==========================================================================
// To receive email notifications for lead submissions directly in your inbox:
// 1. Visit https://web3forms.com/ and submit your email (e.g. sheelamdurgeshwar@gmail.com) to get a free Access Key.
// 2. Paste your Access Key below.
// 3. (Optional) If left as "YOUR_ACCESS_KEY_HERE" or empty, submissions will still be saved to the local dashboard (LocalStorage).
const WEB3FORMS_ACCESS_KEY = "09e9cb65-4bf8-4c22-9369-cc21ed915c7a";

// Global variable to hold the last completed policy finder state
window.lastPolicyFinderState = null;


document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Theme ---
    initTheme();

    // --- Header & Scroll Events ---
    initScrollEffects();

    // --- Navigation Menu for Mobile ---
    initMobileNav();

    // --- Scroll Animations (Intersection Observer) ---
    initScrollAnimations();

    // --- FAQ Accordions ---
    initFaqs();

    // --- Smart Policy Finder Wizard ---
    initPolicyFinder();

    // --- Modals Controller ---
    initModals();

    // --- Forms & Leads Processor ---
    initFormsAndLeads();
});

/* ==========================================================================
   THEME SWITCHER
   ========================================================================== */
function initTheme() {
    const themeButtons = document.querySelectorAll('.theme-toggle');

    // Check saved preference or system theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', currentTheme);
        });
    });
}

/* ==========================================================================
   SCROLL EFFECTS (Header & Progress)
   ========================================================================== */
function initScrollEffects() {
    const header = document.getElementById('siteHeader');
    const scrollBar = document.getElementById('scrollProgressBar');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Sticky Header class
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Scroll Progress Bar
        if (scrollBar && docHeight > 0) {
            const scrollPercent = (scrollY / docHeight) * 100;
            scrollBar.style.width = `${scrollPercent}%`;
        }
    });
}

/* ==========================================================================
   MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileNav() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!mobileToggle || !navMenu) return;

    const toggleMenu = () => {
        const isOpen = navMenu.classList.contains('active');
        navMenu.classList.toggle('active');
        mobileToggle.setAttribute('aria-expanded', !isOpen);
        
        // Toggle hamburger / close icons
        if (!isOpen) {
            mobileToggle.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            `;
        } else {
            mobileToggle.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            `;
        }
    };

    mobileToggle.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
}

/* ==========================================================================
   SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
    const animables = document.querySelectorAll('.fade-in-on-scroll');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Trigger once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animables.forEach(item => observer.observe(item));
    } else {
        // Fallback for older browsers
        animables.forEach(item => item.classList.add('visible'));
    }
}

/* ==========================================================================
   FAQ ACCORDIONS
   ========================================================================== */
function initFaqs() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!question || !answer) return;

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current FAQ
            item.classList.toggle('active');
            question.setAttribute('aria-expanded', !isActive);

            if (!isActive) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = null;
            }
        });
    });
}

/* ==========================================================================
   SMART POLICY FINDER WIZARD
   ========================================================================== */
function initPolicyFinder() {
    const finder = document.getElementById('policyFinderWizard');
    if (!finder) return;

    // Selection Data Store
    const finderState = {
        step1: '', // Coverage for: self, couple, family, senior
        step2: '', // Key Priority: premium, copay, doctor, prescription
        step3: '', // Age range: under-30, 30-50, 50-64, senior-65
        step4: 45000 // Household Income (slider value)
    };

    let currentStep = 1;
    const totalSteps = 4;

    const steps = finder.querySelectorAll('.finder-step');
    const prevBtn = document.getElementById('finderPrevBtn');
    const nextBtn = document.getElementById('finderNextBtn');
    const progressFill = document.getElementById('finderProgressFill');
    const stepIndicator = document.getElementById('finderStepIndicator');

    // Slider configuration
    const incomeSlider = document.getElementById('finderIncomeSlider');
    const incomeBubble = document.getElementById('finderIncomeBubble');

    if (incomeSlider && incomeBubble) {
        const updateSliderLabel = (value) => {
            let label = '';
            const formattedValue = Number(value).toLocaleString('en-IN');
            if (value < 20000) {
                label = `₹${formattedValue} (Low Income / High Subsidies Eligible)`;
            } else if (value < 55000) {
                label = `₹${formattedValue} (Middle Income / Moderate Subsidies Eligible)`;
            } else if (value < 100000) {
                label = `₹${formattedValue} (Upper-Middle Income)`;
            } else {
                label = `₹${formattedValue} (High Income / Premium Coverage Plan)`;
            }
            incomeBubble.textContent = label;
        };

        incomeSlider.addEventListener('input', (e) => {
            finderState.step4 = parseInt(e.target.value);
            updateSliderLabel(e.target.value);
        });

        // Initialize label
        updateSliderLabel(incomeSlider.value);
    }

    // Handle Option Cards Clicks (Steps 1, 2, 3)
    steps.forEach((step, index) => {
        const cards = step.querySelectorAll('.finder-option-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                // Clear selection in current step
                cards.forEach(c => c.classList.remove('selected'));
                // Select clicked card
                card.classList.add('selected');

                // Read selection
                const value = card.dataset.value;
                const stepKey = `step${index + 1}`;
                finderState[stepKey] = value;

                // Auto-advance for step 1, 2, 3 to enhance UX
                setTimeout(() => {
                    if (currentStep === index + 1 && currentStep < totalSteps) {
                        goToStep(currentStep + 1);
                    }
                }, 300);
            });
        });
    });

    const updateControls = () => {
        // Toggle Prev Button
        if (currentStep === 1) {
            prevBtn.style.visibility = 'hidden';
        } else {
            prevBtn.style.visibility = 'visible';
        }

        // Toggle Next Button Text (Submits on Step 4)
        if (currentStep === totalSteps) {
            nextBtn.innerHTML = `
                Show Matches
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            `;
        } else {
            nextBtn.innerHTML = `
                Next Step
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            `;
        }

        // Progress Fill
        const percent = ((currentStep) / totalSteps) * 100;
        progressFill.style.width = `${percent}%`;

        // Text Indicator
        stepIndicator.textContent = `Step ${currentStep} of ${totalSteps}`;
    };

    const isStepValid = (stepNum) => {
        if (stepNum === 1) return finderState.step1 !== '';
        if (stepNum === 2) return finderState.step2 !== '';
        if (stepNum === 3) return finderState.step3 !== '';
        return true; // Step 4 is a slider with default value
    };

    const goToStep = (targetStep) => {
        // Hide all steps
        steps.forEach(s => s.classList.remove('active'));
        
        // Show target step
        const targetElement = finder.querySelector(`.finder-step[data-step="${targetStep}"]`);
        if (targetElement) {
            targetElement.classList.add('active');
            currentStep = targetStep;
            updateControls();
        }
    };

    // Next Button Handler
    nextBtn.addEventListener('click', () => {
        if (!isStepValid(currentStep)) {
            showToast('Information Needed', 'Please select an option to proceed.', 'warning');
            return;
        }

        if (currentStep < totalSteps) {
            goToStep(currentStep + 1);
        } else {
            // Process and Display Policy Match Recommendation
            displayRecommendation(finderState);
        }
    });

    // Prev Button Handler
    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        }
    });

    // Reset Finder wizard back to Step 1
    window.resetPolicyFinder = function() {
        window.lastPolicyFinderState = null;
        finderState.step1 = '';
        finderState.step2 = '';
        finderState.step3 = '';
        finderState.step4 = 45000;
        
        if (incomeSlider) incomeSlider.value = 45000;
        const event = new Event('input');
        if (incomeSlider) incomeSlider.dispatchEvent(event);

        steps.forEach(s => {
            s.querySelectorAll('.finder-option-card').forEach(c => c.classList.remove('selected'));
        });

        // Hide result step if showing
        const resultStep = finder.querySelector('.finder-step[data-step="result"]');
        if (resultStep) resultStep.classList.remove('active');

        // Show wizard header/progress and step 1
        finder.querySelector('.finder-header').style.display = 'flex';
        finder.querySelector('.finder-progress-track').style.display = 'block';
        finder.querySelector('.finder-footer').style.display = 'flex';

        goToStep(1);
    };
}

/* ==========================================================================
   RECOMMENDATION ENGINE CALCULATIONS
   ========================================================================== */
function displayRecommendation(answers) {
    const finder = document.getElementById('policyFinderWizard');
    const resultStep = finder.querySelector('.finder-step[data-step="result"]');
    
    // Hide wizard headers and navigation elements
    finder.querySelector('.finder-header').style.display = 'none';
    finder.querySelector('.finder-progress-track').style.display = 'none';
    finder.querySelector('.finder-footer').style.display = 'none';
    
    // Hide active step
    finder.querySelectorAll('.finder-step').forEach(s => s.classList.remove('active'));

    // Scoring Engine
    let recommendedPlan = {
        title: '',
        desc: '',
        badge: '',
        coverageKey: ''
    };

    if (answers.step3 === 'senior-65') {
        recommendedPlan.title = 'Premium Medicare Supplement Plan G';
        recommendedPlan.desc = 'Based on your age, you are eligible for Medicare. Plan G offers the most comprehensive supplemental coverage, matching you with leading carriers (like Aetna or Humana) to eliminate doctor copays, excess charges, and deductibles.';
        recommendedPlan.badge = 'Medicare Supplemental Coverage';
        recommendedPlan.coverageKey = 'Medicare & Senior Plans';
    } 
    else if (answers.step2 === 'premium' && answers.step4 < 30000) {
        recommendedPlan.title = 'Enhanced ACA Silver Plan (CSR Subsidized)';
        recommendedPlan.desc = 'Your estimated household income qualifies you for maximum cost-sharing reductions (CSR). This ACA Plan offers extremely low deductibles, small co-pays, and a premium subsidized almost entirely by federal tax credits.';
        recommendedPlan.badge = 'ACA Subsidized Marketplace Plan';
        recommendedPlan.coverageKey = 'Individual & Family Plans (ACA)';
    }
    else if (answers.step2 === 'copay' || answers.step4 > 95000) {
        recommendedPlan.title = 'Gold PPO Comprehensive Health Plan';
        recommendedPlan.desc = 'For those prioritizing low doctor visit costs and choice of provider networks, this PPO plan provides direct specialist access, pre-negotiated fixed copays, and standard prescription tiers without first meeting a high deductible.';
        recommendedPlan.badge = 'Comprehensive Gold PPO';
        recommendedPlan.coverageKey = 'Family Health Plans';
    }
    else if (answers.step1 === 'family') {
        recommendedPlan.title = 'Family Premier Network HMO/PPO';
        recommendedPlan.desc = 'A balance of preventive dental/vision care for dependents, moderate deductibles, and low primary care copays. Crafted specifically for family units with custom maximum out-of-pocket protections.';
        recommendedPlan.badge = 'Family Managed Care Plan';
        recommendedPlan.coverageKey = 'Family Health Plans';
    }
    else {
        recommendedPlan.title = 'HSA-Eligible High Deductible Health Plan (HDHP)';
        recommendedPlan.desc = 'A modern, high-conversion plan featuring the lowest possible monthly premium. Enables tax-free contributions into a Health Savings Account (HSA) that carries over year-to-year, protecting you against major medical expenses.';
        recommendedPlan.badge = 'HSA-Eligible Tax Saver';
        recommendedPlan.coverageKey = 'Individual & Family Plans (ACA)';
    }

    // Render Recommendations
    document.getElementById('recPlanBadge').textContent = recommendedPlan.badge;
    document.getElementById('recPlanTitle').textContent = recommendedPlan.title;
    document.getElementById('recPlanDesc').textContent = recommendedPlan.desc;
    
    // Bind Lead Button to pre-populate Coverage in modal
    const lockQuoteBtn = document.getElementById('lockQuoteBtn');
    if (lockQuoteBtn) {
        lockQuoteBtn.onclick = () => {
            openQuoteModal(recommendedPlan.coverageKey);
        };
    }

    // Save the policy finder results globally for submission integration
    window.lastPolicyFinderState = {
        answers: {
            coverageFor: answers.step1,
            priority: answers.step2,
            ageRange: answers.step3,
            income: answers.step4
        },
        recommendation: recommendedPlan
    };

    // Display Result
    resultStep.classList.add('active');
}

/* ==========================================================================
   MODALS MANAGEMENT
   ========================================================================== */
function initModals() {
    const overlays = document.querySelectorAll('.modal-overlay');
    const closeButtons = document.querySelectorAll('[data-modal-close]');
    const triggerButtons = document.querySelectorAll('[data-modal-open]');

    window.openQuoteModal = function(prefillCoverage = '') {
        const modal = document.getElementById('quoteModal');
        if (!modal) return;

        // Reset scroll position and focus
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scrolling

        // Prefill Coverage dropdown
        if (prefillCoverage) {
            const select = modal.querySelector('select[name="coverage"]');
            if (select) {
                // Find matching option text or value
                for (let option of select.options) {
                    if (option.value === prefillCoverage || option.text.includes(prefillCoverage)) {
                        select.value = option.value;
                        break;
                    }
                }
            }
        }

        // Accessibility focus trapping
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex="0"]');
        if (focusable.length > 0) {
            setTimeout(() => focusable[0].focus(), 100);
        }
    };

    window.closeQuoteModal = function() {
        overlays.forEach(overlay => {
            overlay.classList.remove('active');
        });
        document.body.style.overflow = ''; // Unlock scroll
    };

    triggerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.dataset.modalOpen;
            const prefill = btn.dataset.prefill || '';
            if (modalId === 'quoteModal') {
                openQuoteModal(prefill);
            }
        });
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeQuoteModal);
    });

    // Close on backdrop click
    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeQuoteModal();
            }
        });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeQuoteModal();
        }
    });
}

/* ==========================================================================
   FORMS VALIDATION & LEADS PROCESSOR
   ========================================================================== */
function initFormsAndLeads() {
    // Lead Submission Forms
    const leadForm = document.getElementById('leadForm');
    const contactForm = document.getElementById('contactForm');

    // Setup Local Storage Submissions Table Drawer
    initDemoSubmissionsDrawer();

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(leadForm)) {
                submitForm(leadForm);
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(contactForm)) {
                submitForm(contactForm);
            }
        });
    }
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('[required]');

    inputs.forEach(input => {
        const group = input.closest('.form-group');
        let isFieldValid = true;

        if (input.value.trim() === '') {
            isFieldValid = false;
        } else if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isFieldValid = emailRegex.test(input.value.trim());
        } else if (input.type === 'tel') {
            const cleaned = input.value.trim().replace(/[\s-]/g, '');
            const phoneRegex = /^\+91[6-9]\d{9}$/;
            isFieldValid = phoneRegex.test(cleaned);
        }

        if (!isFieldValid) {
            isValid = false;
            if (group) group.classList.add('has-error');
        } else {
            if (group) group.classList.remove('has-error');
        }

        // Live typing cleanups
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                if (group) group.classList.remove('has-error');
            }
        });
    });

    return isValid;
}

function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Show loading spinner
    submitBtn.disabled = true;
    submitBtn.classList.add('btn-loading');
    submitBtn.innerHTML = `<span class="spinner"></span> Sending...`;

    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const state = formData.get('state') || 'Online Inquiry';
    const startDate = formData.get('start_date') || 'Immediate';
    const coverage = formData.get('coverage') || 'General Contact Request';
    const userMessage = formData.get('message') || 'Interested in a policy review.';

    // Construct local storage object
    const lead = {
        id: 'L-' + Date.now(),
        date: new Date().toLocaleString(),
        name,
        email,
        phone,
        state,
        startDate,
        coverage,
        message: userMessage
    };

    // Include Policy Finder results if they exist and match the selected coverage
    let emailMessage = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nState: ${state}\nDesired Coverage Start Date: ${startDate}\nDesired Coverage: ${coverage}\nMessage: ${userMessage}`;
    if (window.lastPolicyFinderState && window.lastPolicyFinderState.recommendation && window.lastPolicyFinderState.recommendation.coverageKey === coverage) {
        const answers = window.lastPolicyFinderState.answers;
        const rec = window.lastPolicyFinderState.recommendation;
        lead.recommendedPlan = rec.title;
        lead.policyFinderAnswers = `Coverage for: ${answers.coverageFor}, Priority: ${answers.priority}, Age: ${answers.ageRange}, Income: ₹${answers.income.toLocaleString('en-IN')}`;
        emailMessage += `\n\n--- Policy Finder Results ---\nRecommended Plan: ${rec.title}\nDescription: ${rec.desc}\nUser Answers:\n- Coverage for: ${answers.coverageFor}\n- Primary Goal: ${answers.priority}\n- Age Range: ${answers.ageRange}\n- Est. Income: ₹${answers.income.toLocaleString('en-IN')}`;
    }

    // Store to localStorage for offline resilience
    const savedLeads = JSON.parse(localStorage.getItem('insurance_leads') || '[]');
    savedLeads.unshift(lead); // Prepend so new leads display first
    localStorage.setItem('insurance_leads', JSON.stringify(savedLeads));

    // Determine target email or API key
    if (WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== "YOUR_ACCESS_KEY_HERE" && WEB3FORMS_ACCESS_KEY.trim() !== "") {
        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                access_key: WEB3FORMS_ACCESS_KEY,
                name: name,
                email: email,
                subject: `New Lead: ${name} (${coverage})`,
                message: emailMessage,
                from_name: "MS Insurance Services"
            })
        })
        .then(async (response) => {
            const json = await response.json();
            if (response.status === 200) {
                showToast('Check Your Email!', `Inquiry sent successfully to msinsuranceinfo@gmail.com!`, 'success');
                form.reset();
                if (form.id === 'leadForm') {
                    closeQuoteModal();
                }
            } else {
                console.error(json);
                showToast('Saved Locally', `Saved to dashboard. Mail API error: ${json.message || 'Unknown error'}`, 'warning');
                form.reset();
                if (form.id === 'leadForm') {
                    closeQuoteModal();
                }
            }
        })
        .catch(error => {
            console.error(error);
            showToast('Saved Locally', 'Saved to dashboard. A network error occurred while sending email.', 'warning');
            form.reset();
            if (form.id === 'leadForm') {
                closeQuoteModal();
            }
        })
        .finally(() => {
            // Restore button
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');
            submitBtn.innerHTML = originalText;
            renderSubmissions();
        });
    } else {
        // Fallback for local demo/development
        setTimeout(() => {
            showToast('Inquiry Submitted!', `Thank you, ${lead.name}. Lead saved to local dashboard (no API key configured).`, 'success');
            form.reset();
            if (form.id === 'leadForm') {
                closeQuoteModal();
            }
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');
            submitBtn.innerHTML = originalText;
            renderSubmissions();
        }, 800);
    }
}

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */
function showToast(title, message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'warning') {
        toast.style.borderLeftColor = '#eab308';
    }

    // Success SVG or Warning SVG
    const iconSvg = type === 'success' 
        ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
             <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
           </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
             <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
           </svg>`;

    toast.innerHTML = `
        <div class="toast-icon" style="color: ${type === 'success' ? 'var(--emerald-green)' : '#eab308'};">
            ${iconSvg}
        </div>
        <div class="toast-message">
            <h6>${title}</h6>
            <p>${message}</p>
        </div>
    `;

    container.appendChild(toast);

    // Trigger animation slide in
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
}

/* ==========================================================================
   DEMO SUBMISSIONS DASHBOARD (LOCAL STORAGE VIEW)
   ========================================================================== */
function initDemoSubmissionsDrawer() {
    const drawer = document.getElementById('demoDashboardDrawer');
    const header = document.getElementById('demoDashboardHeader');

    if (!drawer || !header) return;

    header.addEventListener('click', () => {
        drawer.classList.toggle('open');
    });

    renderSubmissions();
}

function renderSubmissions() {
    const tableBody = document.getElementById('demoSubmissionsBody');
    const badge = document.getElementById('demoDashboardBadge');
    
    if (!tableBody) return;

    const leads = JSON.parse(localStorage.getItem('insurance_leads') || '[]');
    
    // Update Badge Count
    if (badge) {
        badge.textContent = leads.length;
        badge.style.display = leads.length > 0 ? 'inline-block' : 'none';
    }

    if (leads.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="demo-submission-empty">
                    No lead inquiries received yet. Submit the Quote Form or Contact Form to see entries log in real-time.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = leads.map(lead => `
        <tr>
            <td style="font-weight: 600; color: var(--text-primary);">${escapeHtml(lead.name)}</td>
            <td>${escapeHtml(lead.phone)}</td>
            <td>${escapeHtml(lead.email)}</td>
            <td><span class="badge-licensed" style="font-size:0.6rem; padding: 0.1rem 0.4rem;">${escapeHtml(lead.state)}</span></td>
            <td style="font-weight: 500;">${escapeHtml(lead.coverage)}</td>
            <td>${escapeHtml(lead.startDate || 'Immediate')}</td>
            <td style="color: var(--text-muted); font-size:0.8rem;">${lead.date}</td>
        </tr>
    `).join('');
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}
