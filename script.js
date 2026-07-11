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

// ===== TOOLTIPS DE LA TABLA IRPF (soporte para tap en mobile) =====

// Solo nos interesan las celdas que realmente tienen un tooltip adentro
const celdasConTooltip = document.querySelectorAll(".irpf-table td.valor-dato:has(.tooltip-texto)");

celdasConTooltip.forEach((celda) => {
    celda.addEventListener("click", (e) => {
        e.stopPropagation();

        const yaEstabaActiva = celda.classList.contains("activo");

        // Cierra cualquier otro tooltip abierto antes de abrir este
        celdasConTooltip.forEach((otra) => otra.classList.remove("activo"));

        // Si no estaba activa, la activamos (si ya estaba, queda cerrada)
        if (!yaEstabaActiva) {
            celda.classList.add("activo");
        }
    });
});

// Cierra el tooltip si se toca en cualquier otro lado de la pantalla
document.addEventListener("click", () => {
    celdasConTooltip.forEach((celda) => celda.classList.remove("activo"));
});

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