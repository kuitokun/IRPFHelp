const backToTop = document.getElementById("backToTop");

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

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