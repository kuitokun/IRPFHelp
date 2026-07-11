const backToTop = document.getElementById("backToTop");

// Guard: si el botón todavía no existe en el HTML, no rompemos el resto del script
if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// ===== TOOLTIPS DE LA TABLA IRPF (hover en desktop, tap en mobile) =====

// Solo nos interesan las celdas que realmente tienen un tooltip adentro
const celdasConTooltip = document.querySelectorAll(".irpf-table td.valor-dato:has(.tooltip-texto)");

// El tooltip usa position:fixed, así que hay que calcular su posición en pantalla
// a mano (si no, queda recortado por el overflow-x:auto del contenedor de la tabla)
const posicionarTooltip = (celda) => {
    const tooltip = celda.querySelector(".tooltip-texto");
    if (!tooltip) return;

    const rect = celda.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top}px`;
};

const cerrarTodosLosTooltips = () => {
    celdasConTooltip.forEach((c) => c.classList.remove("activo"));
};

const soportaHover = window.matchMedia("(hover: hover)").matches;

celdasConTooltip.forEach((celda) => {
    // Tap / click (principalmente mobile, pero funciona en cualquier lado)
    celda.addEventListener("click", (e) => {
        e.stopPropagation();

        const yaEstabaActiva = celda.classList.contains("activo");
        cerrarTodosLosTooltips();

        if (!yaEstabaActiva) {
            posicionarTooltip(celda);
            celda.classList.add("activo");
        }
    });

    // Hover (solo en dispositivos que realmente soportan hover, para no pisar el tap)
    if (soportaHover) {
        celda.addEventListener("mouseenter", () => {
            cerrarTodosLosTooltips();
            posicionarTooltip(celda);
            celda.classList.add("activo");
        });

        celda.addEventListener("mouseleave", () => {
            celda.classList.remove("activo");
        });
    }
});

// Cierra el tooltip si se toca en cualquier otro lado de la pantalla
document.addEventListener("click", () => {
    cerrarTodosLosTooltips();
});

// Como el tooltip es position:fixed, si se hace scroll (la página o el
// contenedor de la tabla) hay que recalcular dónde cae en pantalla
const reposicionarTooltipActivo = () => {
    const celdaActiva = document.querySelector(".irpf-table td.valor-dato.activo");
    if (celdaActiva) posicionarTooltip(celdaActiva);
};

window.addEventListener("scroll", reposicionarTooltipActivo, true);
window.addEventListener("resize", reposicionarTooltipActivo);

// ===== GATITO SORPRESA =====
// Aparece cada tanto en una esquina, con un gatito hecho con ASCII

const gatoAscii = ` /\\_/\\
( ^.^ )   ¡Kia!
 > ^ <`;

const gatitoPopup = document.createElement("div");
gatitoPopup.className = "gatito-popup";
gatitoPopup.innerHTML = `<pre>${gatoAscii}</pre>`;
gatitoPopup.title = "Miau";
document.body.appendChild(gatitoPopup);

// Se puede cerrar antes de tiempo tocándolo
gatitoPopup.addEventListener("click", () => {
    gatitoPopup.classList.remove("visible");
});

const mostrarGatito = () => {
    gatitoPopup.classList.add("visible");
    setTimeout(() => {
        gatitoPopup.classList.remove("visible");
    }, 4000);
};

// "Miaus" random que van apareciendo antes del gatito, cada vez más seguido
// a medida que se acerca el momento en que aparece (efecto "se está acercando")
const miauTextos = ["miau", "Miau!", "miau miau", "¿miau?", "MIAU", "miau~"];

// Colores vivos que contrastan con el fondo oscuro del sitio
const miauColores = ["#F472B6", "#FBBF24", "#34D399", "#F87171", "#A78BFA"];

const mostrarMiauFlotante = () => {
    const miau = document.createElement("span");
    miau.className = "miau-flotante";
    miau.textContent = miauTextos[Math.floor(Math.random() * miauTextos.length)];

    // Posición aleatoria en la pantalla
    miau.style.left = `${5 + Math.random() * 85}%`;
    miau.style.top = `${10 + Math.random() * 70}%`;

    // Color random con contraste, y rotación random para que salga "torcidito"
    miau.style.color = miauColores[Math.floor(Math.random() * miauColores.length)];
    const rotacion = (Math.random() * 30 - 15) + (Math.random() < 0.5 ? -10 : 10); // entre ~-25° y 25°
    miau.style.setProperty("--miau-rot", `${rotacion}deg`);

    document.body.appendChild(miau);

    // Se autodestruye cuando termina la animación
    setTimeout(() => miau.remove(), 1800);
};

const programarMiausPrevios = (tiempoHastaGatito) => {
    const cantidad = 3 + Math.floor(Math.random() * 4); // entre 3 y 6 miaus

    for (let i = 1; i <= cantidad; i++) {
        // Se agrupan cada vez más cerca del final de la espera
        const proporcion = 0.35 + (0.6 * i) / cantidad;
        const momento = tiempoHastaGatito * proporcion + (Math.random() * 2000 - 1000);
        setTimeout(mostrarMiauFlotante, Math.max(500, momento));
    }
};

const programarProximoGatito = () => {
    // Aparece en un momento aleatorio, entre 40 y 90 segundos
    const espera = 40000 + Math.random() * 50000;
    programarMiausPrevios(espera);
    setTimeout(() => {
        mostrarGatito();
        programarProximoGatito();
    }, espera);
};

programarProximoGatito();

// ===== CARRUSEL DE IMÁGENES =====
// Soporta varios carruseles en la página (cada uno con [data-carousel])

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(track.children);
    const dots = Array.from(carousel.querySelectorAll(".carousel-dot"));
    const prevBtn = carousel.querySelector(".carousel-prev");
    const nextBtn = carousel.querySelector(".carousel-next");

    let indiceActual = 0;

    const irASlide = (indice) => {
        indiceActual = (indice + slides.length) % slides.length;
        track.style.transform = `translateX(-${indiceActual * 100}%)`;

        dots.forEach((dot, i) => dot.classList.toggle("active", i === indiceActual));
    };

    prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        irASlide(indiceActual - 1);
    });

    nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        irASlide(indiceActual + 1);
    });

    dots.forEach((dot, i) => {
        dot.addEventListener("click", (e) => {
            e.preventDefault();
            irASlide(i);
        });
    });

    // Swipe táctil básico para mobile
    let xInicio = null;

    track.addEventListener("touchstart", (e) => {
        xInicio = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
        if (xInicio === null) return;
        const xFin = e.changedTouches[0].clientX;
        const diferencia = xInicio - xFin;

        if (Math.abs(diferencia) > 40) {
            diferencia > 0 ? irASlide(indiceActual + 1) : irASlide(indiceActual - 1);
        }
        xInicio = null;
    });
});