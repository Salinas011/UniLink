function initializeHome() {

  initializeHeroButtons();

  initializeRecentOpportunities();

}


// ==========================================
// HERO BUTTONS
// ==========================================

function initializeHeroButtons() {

  const heroButtons =
    document.querySelector("#hero-buttons");


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
      href: "pages/project.html",
      icon: "plus"
    })}

  `;


  if (
    typeof lucide !== "undefined"
  ) {
    lucide.createIcons();
  }

}


// ==========================================
// OPORTUNIDADES RECIENTES
// ==========================================

async function initializeRecentOpportunities() {

  const recentOpportunities =
    document.querySelector(
      "#recentOpportunities"
    );


  if (!recentOpportunities) return;


  // ========================================
  // 1. MOSTRAR SKELETON
  // ========================================

  renderOpportunitySkeletons(
    recentOpportunities,
    4
  );


  try {

    // ======================================
    // 2. FETCH
    // ======================================

    const response =
      await fetch(
        "./data/opportunities.json"
      );


    if (!response.ok) {

      throw new Error(
        `Error HTTP: ${response.status}`
      );

    }


    // ======================================
    // 3. CONVERTIR JSON
    // ======================================

    const opportunities =
      await response.json();


    // ======================================
    // 4. TOMAR LAS 3 MÁS RECIENTES
    // ======================================

    const recent =
      opportunities.slice(0, 3);


    // ======================================
    // 5. REEMPLAZAR SKELETON
    // ======================================

    recentOpportunities.innerHTML =
      recent
        .map(
          (opportunity) =>
            createOpportunityCard(
              opportunity
            )
        )
        .join("");


    // ======================================
    // 6. ICONOS
    // ======================================

    if (
      typeof lucide !== "undefined"
    ) {

      lucide.createIcons();

    }


  } catch (error) {

    console.error(
      "Error cargando oportunidades:",
      error
    );


    // ======================================
    // ERROR
    // ======================================

    recentOpportunities.innerHTML = `

      <div
        class="col-span-full rounded-xl border border-red-200 bg-red-50 p-6 text-center"
      >

        <div
          class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100"
        >

          <i
            data-lucide="triangle-alert"
            class="h-5 w-5 text-red-600"
          ></i>

        </div>


        <p class="mt-3 text-sm font-medium text-red-700">
          No se pudieron cargar las oportunidades.
        </p>


        <p class="mt-1 text-sm text-red-600">
          Intente nuevamente más tarde.
        </p>

      </div>

    `;


    if (
      typeof lucide !== "undefined"
    ) {

      lucide.createIcons();

    }

  }

}