function createOpportunitySkeleton() {
  return `
    <article
      class="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6"
    >

      <div class="animate-pulse">

        <!-- Categoría -->
        <div class="mb-4 h-4 w-20 rounded bg-gray-200"></div>


        <!-- Empresa + título -->
        <div class="flex items-center gap-3">

          <!-- Logo -->
          <div
            class="h-12 w-12 shrink-0 rounded-lg bg-gray-200"
          ></div>


          <div class="flex flex-1 flex-col gap-2">

            <!-- Empresa -->
            <div
              class="h-3 w-24 rounded bg-gray-200"
            ></div>

            <!-- Título -->
            <div
              class="h-5 w-40 rounded bg-gray-200"
            ></div>

          </div>

        </div>


        <!-- Descripción -->
        <div class="mt-5 flex flex-col gap-2">

          <div
            class="h-3 w-full rounded bg-gray-200"
          ></div>

          <div
            class="h-3 w-5/6 rounded bg-gray-200"
          ></div>

          <div
            class="h-3 w-2/3 rounded bg-gray-200"
          ></div>

        </div>


        <!-- Habilidades -->
        <div class="mt-5">

          <div
            class="mb-3 h-4 w-20 rounded bg-gray-200"
          ></div>


          <div class="flex gap-2">

            <div
              class="h-6 w-16 rounded-full bg-gray-200"
            ></div>

            <div
              class="h-6 w-14 rounded-full bg-gray-200"
            ></div>

            <div
              class="h-6 w-20 rounded-full bg-gray-200"
            ></div>

          </div>

        </div>


        <!-- Información -->
        <div
          class="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5"
        >

          <div class="flex flex-col gap-2">

            <div
              class="h-3 w-16 rounded bg-gray-200"
            ></div>

            <div
              class="h-4 w-20 rounded bg-gray-200"
            ></div>

          </div>


          <div class="flex flex-col gap-2">

            <div
              class="h-3 w-16 rounded bg-gray-200"
            ></div>

            <div
              class="h-4 w-24 rounded bg-gray-200"
            ></div>

          </div>

        </div>


        <!-- Botón -->
        <div
          class="mt-5 h-11 w-full rounded-lg bg-gray-200"
        ></div>

      </div>

    </article>
  `;
}


/**
 * Genera varios skeletons.
 *
 * Ejemplo:
 *
 * renderOpportunitySkeletons(container, 4);
 */

function renderOpportunitySkeletons(
  container,
  quantity = 4
) {

  if (!container) return;


  container.innerHTML =
    Array.from(
      { length: quantity },
      () => createOpportunitySkeleton()
    ).join("");
}