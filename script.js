/* =========================================================
   Hikmatullah — Portfolio JS
   Custom cursor · typing · reveal · counters · tilt · nav
   ========================================================= */

(() => {
    'use strict';

    /* ---------- Loader ---------- */
    const loader = document.getElementById('loader');
    let loaderDone = false;
    const finishLoader = () => {
        if (loaderDone || !loader) return;
        loaderDone = true;
        loader.classList.add('done');
        setTimeout(() => { if (loader) loader.style.display = 'none'; }, 500);
    };
    /* Hide shortly after the page loads; hard fallback so it never sticks */
    window.addEventListener('load', () => setTimeout(finishLoader, 500));
    setTimeout(finishLoader, 3000);

    /* ---------- Year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Theme toggle (dark / light) ---------- */
    const root = document.documentElement;
    const themeBtn = document.getElementById('themeToggle');
    const THEME_KEY = 'hk-theme';

    const applyTheme = (theme) => {
        if (theme === 'light') root.setAttribute('data-theme', 'light');
        else root.removeAttribute('data-theme');
    };

    const initialTheme = (() => {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'dark') return saved;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    })();
    applyTheme(initialTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', (e) => {
            const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';

            // Capture click origin for the circular ripple
            const r = themeBtn.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const endRadius = Math.hypot(
                Math.max(cx, window.innerWidth - cx),
                Math.max(cy, window.innerHeight - cy)
            );

            // Fallback when View Transitions API isn't supported
            if (!document.startViewTransition) {
                applyTheme(next);
                localStorage.setItem(THEME_KEY, next);
                return;
            }

            const transition = document.startViewTransition(() => {
                applyTheme(next);
                localStorage.setItem(THEME_KEY, next);
            });

            transition.ready.then(() => {
                document.documentElement.animate(
                    {
                        clipPath: [
                            `circle(0px at ${cx}px ${cy}px)`,
                            `circle(${endRadius}px at ${cx}px ${cy}px)`
                        ]
                    },
                    {
                        duration: 700,
                        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                        pseudoElement: '::view-transition-new(root)'
                    }
                );
            });
        });
    }

    /* Follow system changes if user hasn't picked manually */
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_KEY)) applyTheme(e.matches ? 'light' : 'dark');
    });

    /* ---------- Header scroll state ---------- */
    const header = document.getElementById('header');
    const onScroll = () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Mobile nav ---------- */
    const toggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            toggle.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navLinks.classList.remove('active');
                toggle.classList.remove('open');
            });
        });
    }

    /* ---------- Active nav link on scroll ---------- */
    const sections = document.querySelectorAll('section[id]');
    const navAs = document.querySelectorAll('.nav-link');
    const setActive = () => {
        const y = window.scrollY + 120;
        let current = '';
        sections.forEach(s => {
            if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) current = s.id;
        });
        navAs.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
        });
    };
    window.addEventListener('scroll', setActive, { passive: true });

    /* ---------- Reveal on scroll ---------- */
    const revealEls = document.querySelectorAll('.reveal, .reveal-line');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));

    /* ---------- Typed effect ---------- */
    const typedEl = document.getElementById('typed');
    if (typedEl) {
        const phrases = [
            'NestJS APIs',
            'Vue 3 apps',
            'real-time systems',
            'AI agents'
        ];
        let p = 0, c = 0, deleting = false;

        /* Reserve the height of the tallest phrase so the title never
           reflows — otherwise the whole page jumps as phrases cycle. */
        const typedLine = typedEl.closest('.line') || typedEl.parentElement;
        const reserveHeight = () => {
            if (!typedLine) return;
            const current = typedEl.textContent;
            typedLine.style.minHeight = '';
            let max = 0;
            phrases.forEach(w => {
                typedEl.textContent = w;
                if (typedLine.offsetHeight > max) max = typedLine.offsetHeight;
            });
            typedEl.textContent = current;
            typedLine.style.minHeight = max + 'px';
        };
        reserveHeight();
        window.addEventListener('resize', reserveHeight, { passive: true });
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(reserveHeight);

        const tick = () => {
            const word = phrases[p];
            typedEl.textContent = deleting ? word.substring(0, c--) : word.substring(0, c++);

            let delay = deleting ? 50 : 110;
            if (!deleting && c === word.length + 1) {
                delay = 1600;
                deleting = true;
                c = word.length;
            } else if (deleting && c === 0) {
                deleting = false;
                p = (p + 1) % phrases.length;
                delay = 220;
            }
            setTimeout(tick, delay);
        };
        tick();
    }

    /* ---------- Counter animation ---------- */
    const counters = document.querySelectorAll('[data-count]');
    const counterIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const target = parseInt(el.getAttribute('data-count'), 10);
            const duration = 1600;
            const start = performance.now();

            const step = (now) => {
                const t = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - t, 3);
                el.textContent = Math.floor(eased * target);
                if (t < 1) requestAnimationFrame(step);
                else el.textContent = target;
            };
            requestAnimationFrame(step);
            counterIO.unobserve(el);
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterIO.observe(c));
})();
