document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animation on Scroll)
    AOS.init({
        once: true,
        duration: 800,
        offset: 50,
        easing: 'ease-out-quad',
        disable: window.innerWidth < 768
    });

    // --- Navigation Logic ---
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const scrollTriggerLinks = document.querySelectorAll('a.btn-contact[href^="#"], a.btn-hireMe[href^="#"]');
    const headerElement = document.querySelector('header');
    const headerHeight = headerElement ? headerElement.offsetHeight : 80;
    const pageSections = document.querySelectorAll('section[id]');

    // Smooth scroll function
    const scrollToSection = (targetElement) => {
        if (!targetElement) return;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
    };

    // Add click listeners for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            scrollToSection(targetElement);
        });
    });

    // Add click listeners for other scroll-triggering links
    scrollTriggerLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                event.preventDefault();
                const targetElement = document.querySelector(targetId);
                scrollToSection(targetElement);
            }
        });
    });

    // Update active navigation link on scroll
    const updateActiveNavLink = () => {
        const currentScroll = window.pageYOffset;
        let activeSectionId = 'hero';
        pageSections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
                activeSectionId = section.getAttribute('id');
            }
        });
        if (currentScroll < pageSections[0].offsetTop - headerHeight - 50) {
           activeSectionId = 'hero';
        }
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeSectionId}`) {
                link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();

    // --- Footer Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- MODAL LOGIC ---

    const modalOverlay = document.getElementById('project-modal');
    const modalCloseBtn = modalOverlay.querySelector('.modal-close-btn');
    // REMOVED: const modalImg = document.getElementById('modal-img');
    // REMOVED: const modalAllImages = document.getElementById('all-works');
    const modalGalleryContainer = document.getElementById('modal-gallery'); // ADDED
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalTechStack = document.getElementById('modal-tech-stack');
    const modalLinksContainer = document.getElementById('modal-links');
    const projectCards = document.querySelectorAll('#projects .project-card');

    // --- Detailed Project Data ---
    // IMPORTANT: Use 'galleryImages' array instead of 'largeImage'
    // Add paths to your actual images. Assume an 'assets' or 'images' folder.
    const projectDetails = {
        "Project Title One (Featured)": {
            galleryImages: [ // MODIFIED
                "placeholder-project1-large.png", // Example image 1
                "placeholder-project1-alt1.png",  // Example image 2
                "placeholder-project1-alt2.png"   // Example image 3
            ],
            description: "<p>This is the <strong>full, detailed description</strong> for Project Title One. It might span multiple paragraphs.</p><p>Talk about the challenges, the solutions implemented, and the overall goal of the project. Use HTML tags like <code><strong></code> or <code><em></code> if needed.</p>",
            tech: ["React", "JavaScript (ES6+)", "CSS Grid", "Figma", "AOS Library", "Spline 3D"],
            liveUrl: "#",
            githubUrl: "#"
        },
        "Project Title Two": {
            galleryImages: [ // MODIFIED
                "placeholder-project2-large.png",
                // Add more images if available for Project Two
            ],
            description: "<p>Detailed description for Project Two goes here. Focus on the design or animation aspects mentioned in the card's brief description.</p><p>Explain the tools and techniques used, like specific animation libraries or design principles followed.</p>",
            tech: ["HTML5", "Sass", "JavaScript", "GSAP (Animation)", "Blender (3D assets)", "Adobe After Effects"],
            liveUrl: "#",
            githubUrl: "#"
        },
        "Project Title Three": {
             galleryImages: [ // MODIFIED
                "placeholder-project3-large.png",
                "placeholder-project3-detail.png"
            ],
            description: "<p>Full description for Project Title Three. Elaborate on the UI/UX aspects or specific features.</p><p>Mention user testing, design iterations, or backend integration if applicable.</p>",
            tech: ["Angular", "TypeScript", "Firebase", "Bootstrap 5", "Adobe XD", "Photoshop"],
            liveUrl: "#",
            githubUrl: "#"
        },
        "Fix It In Post Studios": {
            galleryImages: [ // MODIFIED
                 // Use the same placeholder or a different one if available
                 "assets/adhomugamapp.jpg",
                 "assets/casa_raw.png",
                 "assets/casa.png",
                 "assets/diesel.png",
                 "assets/FC.png",
                 "assets/HF_APP.png",
                 "assets/NativeCraft.png",
                 "assets/Nippon.png",
                 "assets/NNN.png",
                 "assets/ook.png",

            ],
            description: "<p>Vfx compositing, and creating visually appealing and photorealistic CG object.</p>",
            tech: ["Vue.js", "CSS", "Node.js", "MongoDB"], // Example different tech
            liveUrl: "#",
            githubUrl: "#"
        },
        "RV Matrix Software Technologies Pvt Ltd": {
            galleryImages: [ // MODIFIED
                "./assets/Medikcare_webUI_design.jpg", // Use the existing path
                "./assets/Medikcare_webUI_Prototype.jpg",
                "./assets/rvm1.png",
                "./assets/rvm2.png",
                "./assets/rvm3.png",
                "./assets/rvm4.png",
                "./assets/rvm5.png",
                "./assets/rvm6.png",

            ],
            description: "<p>UI UX Design / Graphic Designer internship work.</p><p>Created various designs for web applications, focusing on user flow and visual consistency using Figma and Adobe XD.</p>",
            tech: ["Figma", "Adobe XD", "Photoshop", "UI Design Principles", "User Research (Basic)"], // Updated tech
            liveUrl: null, // Set to null or remove if no link
            githubUrl: null // Set to null or remove if no link
        }
    };

    function openModal(projectData) {
        if (!projectData) {
            console.error("Project data not found for this card.");
            return;
        }

        // --- Populate Modal Content ---

        // Populate Gallery (MODIFIED LOGIC)
        modalGalleryContainer.innerHTML = ''; // Clear previous gallery images
        if (projectData.galleryImages && projectData.galleryImages.length > 0) {
            projectData.galleryImages.forEach(imageUrl => {
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.alt = projectData.title + " gallery image"; // Alt text
                imgElement.onerror = () => { // Basic error handling
                    console.warn("Could not load image:", imageUrl);
                    imgElement.style.display = 'none';
                };
                modalGalleryContainer.appendChild(imgElement);
            });
            modalGalleryContainer.style.display = 'flex'; // Ensure container is visible
        } else {
            modalGalleryContainer.style.display = 'none'; // Hide if no images
            console.warn("No gallery images found for:", projectData.title);
        }

        // REMOVED: modalImg.src = ...
        // REMOVED: modalAllImages.src = ... (if it was being populated)

        // Populate Title and Description (No change needed here)
        modalTitle.textContent = projectData.title;
        modalDescription.innerHTML = projectData.description;

        // Populate Tech Stack (No change needed here)
        modalTechStack.innerHTML = '';
        const techHeading = modalTechStack.parentElement.querySelector('h4');
        if (projectData.tech && projectData.tech.length > 0) {
            projectData.tech.forEach(tech => {
                const li = document.createElement('li');
                li.textContent = tech;
                modalTechStack.appendChild(li);
            });
             techHeading.style.display = 'block';
        } else {
             techHeading.style.display = 'none';
        }

        // Populate Links (Improved to handle null links)
        modalLinksContainer.innerHTML = '';
        if (projectData.liveUrl && projectData.liveUrl !== '#') { // Check if URL exists and isn't just '#'
            const liveLink = document.createElement('a');
            liveLink.href = projectData.liveUrl;
            liveLink.target = '_blank';
            liveLink.rel = 'noopener noreferrer';
            liveLink.className = 'btn-project';
            liveLink.textContent = 'Live Demo';
            modalLinksContainer.appendChild(liveLink);
        }
        if (projectData.githubUrl && projectData.githubUrl !== '#') { // Check if URL exists and isn't just '#'
            const githubLink = document.createElement('a');
            githubLink.href = projectData.githubUrl;
            githubLink.target = '_blank';
            githubLink.rel = 'noopener noreferrer';
            githubLink.className = 'btn-project';
            githubLink.textContent = 'GitHub';
            modalLinksContainer.appendChild(githubLink);
        }

        // Show Modal (No change needed here)
        modalOverlay.classList.add('active');
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    // Add Click Listeners to Project Cards (No change needed here)
    projectCards.forEach(card => {
        card.addEventListener('click', (event) => {
            if (event.target.closest('a')) {
                return;
            }
            const cardTitleElement = card.querySelector('h3');
            const cardTitle = cardTitleElement ? cardTitleElement.textContent.trim() : null;
            if (cardTitle && projectDetails[cardTitle]) {
                 const dataToPass = { ...projectDetails[cardTitle], title: cardTitle }; // Pass a copy with title
                 openModal(dataToPass);
            } else {
                console.warn("Could not find details for project:", cardTitle);
            }
        });
    });

    // Add Click Listener for Modal Close Button (No change needed here)
    modalCloseBtn.addEventListener('click', closeModal);

    // Add Click Listener for Modal Overlay (No change needed here)
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    // Add Keyboard Listener (No change needed here)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // --- END OF MODAL LOGIC ---

}); // End of DOMContentLoaded