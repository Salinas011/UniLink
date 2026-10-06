function createButton({
  text,
  type = "primary",
  href = "#",
  icon = null
}) {
  const styles = {
    primary:
      "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 active:scale-95 md:text-base",

    secondary:
      "inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-5 py-3 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 active:scale-95 md:text-base",

    text:
      "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 active:scale-95 md:text-base"
  };

  return `
    <a
      href="${href}"
      class="${styles[type]}"
    >
      <span>${text}</span>

      ${
        icon
          ? `<i data-lucide="${icon}" class="h-5 w-5"></i>`
          : ""
      }
    </a>
  `;
}

function initializeHome() {
  const heroButtons = document.querySelector("#hero-buttons");

  if (!heroButtons) return;

  heroButtons.innerHTML = `
    ${createButton({
      text: "Explorar oportunidades",
      type: "primary",
      href: "pages/opportunities.html",
      icon: "arrow-right"
    })}

    ${createButton({
      text: "Publicar un proyecto",
      type: "secondary",
      href: "pages/project.html"
    })}
  `;

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

async function loadComponent(selector, path) {
  const element = document.querySelector(selector);

  if (!element) return;

  try {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`No se pudo cargar: ${path}`);
    }

    element.innerHTML = await response.text();

  } catch (error) {
    console.error(error);
  }
}

function initializeNavbar() {
  const menuButton = document.querySelector("#menu-button");
  const mobileMenu = document.querySelector("#mobile-menu");

  if (!menuButton || !mobileMenu) return;

  menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");

    const isOpen = !mobileMenu.classList.contains("hidden");

    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menú" : "Abrir menú"
    );

    const menuIcon = document.querySelector("#menu-icon");

    if (menuIcon) {
      menuIcon.setAttribute(
        "data-lucide",
        isOpen ? "x" : "menu"
      );

      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    }
  });
}

function initializeYear() {
  const year = document.querySelector("#year");

  if (!year) return;

  year.textContent = new Date().getFullYear();
}

// Evento de inicio
document.addEventListener("DOMContentLoaded", async () => {

  const isPageInsidePages = window.location.pathname.includes("/pages/");

  const componentPath = isPageInsidePages
    ? "../js/components/"
    : "js/components/";

  await loadComponent("#navBar", `${componentPath}navbar.html`);
  await loadComponent("#footer", `${componentPath}footer.html`);

  initializeNavbar();
  initializeYear();
  
  // AQUÍ SE EJECUTA LA CARGA DE BOTONES DEL HERO
  initializeHome();

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
});