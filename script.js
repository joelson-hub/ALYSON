// TIMELINE - Controle de progresso e ativação de itens
const timelineSection = document.querySelector('.timeline-section');
const timelineProgress = document.getElementById('lineProgress');
const timelineItems = document.querySelectorAll('.timeline-item');

function updateTimeline() {
    if (!timelineSection) return;
    
    const sectionTop = timelineSection.offsetTop;
    const sectionHeight = timelineSection.offsetHeight;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    let pct = (scrollY + windowHeight / 2 - sectionTop) / (sectionHeight * 0.8) * 100;
    pct = Math.max(0, Math.min(100, pct));
    
    if (timelineProgress) {
        timelineProgress.style.height = pct + '%';
    }

    timelineItems.forEach(item => {
        const top = item.getBoundingClientRect().top;
        if (top < windowHeight / 1.5) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', updateTimeline, { passive: true });
window.addEventListener('load', updateTimeline);

// CONTADORES - Efeito de números subindo
const statEls = document.querySelectorAll('.stat-number[data-target]');

// Formatação dos números (K para mil, M para milhões)
const fmt = (n) => {
    if (n >= 1_000_000) return '+' + (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return '+' + (n / 1_000).toFixed(1) + 'K';
    return '+' + n;
};

const runCounter = (el) => {
    const end = parseInt(el.dataset.target);
    let start = null;
    const dur = 2000; // 2 segundos de duração

    const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3); // Easing cúbico
        el.textContent = fmt(Math.floor(ease * end));
        if (p < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = fmt(end);
        }
    };
    requestAnimationFrame(step);
};

// Observador para iniciar a contagem apenas quando estiver visível
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
    });
}, { threshold: 0.2 });

statEls.forEach(el => {
    el.textContent = '+0';
    counterObserver.observe(el);
});