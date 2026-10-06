let allOpportunities = [];
let currentCategory = "all";
let currentModality = "all";

// =========================================================
// ESTILOS CENTRALIZADOS PARA CATEGORÍA Y MODALIDAD
// Mantienen alto contraste (WCAG AA) y consistencia UniLink
// =========================================================
const STYLES = {
  category: {
    active:
      "category-btn active inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-blue-600 bg-blue-600 px-3.5 py-2 text-xs md:text-sm font-semibold text-white shadow-xs transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
    inactive:
      "category-btn inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs md:text-sm font-semibold text-slate-700 shadow-xs transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
  },
  modality: {
    active:
      "modality-btn active rounded-lg bg-white px-3 py-1.5 text-xs md:text-sm font-semibold text-slate-950 shadow-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
    inactive:
      "modality-btn rounded-lg px-3 py-1.5 text-xs md:text-sm font-semibold text-slate-600 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
  }
};

async function initializeOpportunities() {
  const opportunitiesGrid = document.querySelector("#opportunitiesGrid");
  const searchInput = document.querySelector("#searchInput");
  const clearSearchBtn = document.querySelector("#clearSearchBtn");
  const sortFilter = document.querySelector("#sortFilter");
  const resultsCount = document.querySelector("#resultsCount");
  const categoryBtns = document.querySelectorAll(".category-btn");
  const modalityBtns = document.querySelectorAll(".modality-btn");

  if (!opportunitiesGrid) return;

  // Renderizar Skeletons de carga inicial
  if (typeof renderOpportunitySkeletons === "function") {
    renderOpportunitySkeletons(opportunitiesGrid, 6);
  }

  try {
    const response = await fetch("../data/opportunities.json");

    if (!response.ok) {
      throw new Error(`Error en la carga: ${response.status}`);
    }

    allOpportunities = await response.json();

    if (!Array.isArray(allOpportunities)) {
      throw new Error("Estructura de datos inválida.");
    }

    applyFilters();

    // =====================================================
    // EVENTOS DEL BUSCADOR
    // =====================================================
    searchInput?.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      if (clearSearchBtn) {
        clearSearchBtn.classList.toggle("hidden", val.length === 0);
        clearSearchBtn.classList.toggle("flex", val.length > 0);
      }
      applyFilters();
    });

    clearSearchBtn?.addEventListener("click", () => {
      if (!searchInput) return;
      searchInput.value = "";
      clearSearchBtn.classList.add("hidden");
      clearSearchBtn.classList.remove("flex");
      searchInput.focus();
      applyFilters();
    });

    // =====================================================
    // EVENTOS DE BOTONES DE CATEGORÍA
    // =====================================================
    categoryBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        categoryBtns.forEach((b) => {
          b.className = STYLES.category.inactive;
          b.setAttribute("aria-pressed", "false");
        });

        btn.className = STYLES.category.active;
        btn.setAttribute("aria-pressed", "true");

        currentCategory = btn.dataset.category || "all";
        applyFilters();
      });
    });

    // =====================================================
    // EVENTOS DE BOTONES DE MODALIDAD
    // =====================================================
    modalityBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        modalityBtns.forEach((b) => {
          b.className = STYLES.modality.inactive;
          b.setAttribute("aria-pressed", "false");
        });

        btn.className = STYLES.modality.active;
        btn.setAttribute("aria-pressed", "true");

        currentModality = btn.dataset.modality || "all";
        applyFilters();
      });
    });

    // ORDENAMIENTO
    sortFilter?.addEventListener("change", applyFilters);

  } catch (error) {
    console.error("Error al cargar oportunidades:", error);
    renderErrorState(opportunitiesGrid);
  }

  // =======================================================
  // FILTRADO Y ACTUALIZACIÓN EN VIVO
  // =======================================================
  function applyFilters() {
    const query = searchInput?.value.toLowerCase().trim() || "";
    const sortOrder = sortFilter?.value || "newest";

    let filtered = allOpportunities.filter((item) => {
      const title = String(item.title || "").toLowerCase();
      const company = String(item.company || "").toLowerCase();
      const description = String(item.description || "").toLowerCase();
      const skills = Array.isArray(item.skills)
        ? item.skills.map((s) => String(s).toLowerCase()).join(" ")
        : "";

      const matchSearch =
        !query ||
        title.includes(query) ||
        company.includes(query) ||
        description.includes(query) ||
        skills.includes(query);

      const matchCategory =
        currentCategory === "all" || item.category === currentCategory;

      const matchModality =
        currentModality === "all" || item.modality === currentModality;

      return matchSearch && matchCategory && matchModality;
    });

    // Ordenamiento por fecha
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      return sortOrder === "oldest" ? dateA - dateB : dateB - dateA;
    });

    // Actualizar Contador
    if (resultsCount) {
      resultsCount.textContent = `${filtered.length} ${
        filtered.length === 1 ? "oportunidad encontrada" : "oportunidades encontradas"
      }`;
    }

    // Renderizar Cards o Estado Vacío
    if (filtered.length === 0) {
      renderEmptyState(opportunitiesGrid);
    } else {
      opportunitiesGrid.innerHTML = filtered
        .map((opp) => createOpportunityCard(opp))
        .join("");
    }

    refreshIcons();
  }

  // =======================================================
  // ESTADO VACÍO (ACCESIBLE Y CON ALTO CONTRASTE)
  // =======================================================
  function renderEmptyState(grid) {
    grid.innerHTML = `
      <div class="col-span-full">
        <div class="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700" aria-hidden="true">
            <i data-lucide="search-x" class="h-7 w-7"></i>
          </div>

          <h3 class="mt-4 text-base md:text-lg font-bold text-slate-900">
            No encontramos oportunidades
          </h3>

          <p class="mx-auto mt-2 max-w-sm text-xs md:text-sm leading-relaxed text-slate-600">
            No hay proyectos que coincidan con la búsqueda y filtros seleccionados. Intente ajustar sus criterios.
          </p>

          <button
            id="resetBtn"
            type="button"
            class="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-xs md:text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 active:scale-95"
          >
            <i data-lucide="rotate-ccw" class="h-4 w-4" aria-hidden="true"></i>
            Limpiar todos los filtros
          </button>
        </div>
      </div>
    `;

    refreshIcons();
    document.querySelector("#resetBtn")?.addEventListener("click", resetAllFilters);
  }

  // =======================================================
  // ESTADO DE ERROR
  // =======================================================
  function renderErrorState(grid) {
    grid.innerHTML = `
      <div class="col-span-full">
        <div class="mx-auto max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-xs">
          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-700" aria-hidden="true">
            <i data-lucide="alert-triangle" class="h-7 w-7"></i>
          </div>

          <h3 class="mt-4 text-base md:text-lg font-bold text-slate-900">
            No fue posible cargar las oportunidades
          </h3>

          <p class="mx-auto mt-2 max-w-sm text-xs md:text-sm leading-relaxed text-slate-600">
            Ocurrió un error al procesar la lista. Por favor intente recargar el sitio.
          </p>

          <button
            type="button"
            onclick="window.location.reload()"
            class="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-xs md:text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200 active:scale-95"
          >
            <i data-lucide="refresh-cw" class="h-4 w-4" aria-hidden="true"></i>
            Recargar página
          </button>
        </div>
      </div>
    `;

    refreshIcons();
  }

  // =======================================================
  // REINICIAR FILTROS
  // =======================================================
  function resetAllFilters() {
    currentCategory = "all";
    currentModality = "all";

    if (searchInput) {
      searchInput.value = "";
    }

    if (clearSearchBtn) {
      clearSearchBtn.classList.add("hidden");
      clearSearchBtn.classList.remove("flex");
    }

    if (sortFilter) {
      sortFilter.value = "newest";
    }

    categoryBtns.forEach((btn, index) => {
      const isFirst = index === 0;
      btn.className = isFirst ? STYLES.category.active : STYLES.category.inactive;
      btn.setAttribute("aria-pressed", isFirst ? "true" : "false");
    });

    modalityBtns.forEach((btn, index) => {
      const isFirst = index === 0;
      btn.className = isFirst ? STYLES.modality.active : STYLES.modality.inactive;
      btn.setAttribute("aria-pressed", isFirst ? "true" : "false");
    });

    applyFilters();
  }

  function refreshIcons() {
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }
}