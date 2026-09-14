const menuButton = document.querySelector("#menu-button");
const mobileMenu = document.querySelector("#mobile-menu");

menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");

    const isOpen = !mobileMenu.classList.contains("hidden");

    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menú" : "Abrir menú"
    );

    const menuIcon = document.querySelector("#menu-icon")
    menuIcon.setAttribute(
        "data-lucide",
        isOpen ? "x" : "menu"
    );

    lucide.createIcons();
});