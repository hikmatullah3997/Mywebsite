/* =========================================================
   Hikmatullah — Portfolio JS
   Custom cursor · typing · reveal · counters · tilt · nav
   ========================================================= */

(() => {
    'use strict';

    /* ---------- Loader ---------- */
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        setTimeout(() => loader && loader.classList.add('done'), 1500);
    });

    /* ---------- Year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Custom cursor ---------- */
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let rx = mx, ry = my;

        window.addEventListener('mousemove', (e) => {
            mx = e.clientX; my = e.clientY;
            dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
        });

        const animateRing = () => {
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;
            ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateRing);
        };
        animateRing();

        document.querySelectorAll('a, button, .tilt, .magnetic, .skill, .portfolio-item, .service-item').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hover'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
        });
    }

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

    /* ---------- Magnetic buttons ---------- */
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    /* ---------- 3D tilt cards ---------- */
    document.querySelectorAll('.tilt').forEach(card => {
        const max = 8;
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            const rx = (py - 0.5) * -max * 2;
            const ry = (px - 0.5) * max * 2;
            card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* ---------- Parallax orbs (subtle) ---------- */
    const orbs = document.querySelectorAll('.orb');
    if (orbs.length && window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5);
            const y = (e.clientY / window.innerHeight - 0.5);
            orbs.forEach((o, i) => {
                const factor = (i + 1) * 12;
                o.style.translate = `${x * factor}px ${y * factor}px`;
            });
        });
    }
})();
