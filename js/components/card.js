function createOpportunityCard(
  opportunity
) {

  return `

    <article
      class="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-150 hover:border-blue-300 hover:shadow-lg"
    >

      <!-- ==================================
           CATEGORÍA
      =================================== -->

      <p
        class="mb-4 text-sm font-medium text-blue-600"
      >
        ${opportunity.category}
      </p>


      <!-- ==================================
           EMPRESA + TÍTULO
      =================================== -->

      <div
        class="flex items-center gap-3.5"
      >

        <!-- Logo -->

        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center"
        >

          <img
            src="${opportunity.logo}"
            alt="Logo de ${opportunity.company}"
            class="h-auto w-auto max-h-full max-w-full object-contain"
          />

        </div>


        <!-- Información -->

        <div>

          <p
            class="text-sm text-gray-500"
          >
            ${opportunity.company}
          </p>


          <h2
            class="text-lg font-semibold text-gray-900"
          >
            ${opportunity.title}
          </h2>

        </div>

      </div>


      <!-- ==================================
           DESCRIPCIÓN
      =================================== -->

      <p
        class="mt-5 text-sm leading-6 text-gray-600"
      >
        ${opportunity.description}
      </p>


      <!-- ==================================
           HABILIDADES
      =================================== -->

      <div
        class="mt-5 flex-1"
      >

        <h3
          class="mb-3 text-sm font-semibold text-gray-900"
        >
          Habilidades
        </h3>


        <div
          class="flex flex-wrap gap-2"
        >

          ${
            opportunity.skills
              .map(
                (skill) => `

                  <span
                    class="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
                  >
                    ${skill}
                  </span>

                `
              )
              .join("")
          }

        </div>

      </div>


      <!-- ==================================
           INFORMACIÓN
      =================================== -->

      <div
        class="mt-auto pt-5"
      >

        <div
          class="grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2"
        >

          <!-- Modalidad -->

          <div>

            <p
              class="text-xs text-gray-500"
            >
              Modalidad
            </p>


            <p
              class="mt-1 text-sm font-medium text-gray-900"
            >
              ${opportunity.modality}
            </p>

          </div>


          <!-- Publicado -->

          <div>

            <p
              class="text-xs text-gray-500"
            >
              Publicado
            </p>


            <p
              class="mt-1 text-sm font-medium text-gray-900"
            >
              ${opportunity.date}
            </p>

          </div>

        </div>


        <!-- ==================================
             ACCIÓN
        =================================== -->

        <a
          href="opportunity-detail.html?id=${opportunity.id}""
          class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 active:scale-95"
        >

          Ver oportunidad

          <i
            data-lucide="arrow-right"
            class="h-4 w-4"
          ></i>

        </a>

      </div>

    </article>

  `;
}