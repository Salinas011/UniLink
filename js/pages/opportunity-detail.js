/**
 * UniLink - Detalle de Oportunidad
 * Maneja la carga de datos por ID desde la URL (?id=...)
 * y la interacción de postulación, compartir y recomendaciones.
 */

async function initializeOpportunityDetail() {
  const container = document.querySelector("#opportunityDetailContainer");
  const breadcrumbTitle = document.querySelector("#breadcrumbTitle");

  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const rawId = urlParams.get("id");

  // Validación inicial de ID
  const isInvalidId =
    !rawId ||
    rawId === "undefined" ||
    rawId === "null" ||
    rawId.trim() === "";

  try {
    const response = await fetch("../data/opportunities.json");
    if (!response.ok) {
      throw new Error(`Error al cargar datos (${response.status})`);
    }

    const opportunities = await response.json();

    if (!Array.isArray(opportunities) || opportunities.length === 0) {
      throw new Error("No hay datos de oportunidades disponibles.");
    }

    if (isInvalidId) {
      renderOpportunityNotFound(
        container,
        "No se especificó un identificador válido de oportunidad.",
        opportunities
      );
      if (breadcrumbTitle) {
        breadcrumbTitle.textContent = "Oportunidad no especificada";
      }
      return;
    }

    // Buscar oportunidad por id numérico o string, con fallback al índice si es numérico
    const opportunity =
      opportunities.find((item) => String(item.id) === String(rawId)) ||
      (!isNaN(Number(rawId)) && Number(rawId) >= 1 && Number(rawId) <= opportunities.length
        ? opportunities[Number(rawId) - 1]
        : null);

    if (!opportunity) {
      renderOpportunityNotFound(
        container,
        `No encontramos ninguna oportunidad con el identificador "${rawId}".`,
        opportunities
      );
      if (breadcrumbTitle) {
        breadcrumbTitle.textContent = "Oportunidad no encontrada";
      }
      return;
    }

    // Actualizar título de la página y miga de pan
    document.title = `${opportunity.title} | ${opportunity.company} - UniLink`;
    if (breadcrumbTitle) {
      breadcrumbTitle.textContent = opportunity.title;
    }

    // Renderizar detalle completo
    renderOpportunityDetail(container, opportunity, opportunities);
    setupDetailInteractions(opportunity);

    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  } catch (error) {
    console.error("Error en initializeOpportunityDetail:", error);
    renderErrorState(container, error.message);
  }
}

/**
 * Renderiza la vista principal del detalle de la oportunidad
 */
