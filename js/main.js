/* ========================================
   RESPIREGUARD - MAIN JAVASCRIPT
   ======================================== */

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initNavigation();
    initHeroCanvas();
    initScrollAnimations();
    initCounterAnimations();
    initInnovationAnimations();
    initGalleryViewer();
    initCharts();
    initTimeline();
    initContactForm();
});

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    if (!cursor || !cursorDot) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        // Smooth cursor follow
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // Dot follows faster
        dotX += (mouseX - dotX) * 0.2;
        dotY += (mouseY - dotY) * 0.2;
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Magnetic effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .glass-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = '#3B82F6';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '#00D9FF';
        });
    });
}

// ===== NAVIGATION =====
function initNavigation() {
    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!nav) return;
    
    // Scroll behavior
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ===== HERO 3D CANVAS (THREE.JS) =====
function initHeroCanvas() {
    const container = document.getElementById('hero-canvas-container');
    if (!container || typeof THREE === 'undefined') return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    camera.position.z = 50;
    
    // Particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x00D9FF,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // 3D Mask placeholder (torus for now)
    const torusGeometry = new THREE.TorusGeometry(8, 3, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({
        color: 0x00D9FF,
        emissive: 0x00D9FF,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.7
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x00D9FF, 2);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate particles
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;
        
        // Rotate torus
        torus.rotation.x += 0.01;
        torus.rotation.y += 0.005;
        
        // Mouse parallax
        camera.position.x = mouseX * 5;
        camera.position.y = mouseY * 5;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// ===== GSAP SCROLL ANIMATIONS =====
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Fade in elements
    gsap.utils.toArray('.glass-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out'
        });
    });
    
    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power2.out'
        });
    });
    
    // Parallax sections
    gsap.utils.toArray('.section').forEach(section => {
        gsap.to(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: -50,
            ease: 'none'
        });
    });
}

// ===== COUNTER ANIMATIONS =====
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-value, .stat-number');
    
    const animateCounter = (counter) => {
        const target = parseFloat(counter.getAttribute('data-value'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target % 1 === 0 ? target : target.toFixed(1);
            }
        };
        
        updateCounter();
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ===== INNOVATION COMPONENT ASSEMBLY =====
function initInnovationAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    const componentLayers = document.querySelectorAll('.component-layer');
    
    componentLayers.forEach((layer, index) => {
        gsap.to(layer, {
            scrollTrigger: {
                trigger: '#componentAssembly',
                start: 'top 60%',
                end: 'bottom 40%',
                scrub: 1
            },
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            delay: index * 0.2,
            ease: 'power2.out'
        });
    });
}

// ===== GALLERY 3D VIEWER =====
function initGalleryViewer() {
    const container = document.getElementById('model-viewer-container');
    if (!container || typeof THREE === 'undefined') return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x0A0E27, 1);
    container.appendChild(renderer.domElement);
    
    camera.position.z = 30;
    
    // Create a stylized mask shape (combination of geometries)
    const group = new THREE.Group();
    
    // Main body
    const bodyGeometry = new THREE.SphereGeometry(5, 32, 32, 0, Math.PI);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x00D9FF,
        emissive: 0x00D9FF,
        emissiveIntensity: 0.3,
        shininess: 100,
        transparent: true,
        opacity: 0.9
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);
    
    // Filters (cylinders)
    const filterGeometry = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
    const filterMaterial = new THREE.MeshPhongMaterial({
        color: 0x3B82F6,
        emissive: 0x3B82F6,
        emissiveIntensity: 0.2,
        shininess: 100
    });
    const filterLeft = new THREE.Mesh(filterGeometry, filterMaterial);
    filterLeft.position.set(-3, 0, 2);
    filterLeft.rotation.z = Math.PI / 2;
    group.add(filterLeft);
    
    const filterRight = new THREE.Mesh(filterGeometry, filterMaterial);
    filterRight.position.set(3, 0, 2);
    filterRight.rotation.z = Math.PI / 2;
    group.add(filterRight);
    
    scene.add(group);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x00D9FF, 1.5);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x3B82F6, 1);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);
    
    // Auto rotation
    let isRotating = true;
    let rotationSpeed = 0.005;
    
    function animate() {
        requestAnimationFrame(animate);
        
        if (isRotating) {
            group.rotation.y += rotationSpeed;
            group.rotation.x = Math.sin(group.rotation.y) * 0.1;
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Controls
    document.getElementById('rotateLeft')?.addEventListener('click', () => {
        gsap.to(group.rotation, { y: group.rotation.y - Math.PI / 4, duration: 0.5 });
    });
    
    document.getElementById('rotateRight')?.addEventListener('click', () => {
        gsap.to(group.rotation, { y: group.rotation.y + Math.PI / 4, duration: 0.5 });
    });
    
    document.getElementById('zoomIn')?.addEventListener('click', () => {
        gsap.to(camera.position, { z: camera.position.z - 5, duration: 0.5 });
    });
    
    document.getElementById('zoomOut')?.addEventListener('click', () => {
        gsap.to(camera.position, { z: camera.position.z + 5, duration: 0.5 });
    });
    
    document.getElementById('resetView')?.addEventListener('click', () => {
        gsap.to(camera.position, { z: 30, duration: 0.5 });
        gsap.to(group.rotation, { x: 0, y: 0, z: 0, duration: 0.5 });
    });
    
    // Mouse interaction
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        isRotating = false;
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
    });
    
    container.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - previousMouseX;
            const deltaY = e.clientY - previousMouseY;
            
            group.rotation.y += deltaX * 0.01;
            group.rotation.x += deltaY * 0.01;
            
            previousMouseX = e.clientX;
            previousMouseY = e.clientY;
        }
    });
    
    container.addEventListener('mouseup', () => {
        isDragging = false;
        setTimeout(() => { isRotating = true; }, 1000);
    });
    
    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// ===== CHARTS (CHART.JS) =====
