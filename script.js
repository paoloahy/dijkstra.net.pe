document.addEventListener('DOMContentLoaded', () => {
    
// 1. Interceptar clics en enlaces con anclas (#) de forma inteligente
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Obtenemos la ruta y el ancla exacta del enlace clickeado
            const linkPath = this.pathname;
            const currentPath = window.location.pathname;
            const hash = this.hash;

            // Si no hay hash o es solo '#', lo ignoramos
            if (!hash || hash === '#') return;

            // Comprobamos si el enlace apunta a la misma página en la que estamos
            // (Esto cubre los casos donde la ruta es "/" o "/index.html")
            const isSamePage = linkPath === currentPath || 
                               (currentPath === '/' && linkPath === '/index.html') || 
                               (currentPath === '/index.html' && linkPath === '/');

            if (isSamePage) {
                const targetElement = document.querySelector(hash);
                
                if (targetElement) {
                    // Prevenimos el comportamiento nativo (que pone el # en la URL)
                    e.preventDefault(); 
                    
                    // Hacemos el scroll suave
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // 2. Limpiar la URL si el usuario viene de OTRA página
    // (Ej: Si estaba en glpi.html y hace clic en index.html#nosotros)
    if (window.location.hash) {
        setTimeout(() => {
            // Borra el # de la barra de direcciones sin recargar la página
            history.replaceState(null, null, window.location.pathname);
        }, 100); // Pequeño retraso para dejar que el navegador salte primero
    }

    // --- 1. Cambio de color del Header al hacer Scroll ---
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            // Estado con Scroll: Azul oscuro y textos blancos
            header.classList.remove('bg-white', 'text-brand-navy', 'border-slate-200');
            header.classList.add('bg-brand-navy/95', 'text-white', 'shadow-lg', 'border-white/5');
        } else {
            // Estado Arriba (Top): Blanco y textos oscuros corporativos
            header.classList.add('bg-white', 'text-brand-navy', 'border-slate-200');
            header.classList.remove('bg-brand-navy/95', 'text-white', 'shadow-lg', 'border-white/5');
        }
    });

    // --- 2. Animaciones Reveal (Scroll) ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) { 
                entry.target.classList.add('active'); 
            }
        });
    }, { 
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px" 
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 3. Lógica del Menú Lateral (Sidebar/Drawer) ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isMenuOpen = false;

    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            // Abrir menú: deslizar desde la derecha (quitar translate-x-full)
            mobileMenu.classList.remove('translate-x-full');
            mobileMenu.classList.add('translate-x-0');
            
            // Mostrar fondo oscuro
            mobileOverlay.classList.remove('hidden');
            // Pequeño timeout para que la transición de opacidad funcione
            setTimeout(() => {
                mobileOverlay.classList.remove('opacity-0');
                mobileOverlay.classList.add('opacity-100');
            }, 10);
            
            // Bloquear scroll de la página de fondo
            document.body.style.overflow = 'hidden';
        } else {
            // Cerrar menú: deslizar hacia la derecha
            mobileMenu.classList.add('translate-x-full');
            mobileMenu.classList.remove('translate-x-0');
            
            // Ocultar fondo oscuro
            mobileOverlay.classList.remove('opacity-100');
            mobileOverlay.classList.add('opacity-0');
            setTimeout(() => {
                mobileOverlay.classList.add('hidden');
            }, 300); // Esperar a que termine la transición de opacidad
            
            // Restaurar scroll
            document.body.style.overflow = '';
        }
    };

    // Eventos de abrir y cerrar
    if (mobileBtn) mobileBtn.addEventListener('click', toggleMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);
    
    // Cerrar al hacer clic en el fondo oscuro
    if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMenu);

    // Cerrar automáticamente al hacer clic en un enlace del menú
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });

    // Lógica para desplegar el submenú de "Servicios" en móviles
    const mobileServiciosBtn = document.getElementById('mobile-servicios-btn');
    const mobileServiciosMenu = document.getElementById('mobile-servicios-menu');
    const mobileServiciosIcon = document.getElementById('mobile-servicios-icon');

    if (mobileServiciosBtn) {
        mobileServiciosBtn.addEventListener('click', () => {
            // Alterna entre mostrar y ocultar el submenú
            mobileServiciosMenu.classList.toggle('hidden');
            mobileServiciosMenu.classList.toggle('flex');
            
            // Gira la flechita 180 grados
            mobileServiciosIcon.classList.toggle('rotate-180');
        });
    }

    
});