function renderOpportunityDetail(container, opp, allOpps) {
  const isPagesDir = window.location.pathname.includes("/pages/");
  const logoSrc = isPagesDir
    ? (opp.logo?.startsWith("../") ? opp.logo : `../${opp.logo}`)
    : (opp.logo?.replace(/^\.\.\//, "./") || "");

  const skills = Array.isArray(opp.skills) ? opp.skills : [];
  const requirements = Array.isArray(opp.requirements)
    ? opp.requirements
    : [
        "Estudiante universitario activo en carreras afines al área del proyecto.",
        "Disponibilidad horaria para cumplir las actividades acordadas.",
        "Capacidad de autogestión, proactividad y trabajo colaborativo."
      ];

  const responsibilities = Array.isArray(opp.responsibilities)
    ? opp.responsibilities
    : [
        "Participar en las reuniones de seguimiento y planificación del equipo.",
        "Desarrollar entregables técnicos con la orientación del tutor del proyecto.",
        "Aportar ideas innovadoras y proponer mejoras en los procesos."
      ];

  const benefits = Array.isArray(opp.benefits)
    ? opp.benefits
    : [
        "Certificación formal de horas y participación para tu universidad.",
        "Horarios flexibles que respetan tus clases y época de parciales.",
        "Mentoría personalizada con profesionales con experiencia en el sector.",
        "Auxilio económico de práctica según políticas del proyecto."
      ];

  // Otras oportunidades recomendadas (máximo 3 distintas a la actual)
  const relatedOpps = allOpps
    .filter((item) => String(item.id) !== String(opp.id))
    .slice(0, 3);

  container.innerHTML = `
    <!-- BOTÓN VOLVER -->
    <div class="mb-6">
      <a
        href="opportunities.html"
        class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
      >
        <i data-lucide="arrow-left" class="h-4 w-4"></i>
        Volver a todas las oportunidades
      </a>
    </div>

    <!-- TARJETA CABECERA PRINCIPAL -->
    <header class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        
        <!-- INFO Y LOGO -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <!-- Logo Empresa -->
          <div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-3 shadow-xs">
            <img
              src="${logoSrc}"
              alt="Logo de ${opp.company}"
              class="h-auto w-auto max-h-full max-w-full object-contain"
            />
          </div>

          <!-- Título y Badges -->
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                ${opp.category || "General"}
              </span>
              <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                ${opp.modality || "Remoto / Híbrido"}
              </span>
              <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <i data-lucide="badge-check" class="h-3.5 w-3.5"></i>
                Empresa Verificada
              </span>
            </div>

            <h1 class="text-2xl font-bold text-slate-950 sm:text-3xl">
              ${opp.title}
            </h1>

            <div class="mt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-600">
              <span class="flex items-center gap-1.5 font-medium text-slate-900">
                <i data-lucide="building-2" class="h-4 w-4 text-slate-500"></i>
                ${opp.company}
              </span>
              <span class="flex items-center gap-1.5">
                <i data-lucide="map-pin" class="h-4 w-4 text-slate-500"></i>
                ${opp.location || "Colombia"}
              </span>
              <span class="flex items-center gap-1.5">
                <i data-lucide="calendar" class="h-4 w-4 text-slate-500"></i>
                Publicado: ${opp.date || "Reciente"}
              </span>
            </div>
          </div>
        </div>

        <!-- ACCIONES RÁPIDAS -->
        <div class="flex flex-wrap items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <button
            type="button"
            id="shareBtn"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95"
            title="Copiar enlace"
          >
            <i data-lucide="share-2" class="h-4 w-4"></i>
            <span class="hidden sm:inline">Compartir</span>
          </button>

          <button
            type="button"
            id="bookmarkBtn"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95"
            title="Guardar en favoritos"
          >
            <i data-lucide="bookmark" class="h-4 w-4"></i>
            <span id="bookmarkText" class="hidden sm:inline">Guardar</span>
          </button>

          <button
            type="button"
            id="openApplyModalBtn"
            class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition active:scale-95"
          >
            <i data-lucide="send" class="h-4 w-4"></i>
            Postularme ahora
          </button>
        </div>
      </div>
    </header>

    <!-- GRID DE CONTENIDO PRINCIPAL Y BARRA LATERAL -->
    <div class="mt-8 grid gap-8 lg:grid-cols-3">
      
      <!-- COLUMNA PRINCIPAL (2 COLUMNAS) -->
      <section class="space-y-8 lg:col-span-2">
        
        <!-- DESCRIPCIÓN DEL PUESTO -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
          <h2 class="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <i data-lucide="file-text" class="h-5 w-5 text-blue-600"></i>
            Descripción del Puesto
          </h2>
          <p class="text-sm sm:text-base leading-relaxed text-slate-700">
            ${opp.description}
          </p>
          ${
            opp.companyDescription
              ? `
              <div class="mt-4 rounded-xl bg-blue-50/60 border border-blue-100 p-4 text-xs sm:text-sm text-slate-700">
                <span class="font-semibold text-blue-900 block mb-1">Acerca del equipo de ${opp.company}:</span>
                ${opp.companyDescription}
              </div>
            `
              : ""
          }
        </div>

        <!-- RESPONSABILIDADES -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
          <h2 class="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <i data-lucide="check-square" class="h-5 w-5 text-blue-600"></i>
            Responsabilidades Principales
          </h2>
          <ul class="space-y-3">
            ${responsibilities
              .map(
                (item) => `
                <li class="flex items-start gap-3 text-sm sm:text-base text-slate-700">
                  <div class="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <i data-lucide="check" class="h-3 w-3"></i>
                  </div>
                  <span>${item}</span>
                </li>
              `
              )
              .join("")}
          </ul>
        </div>

        <!-- REQUISITOS Y HABILIDADES -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
          <div>
            <h2 class="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <i data-lucide="award" class="h-5 w-5 text-blue-600"></i>
              Requisitos del Perfil
            </h2>
            <ul class="mt-4 space-y-3">
              ${requirements
                .map(
                  (req) => `
                  <li class="flex items-start gap-3 text-sm sm:text-base text-slate-700">
                    <div class="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                      <i data-lucide="arrow-right" class="h-3 w-3"></i>
                    </div>
                    <span>${req}</span>
                  </li>
                `
                )
                .join("")}
            </ul>
          </div>

          <div class="border-t border-slate-100 pt-6">
            <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Habilidades Clave Solicitadas
            </h3>
            <div class="flex flex-wrap gap-2">
              ${skills
                .map(
                  (skill) => `
                  <span class="rounded-xl border border-blue-200 bg-blue-50/70 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-blue-800">
                    ${skill}
                  </span>
                `
                )
                .join("")}
            </div>
          </div>
        </div>

        <!-- BENEFICIOS Y QUÉ OFRECE LA EMPRESA -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
          <h2 class="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <i data-lucide="gift" class="h-5 w-5 text-blue-600"></i>
            Beneficios para el Estudiante
          </h2>
          <div class="grid gap-3 sm:grid-cols-2">
            ${benefits
              .map(
                (ben) => `
                <div class="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
                  <div class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <i data-lucide="sparkles" class="h-3.5 w-3.5"></i>
                  </div>
                  <span class="text-xs sm:text-sm font-medium text-slate-800">${ben}</span>
                </div>
              `
              )
              .join("")}
          </div>
        </div>

      </section>

      <!-- BARRA LATERAL (RESUMEN Y EMPRESA) -->
      <aside class="space-y-6">
        
        <!-- RESUMEN DE LA VACANTE -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <h2 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Resumen de la vacante
          </h2>

          <dl class="space-y-4 text-xs sm:text-sm">
            <div class="flex items-center justify-between">
              <dt class="text-slate-500 flex items-center gap-1.5">
                <i data-lucide="briefcase" class="h-4 w-4"></i>
                Modalidad:
              </dt>
              <dd class="font-semibold text-slate-900">${opp.modality || "Remoto"}</dd>
            </div>

            <div class="flex items-center justify-between">
              <dt class="text-slate-500 flex items-center gap-1.5">
                <i data-lucide="map-pin" class="h-4 w-4"></i>
                Ubicación:
              </dt>
              <dd class="font-semibold text-slate-900 text-right">${opp.location || "Colombia"}</dd>
            </div>

            <div class="flex items-center justify-between">
              <dt class="text-slate-500 flex items-center gap-1.5">
                <i data-lucide="clock" class="h-4 w-4"></i>
                Jornada:
              </dt>
              <dd class="font-semibold text-slate-900">${opp.workload || "Medio tiempo"}</dd>
            </div>

            <div class="flex items-center justify-between">
              <dt class="text-slate-500 flex items-center gap-1.5">
                <i data-lucide="hourglass" class="h-4 w-4"></i>
                Duración:
              </dt>
              <dd class="font-semibold text-slate-900">${opp.duration || "6 meses"}</dd>
            </div>

            <div class="flex items-center justify-between">
              <dt class="text-slate-500 flex items-center gap-1.5">
                <i data-lucide="users" class="h-4 w-4"></i>
                Vacantes:
              </dt>
              <dd class="font-semibold text-slate-900">${opp.vacancies || 1} disponibles</dd>
            </div>

            <div class="flex items-center justify-between">
              <dt class="text-slate-500 flex items-center gap-1.5">
                <i data-lucide="calendar" class="h-4 w-4"></i>
                Publicado:
              </dt>
              <dd class="font-semibold text-slate-900">${opp.date || "Reciente"}</dd>
            </div>
          </dl>

          <button
            type="button"
            id="sideApplyBtn"
            class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition active:scale-95"
          >
            <i data-lucide="send" class="h-4 w-4"></i>
            Postularme ahora
          </button>
        </div>

        <!-- SOBRE LA EMPRESA -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-2">
              <img
                src="${logoSrc}"
                alt="${opp.company}"
                class="h-auto w-auto max-h-full max-w-full object-contain"
              />
            </div>
            <div>
              <h3 class="font-bold text-slate-900">${opp.company}</h3>
              <p class="text-xs text-slate-500">Aliado Corporativo UniLink</p>
            </div>
          </div>
          <p class="text-xs sm:text-sm leading-relaxed text-slate-600">
            ${
              opp.companyDescription ||
              "Compañía aliada comprometida con el desarrollo de talento joven y la vinculación de estudiantes en proyectos de alto impacto."
            }
          </p>
        </div>

        <!-- CONSEJO UNILINK -->
        <div class="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-indigo-50/30 p-5 space-y-2">
          <div class="flex items-center gap-2 text-blue-800 font-semibold text-sm">
            <i data-lucide="shield-check" class="h-4 w-4"></i>
            Garantía UniLink
          </div>
          <p class="text-xs leading-relaxed text-slate-600">
            Esta oportunidad cumple los lineamientos universitarios para validación de prácticas formativas y desarrollo de competencias profesionales.
          </p>
        </div>

      </aside>
    </div>

    <!-- OTRAS OPORTUNIDADES RECOMENDADAS -->
    ${
      relatedOpps.length > 0
        ? `
      <section class="mt-16 border-t border-slate-200/80 pt-12">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900">
              Otras oportunidades que te pueden interesar
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">
              Explora más vacantes afines a tus intereses profesionales.
            </p>
          </div>
          <a
            href="opportunities.html"
            class="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            Ver catálogo completo
            <i data-lucide="arrow-right" class="h-4 w-4"></i>
          </a>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          ${relatedOpps.map((other) => createOpportunityCard(other)).join("")}
        </div>
      </section>
    `
        : ""
    }
  `;
}

/**
 * Renderiza el estado amigable cuando el ID es undefined o no existe
 */
function renderOpportunityNotFound(container, message, allOpps) {
  const sampleOpps = Array.isArray(allOpps) ? allOpps.slice(0, 3) : [];

  container.innerHTML = `
    <div class="py-12 sm:py-16">
      <div class="mx-auto max-w-xl text-center space-y-5">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <i data-lucide="alert-circle" class="h-8 w-8"></i>
        </div>

        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Oportunidad no encontrada
        </h1>

        <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
          ${message}
        </p>

        <p class="text-xs text-slate-500">
          Es posible que el enlace no contenga el parámetro <code>id</code> correspondiente o que la vacante haya finalizado su periodo de convocatoria.
        </p>

        <div class="pt-4 flex flex-wrap items-center justify-center gap-3">
          <a
            href="opportunities.html"
            class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition active:scale-95"
          >
            <i data-lucide="search" class="h-4 w-4"></i>
            Explorar todas las oportunidades
          </a>

          <a
            href="../index.html"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <i data-lucide="home" class="h-4 w-4"></i>
            Ir al inicio
          </a>
        </div>
      </div>

      ${
        sampleOpps.length > 0
          ? `
        <div class="mt-16 border-t border-slate-200 pt-10">
          <h2 class="text-center text-lg sm:text-xl font-bold text-slate-900 mb-6">
            Oportunidades destacadas disponibles actualmente
          </h2>
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            ${sampleOpps.map((opp) => createOpportunityCard(opp)).join("")}
          </div>
        </div>
      `
          : ""
      }
    </div>
  `;

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

/**
 * Renderiza estado de error de carga
 */
function renderErrorState(container, errorMessage) {
  container.innerHTML = `
    <div class="py-16 text-center space-y-4">
      <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <i data-lucide="alert-triangle" class="h-7 w-7"></i>
      </div>
      <h2 class="text-xl font-bold text-slate-900">Error al cargar la información</h2>
      <p class="text-sm text-slate-600 max-w-md mx-auto">
        ${errorMessage || "No se pudo conectar con el servidor de datos."}
      </p>
      <div class="pt-2">
        <button
          type="button"
          onclick="window.location.reload()"
          class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          <i data-lucide="refresh-cw" class="h-4 w-4"></i>
          Reintentar
        </button>
      </div>
    </div>
  `;
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

/**
 * Vincula los eventos interactivos (Modal, compartir, guardar)
 */
function setupDetailInteractions(opp) {
  const modal = document.querySelector("#applyModal");
  const openModalBtn = document.querySelector("#openApplyModalBtn");
  const sideApplyBtn = document.querySelector("#sideApplyBtn");
  const closeModalBtn = document.querySelector("#closeModalBtn");
  const cancelModalBtn = document.querySelector("#cancelModalBtn");
  const applyForm = document.querySelector("#applyForm");
  const modalSuccess = document.querySelector("#modalSuccess");
  const successCloseBtn = document.querySelector("#successCloseBtn");
  const modalTitle = document.querySelector("#modalTitle");
  const modalSubtitle = document.querySelector("#modalSubtitle");
  const shareBtn = document.querySelector("#shareBtn");
  const bookmarkBtn = document.querySelector("#bookmarkBtn");
  const bookmarkText = document.querySelector("#bookmarkText");

  if (modalTitle && opp) {
    modalTitle.textContent = `Postularme a ${opp.title}`;
  }
  if (modalSubtitle && opp) {
    modalSubtitle.textContent = `Envío de postulación a ${opp.company} a través de UniLink.`;
  }

  const openModal = () => {
    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      document.body.classList.add("overflow-hidden");
    }
  };

  const closeModal = () => {
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.classList.remove("overflow-hidden");
      if (modalSuccess) modalSuccess.classList.add("hidden");
      if (applyForm) {
        applyForm.classList.remove("hidden");
        applyForm.reset();
      }
    }
  };

  openModalBtn?.addEventListener("click", openModal);
  sideApplyBtn?.addEventListener("click", openModal);
  closeModalBtn?.addEventListener("click", closeModal);
  cancelModalBtn?.addEventListener("click", closeModal);
  successCloseBtn?.addEventListener("click", closeModal);

  // Cerrar al hacer clic en el backdrop
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Cerrar con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });

  // Envío del formulario
  applyForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const submitBtn = document.querySelector("#submitModalBtn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Enviando postulación...</span>
      `;
    }

    setTimeout(() => {
      if (applyForm) applyForm.classList.add("hidden");
      if (modalSuccess) modalSuccess.classList.remove("hidden");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <i data-lucide="send" class="h-4 w-4"></i>
          <span>Enviar postulación</span>
        `;
      }
      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
      showToast("¡Postulación enviada exitosamente!");
    }, 700);
  });

  // Compartir enlace
  shareBtn?.addEventListener("click", () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showToast("Enlace de la oportunidad copiado al portapapeles");
      }).catch(() => {
        showToast("URL: " + url);
      });
    } else {
      showToast("URL: " + url);
    }
  });

  // Guardar en favoritos
  let isBookmarked = false;
  bookmarkBtn?.addEventListener("click", () => {
    isBookmarked = !isBookmarked;
    if (isBookmarked) {
      bookmarkBtn.classList.add("bg-blue-50", "text-blue-700", "border-blue-300");
      if (bookmarkText) bookmarkText.textContent = "Guardada";
      showToast("Oportunidad guardada en tus favoritos");
    } else {
      bookmarkBtn.classList.remove("bg-blue-50", "text-blue-700", "border-blue-300");
      if (bookmarkText) bookmarkText.textContent = "Guardar";
      showToast("Oportunidad eliminada de tus favoritos");
    }
  });
}

/**
 * Notificación Toast flotante
 */
function showToast(message) {
  const toast = document.querySelector("#toastNotification");
  const toastMessage = document.querySelector("#toastMessage");
  if (!toast) return;

  if (toastMessage) toastMessage.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("flex");

  clearTimeout(window.__toastTimeout);
  window.__toastTimeout = setTimeout(() => {
    toast.classList.add("hidden");
    toast.classList.remove("flex");
  }, 3000);
}