function initCharts() {
    if (typeof Chart === 'undefined') return;
    
    // Filtration Efficiency Chart
    const filtrationCtx = document.getElementById('filtrationChart');
    if (filtrationCtx) {
        new Chart(filtrationCtx, {
            type: 'radar',
            data: {
                labels: ['Pollen', 'PM2.5', 'PM10', 'Dust', 'Allergens', 'VOCs'],
                datasets: [
                    {
                        label: 'RespireGuard',
                        data: [99.9, 99.5, 99.8, 99.7, 99.9, 95],
                        backgroundColor: 'rgba(0, 217, 255, 0.2)',
                        borderColor: 'rgba(0, 217, 255, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(0, 217, 255, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(0, 217, 255, 1)'
                    },
                    {
                        label: 'N95 Mask',
                        data: [95, 95, 95, 95, 90, 70],
                        backgroundColor: 'rgba(139, 146, 176, 0.1)',
                        borderColor: 'rgba(139, 146, 176, 0.5)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(139, 146, 176, 0.5)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(139, 146, 176, 1)'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#FFFFFF', font: { size: 14 } }
                    },
                    title: {
                        display: true,
                        text: 'Filtration Efficiency Comparison (%)',
                        color: '#00D9FF',
                        font: { size: 18, weight: 'bold' }
                    }
                },
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: { color: '#8B92B0', font: { size: 12 } },
                        ticks: { color: '#8B92B0', backdropColor: 'transparent' },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });
    }
    
    // Comfort Score Chart
    const comfortCtx = document.getElementById('comfortChart');
    if (comfortCtx) {
        new Chart(comfortCtx, {
            type: 'bar',
            data: {
                labels: ['Breathability', 'Fit Comfort', 'Weight', 'Skin Contact', 'Long-term Wear'],
                datasets: [
                    {
                        label: 'RespireGuard',
                        data: [92, 88, 90, 85, 87],
                        backgroundColor: 'rgba(0, 217, 255, 0.7)',
                        borderColor: 'rgba(0, 217, 255, 1)',
                        borderWidth: 2
                    },
                    {
                        label: 'Traditional Masks',
                        data: [60, 65, 70, 60, 50],
                        backgroundColor: 'rgba(139, 146, 176, 0.3)',
                        borderColor: 'rgba(139, 146, 176, 0.5)',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#FFFFFF', font: { size: 14 } }
                    },
                    title: {
                        display: true,
                        text: 'Comfort Score Comparison (out of 100)',
                        color: '#3B82F6',
                        font: { size: 18, weight: 'bold' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#8B92B0' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#8B92B0' },
                        grid: { display: false }
                    }
                }
            }
        });
    }
}

// ===== TIMELINE HORIZONTAL SCROLL =====
function initTimeline() {
    const scrollContainer = document.querySelector('.timeline-scroll-container');
    const leftBtn = document.getElementById('timelineLeft');
    const rightBtn = document.getElementById('timelineRight');
    
    if (!scrollContainer) return;
    
    leftBtn?.addEventListener('click', () => {
        scrollContainer.scrollBy({ left: -400, behavior: 'smooth' });
    });
    
    rightBtn?.addEventListener('click', () => {
        scrollContainer.scrollBy({ left: 400, behavior: 'smooth' });
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: form.name.value,
            email: form.email.value,
            subject: form.subject.value,
            message: form.message.value
        };
        
        console.log('Form submitted:', formData);
        
        // Success message
        alert('Thank you for your message! We\'ll get back to you soon.');
        form.reset();
    });
}

// ===== UTILITY: Smooth scroll to top =====
window.scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};