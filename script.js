
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const contactForm = document.getElementById("contactForm");
const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalIcon = document.getElementById("modalIcon");
const modalClose = document.getElementById("modalClose");
const modalOk = document.getElementById("modalOk");
const phoneInput = document.getElementById("phone");
const messageInput = document.getElementById("message");
const characterCount = document.getElementById("characterCount");
const scrollProgress = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");

const themeIcon = `
<svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path>
</svg>`;

const moonIcon = `
<svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
    <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"></path>
</svg>`;

function getSavedTheme() {
    try {
        return localStorage.getItem("portfolio-theme");
    } catch {
        return null;
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem("portfolio-theme", theme);
    } catch {
        return;
    }
}

function applyTheme(theme) {
    const selectedTheme = theme === "light" ? "light" : "dark";

    root.dataset.theme = selectedTheme;
    themeToggle.innerHTML = selectedTheme === "dark" ? themeIcon : moonIcon;
    themeToggle.setAttribute(
        "aria-label",
        selectedTheme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
    );

    const themeColor = document.querySelector('meta[name="theme-color"]');

    if (themeColor) {
        themeColor.content = selectedTheme === "dark" ? "#10071d" : "#f8f5ff";
    }
}

applyTheme(
    getSavedTheme() ||
    (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
);

themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    saveTheme(nextTheme);
});

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
}

document.querySelectorAll(".nav-link, .logo, .hero-actions a, .scroll-indicator").forEach(link => {
    link.addEventListener("click", () => closeMenu());
});

document.addEventListener("click", event => {
    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMenu();
    }
});

const typingText = document.getElementById("typingText");
const phrases = ["Web.", "Front-end.", "Criativo.", "em evolução."];
let phraseIndex = 0;
let characterIndex = 0;
let deleting = false;

function typeEffect() {
    const phrase = phrases[phraseIndex];

    typingText.textContent = phrase.substring(0, characterIndex);

    let delay = deleting ? 45 : 90;

    if (!deleting && characterIndex < phrase.length) {
        characterIndex++;
    } else if (deleting && characterIndex > 0) {
        characterIndex--;
    } else if (!deleting) {
        deleting = true;
        delay = 1200;
    } else {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 300;
    }

    window.setTimeout(typeEffect, delay);
}

typeEffect();

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: "0px 0px -25px 0px"
});

document.querySelectorAll(".reveal").forEach(element => {
    revealObserver.observe(element);
});

const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const level = Math.min(100, Math.max(0, Number(bar.dataset.level) || 0));

            bar.style.width = `${level}%`;
            skillObserver.unobserve(bar);
        }
    });
}, {
    threshold: 0.3
});

document.querySelectorAll(".skill-fill").forEach(bar => {
    skillObserver.observe(bar);
});

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const target = Number(element.dataset.count);
        const duration = 1300;
        const startTime = performance.now();

        function updateCounter(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);

            element.textContent = Math.floor(target * eased).toLocaleString("pt-BR");

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString("pt-BR");
            }
        }

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(element);
    });
}, {
    threshold: 0.6
});

document.querySelectorAll("[data-count]").forEach(counter => {
    counterObserver.observe(counter);
});

const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navItems.forEach(link => {
                const isActive = link.getAttribute("href") === `#${entry.target.id}`;

                link.classList.toggle("active", isActive);

                if (isActive) {
                    link.setAttribute("aria-current", "location");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        }
    });
}, {
    rootMargin: "-30% 0px -60% 0px",
    threshold: 0
});

sections.forEach(section => sectionObserver.observe(section));

let scrollTicking = false;

function updateScrollUI() {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;

    scrollProgress.style.width = `${progress}%`;
    backToTop.classList.toggle("visible", window.scrollY > 450);

    scrollTicking = false;
}

window.addEventListener("scroll", () => {
    if (!scrollTicking) {
        requestAnimationFrame(updateScrollUI);
        scrollTicking = true;
    }
}, { passive: true });

updateScrollUI();

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
});

