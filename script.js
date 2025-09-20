// script.js corregido - reemplázalo todo por esto

document.addEventListener("DOMContentLoaded", () => {

    // --- SCROLL SUAVE EN ENLACES INTERNOS ---
    document.querySelectorAll("header nav a").forEach(link => {
        link.addEventListener("click", e => {
            const href = link.getAttribute("href");
            if (href && href.startsWith("#")) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // --- BOTÓN PARA SUBIR ARRIBA ---
    const btnArriba = document.createElement("button");
    btnArriba.innerText = "↑";
    btnArriba.id = "btn-arriba";
    document.body.appendChild(btnArriba);

    btnArriba.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #6c63ff;
        color: white;
        border: none;
        border-radius: 50%;
        width: 45px;
        height: 45px;
        font-size: 20px;
        cursor: pointer;
        display: none;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        z-index: 1000;
        transition: transform 0.2s ease;
    `;

    btnArriba.addEventListener("mouseover", () => btnArriba.style.transform = "scale(1.2)");
    btnArriba.addEventListener("mouseout", () => btnArriba.style.transform = "scale(1)");

    window.addEventListener("scroll", () => {
        btnArriba.style.display = window.scrollY > 200 ? "block" : "none";
    });

    btnArriba.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // --- APARECER CON SCROLL (IntersectionObserver) ---
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll("#bienvenida, #porqueElegirnos, #proyectos, #contactar, .card").forEach(el => {
        el.classList.add("hidden");
        observer.observe(el);
    });

    // --- MENÚ HAMBURGUESA (usar el que está en el HTML) ---
    const menuToggle = document.getElementById("menu-toggle");
    const nav = document.querySelector("header nav ul");

    if (!menuToggle || !nav) {
        console.warn("menu-toggle o nav no encontrado. Revisa que exista <div id=\"menu-toggle\"> y <header> nav ul");
        return;
    }

    // Al clicar, solo alternamos la clase 'activo' (sin tocar styles inline)
    menuToggle.addEventListener("click", (e) => {
        e.stopPropagation(); // evitar que el click se propague y cierre inmediatamente
        nav.classList.toggle("activo");
    });

    // NO establecemos nav.style.display aquí (eso provocaba el conflicto).
    // En cambio dejamos que el CSS muestre/oculte usando '.activo'.

    // Cerrar menú si se hace clic fuera (solo en mobile)
    document.addEventListener("click", (e) => {
        if (window.innerWidth <= 768 && nav.classList.contains("activo")) {
            if (!menuToggle.contains(e.target) && !nav.contains(e.target)) {
                nav.classList.remove("activo");
            }
        }
    });

    // Ajustes al redimensionar: mostrar/ocultar icono y asegurarnos que el menú no quede abierto por accidente
    function checkWidth() {
        if (window.innerWidth <= 768) {
            // mostramos el icono hamburguesa y dejamos que el CSS oculte el menu por defecto
            menuToggle.style.display = "block";
            nav.classList.remove("activo"); // cerrar al cambiar tamaño
        } else {
            menuToggle.style.display = "none";
            nav.classList.remove("activo"); // en escritorio el CSS debe mostrar el menú normalmente
        }
    }
    checkWidth();
    window.addEventListener("resize", checkWidth);

    // --- EFECTO ESCRITURA EN EL TEXTO PRINCIPAL (ahora #eslogan) ---
    const heroText = document.querySelector("#eslogan h1");
    if (heroText) {
        const texto = heroText.innerText;
        heroText.innerText = "";
        let i = 0;
        function escribir() {
            if (i < texto.length) {
                heroText.innerHTML += texto[i] === " " ? "&nbsp;" : texto[i];
                i++;
                setTimeout(escribir, 80);
            }
        }
        escribir();
    }

    // --- EFECTO 3D EN LAS TARJETAS ---
    document.querySelectorAll(".card").forEach(card => {
        card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
        card.addEventListener("mousemove", e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateY = ((x / rect.width) - 0.5) * 10;
            const rotateX = ((y / rect.height) - 0.5) * -10;
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            card.style.boxShadow = "0 10px 20px rgba(0,0,0,0.3)";
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "rotateX(0) rotateY(0) scale(1)";
            card.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
        });
    });

    // --- AÑO AUTOMÁTICO EN EL FOOTER ---
    const footerYear = document.querySelector("footer .pieDePagina-abajo p");
    if (footerYear) {
        footerYear.innerHTML = `&copy; ${new Date().getFullYear()} KJCODE - Todos los derechos reservados`;
    }

});
