// ==========================================
// LOAD COMPONENT
// ==========================================

async function loadComponent(
  selector,
  path
) {

  const element =
    document.querySelector(selector);


  if (!element) return;


  try {

    const response =
      await fetch(path);


    if (!response.ok) {

      throw new Error(
        `No se pudo cargar: ${path}`
      );

    }


    element.innerHTML =
      await response.text();


  } catch (error) {

    console.error(error);

  }

}


// ==========================================
// NAVBAR
// ==========================================

function initializeNavbar() {

  const menuButton =
    document.querySelector(
      "#menu-button"
    );


  const mobileMenu =
    document.querySelector(
      "#mobile-menu"
    );


  if (
    !menuButton ||
    !mobileMenu
  ) {
    return;
  }


  menuButton.addEventListener(
    "click",
    () => {

      mobileMenu.classList.toggle(
        "hidden"
      );


      const isOpen =
        !mobileMenu.classList.contains(
          "hidden"
        );


      menuButton.setAttribute(
        "aria-expanded",
        isOpen
      );


      menuButton.setAttribute(
        "aria-label",
        isOpen
          ? "Cerrar menú"
          : "Abrir menú"
      );


      const menuIcon =
        document.querySelector(
          "#menu-icon"
        );


      if (menuIcon) {

        menuIcon.setAttribute(
          "data-lucide",
          isOpen
            ? "x"
            : "menu"
        );


        if (
          typeof lucide !==
          "undefined"
        ) {

          lucide.createIcons();

        }

      }

    }
  );

}


// ==========================================
// YEAR
// ==========================================

function initializeYear() {

  const year =
    document.querySelector(
      "#year"
    );


  if (!year) return;


  year.textContent =
    new Date().getFullYear();

}


// ==========================================
// APP
// ==========================================

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    // ======================================
    // DETECTAR RUTA
    // ======================================

    const isPageInsidePages =
      window.location.pathname.includes(
        "/pages/"
      );


    const componentPath =
      isPageInsidePages
        ? "../js/components/"
        : "js/components/";


    // ======================================
    // NAVBAR
    // ======================================

    await loadComponent(
      "#navBar",
      `${componentPath}navbar.html`
    );


    // ======================================
    // FOOTER
    // ======================================

    await loadComponent(
      "#footer",
      `${componentPath}footer.html`
    );


    if (!isPageInsidePages) {
      const navElement = document.querySelector("#navBar");
      if (navElement) {
        navElement.querySelectorAll("a[href^='../']").forEach((a) => {
          a.setAttribute("href", a.getAttribute("href").replace(/^\.\.\//, "./"));
        });
        navElement.querySelectorAll("img[src^='../']").forEach((img) => {
          img.setAttribute("src", img.getAttribute("src").replace(/^\.\.\//, "./"));
        });
      }
      const footerElement = document.querySelector("#footer");
      if (footerElement) {
        footerElement.querySelectorAll("a[href^='../']").forEach((a) => {
          a.setAttribute("href", a.getAttribute("href").replace(/^\.\.\//, "./"));
        });
        footerElement.querySelectorAll("img[src^='../']").forEach((img) => {
          img.setAttribute("src", img.getAttribute("src").replace(/^\.\.\//, "./"));
        });
      }
    }

    // ======================================
    // COMPONENTES
    // ======================================

    initializeNavbar();

    initializeYear();


    // ======================================
    // HOME
    // ======================================

    if (
      typeof initializeHome ===
      "function"
    ) {

      initializeHome();

    }


    // ======================================
    // OPPORTUNITIES PAGE
    // ======================================

    if (
      typeof initializeOpportunities ===
      "function"
    ) {

      initializeOpportunities();

    }


    // ======================================
    // OPPORTUNITY DETAIL PAGE
    // ======================================

    if (
      typeof initializeOpportunityDetail ===
      "function"
    ) {

      initializeOpportunityDetail();

    }


    // ======================================
    // LOGIN PAGE
    // ======================================

    if (
      typeof initializeLogin ===
      "function"
    ) {

      initializeLogin();

    }


    // ======================================
    // REGISTER PAGE
    // ======================================

    if (
      typeof initializeRegister ===
      "function"
    ) {

      initializeRegister();

    }


    // ======================================
    // LUCIDE
    // ======================================

    if (
      typeof lucide !==
      "undefined"
    ) {

      lucide.createIcons();

    }

  }
);