const heroVisual = document.querySelector(".hero-visual");
const profileCard = document.querySelector(".profile-card");
const orbits = document.querySelectorAll(".orbit");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (heroVisual && profileCard && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion.matches) {
    heroVisual.addEventListener("pointermove", event => {
        const rect = heroVisual.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        profileCard.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 9}deg)`;

        orbits.forEach((orbit, index) => {
            const multiplier = index === 0 ? 12 : -9;
            orbit.style.transform = `translate(${x * multiplier}px, ${y * multiplier}px)`;
        });
    });

    heroVisual.addEventListener("pointerleave", () => {
        profileCard.style.transform = "";
        orbits.forEach(orbit => {
            orbit.style.transform = "";
        });
    });
}

phoneInput.addEventListener("input", () => {
    let digits = phoneInput.value.replace(/\D/g, "").slice(0, 11);

    if (digits.length > 10) {
        digits = digits.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
    } else if (digits.length > 6) {
        digits = digits.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (digits.length > 2) {
        digits = digits.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else if (digits.length > 0) {
        digits = digits.replace(/^(\d{0,2})/, "($1");
    }

    phoneInput.value = digits;
});

messageInput.addEventListener("input", () => {
    characterCount.textContent = `${messageInput.value.length}/2000`;
});

const validationRules = {
    name: value => value.trim().split(/\s+/).join(" ").length >= 3
        ? ""
        : "Informe seu nome com pelo menos 3 caracteres.",

    email: value => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
        ? ""
        : "Informe um e-mail válido.",

    phone: value => {
        const digits = value.replace(/\D/g, "");
        return digits.length === 10 || digits.length === 11
            ? ""
            : "Informe um telefone com DDD válido.";
    },

    subject: value => value
        ? ""
        : "Selecione um assunto.",

    message: value => value.trim().length >= 10
        ? ""
        : "Escreva uma mensagem com pelo menos 10 caracteres."
};

function validateField(name) {
    const field = contactForm.elements[name];
    const errorElement = document.getElementById(`${name}Error`);
    const error = validationRules[name](field.value);

    errorElement.textContent = error;
    field.classList.toggle("invalid", Boolean(error));
    field.setAttribute("aria-invalid", String(Boolean(error)));

    return !error;
}

Object.keys(validationRules).forEach(name => {
    const field = contactForm.elements[name];

    field.addEventListener("blur", () => validateField(name));

    field.addEventListener("input", () => {
        if (field.classList.contains("invalid")) {
            validateField(name);
        }
    });

    field.addEventListener("change", () => {
        if (field.classList.contains("invalid")) {
            validateField(name);
        }
    });
});

function openModal(title, message, success = true) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalIcon.textContent = success ? "✓" : "!";
    modalIcon.style.color = success ? "var(--accent-light)" : "#f87171";

    modalOverlay.classList.add("open");
    modalOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    modalOk.focus();
}

function closeModal() {
    modalOverlay.classList.remove("open");
    modalOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);
modalOk.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", event => {
    if (event.target === modalOverlay) {
        closeModal();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modalOverlay.classList.contains("open")) {
        closeModal();
    }
});

contactForm.addEventListener("submit", event => {
    event.preventDefault();

    const fieldsAreValid = Object.keys(validationRules).map(validateField).every(Boolean);

    if (!fieldsAreValid) {
        const firstInvalid = contactForm.querySelector(".invalid");

        if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({
                behavior: reducedMotion.matches ? "auto" : "smooth",
                block: "center"
            });
        }

        openModal(
            "Confira os campos",
            "Algumas informações precisam ser corrigidas antes de continuar.",
            false
        );

        return;
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get("name")).trim();

    openModal(
        "Formulário validado!",
        `Obrigado, ${name}! Os dados estão válidos. Para enviar a mensagem de verdade, é necessário conectar o formulário a um serviço de envio.`,
        true
    );
});

document.getElementById("currentYear").textContent = new Date().getFullYear();
