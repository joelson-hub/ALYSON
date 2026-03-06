// CONTROLE DA TIMELINE
const timelineSection = document.querySelector('.timeline-section');
const timelineProgress = document.getElementById('lineProgress');
const timelineItems = document.querySelectorAll('.timeline-item');

function updateTimeline() {
    if(!timelineSection) return;
    
    const sectionTop = timelineSection.offsetTop;
    const sectionHeight = timelineSection.offsetHeight;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Cálculo da porcentagem da barra de progresso
    let pct = (scrollY + windowHeight / 2 - sectionTop) / (sectionHeight * 0.8) * 100;
    pct = Math.max(0, Math.min(100, pct));
    
    if(timelineProgress) {
        timelineProgress.style.height = pct + '%';
    }

    // Ativação dos itens conforme o scroll
    timelineItems.forEach(item => {
        const top = item.getBoundingClientRect().top;
        if (top < windowHeight / 1.5) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// CONTADORES NUMÉRICOS
const statEls = document.querySelectorAll('.stat-number[data-target]');

const fmt = (n) => {
    if (n >= 1_000_000) return '+' + (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return '+' + (n / 1_000).toFixed(1) + 'K';
    return '+' + n;
};

const runCounter = (el) => {
    const end = parseInt(el.dataset.target);
    let start = null;
    const dur = 2000;
    
    const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3); // Easing suave
        el.textContent = fmt(Math.floor(ease * end));
        if (p < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = fmt(end);
        }
    };
    requestAnimationFrame(step);
};

// Intersection Observer para disparar animações quando visíveis
const observerOptions = {
    threshold: 0.2
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            runCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Iniciar contadores
    statEls.forEach(el => {
        el.textContent = '+0';
        counterObserver.observe(el);
    });

    // Iniciar Timeline
    updateTimeline();
});

window.addEventListener('scroll', updateTimeline, { passive: true });
