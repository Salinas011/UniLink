/**
 * UniLink - Lógica de Registro de Usuarios
 */

function initializeRegister() {
  const registerForm = document.querySelector("#registerForm");
  const regStudentTypeBtn = document.querySelector("#regStudentTypeBtn");
  const regCompanyTypeBtn = document.querySelector("#regCompanyTypeBtn");
  const studentFields = document.querySelector("#studentFields");
  const companyFields = document.querySelector("#companyFields");

  const studentFullName = document.querySelector("#studentFullName");
  const studentEmail = document.querySelector("#studentEmail");
  const studentPhone = document.querySelector("#studentPhone");
  const studentUniversity = document.querySelector("#studentUniversity");
  const studentProgram = document.querySelector("#studentProgram");

  const companyName = document.querySelector("#companyName");
  const companyNit = document.querySelector("#companyNit");
  const companySector = document.querySelector("#companySector");
  const companyContactEmail = document.querySelector("#companyContactEmail");
  const companyContactPhone = document.querySelector("#companyContactPhone");

  const regPassword = document.querySelector("#regPassword");
  const regConfirmPassword = document.querySelector("#regConfirmPassword");
  const agreeTerms = document.querySelector("#agreeTerms");

  if (!registerForm) return;

  let accountType = "student";

  // Función para conmutar estado visual de los botones de tipo de cuenta
  function updateAccountTypeUI(type) {
    accountType = type;

    if (type === "student") {
      regStudentTypeBtn.className =
        "account-type-btn flex flex-col items-center gap-2 rounded-2xl border-2 border-blue-600 bg-blue-50/50 p-4 text-center transition active:scale-98";
      regCompanyTypeBtn.className =
        "account-type-btn flex flex-col items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white p-4 text-center hover:border-slate-300 transition active:scale-98";
      regStudentTypeBtn.setAttribute("aria-checked", "true");
      regCompanyTypeBtn.setAttribute("aria-checked", "false");

      studentFields.classList.remove("hidden");
      companyFields.classList.add("hidden");

      // Campos requeridos para estudiante
      if (studentFullName) studentFullName.required = true;
      if (studentEmail) studentEmail.required = true;
      if (studentPhone) studentPhone.required = true;

      // Desactivar requeridos de empresa
      if (companyName) companyName.required = false;
      if (companyNit) companyNit.required = false;
      if (companyContactEmail) companyContactEmail.required = false;
    } else {
      regCompanyTypeBtn.className =
        "account-type-btn flex flex-col items-center gap-2 rounded-2xl border-2 border-blue-600 bg-blue-50/50 p-4 text-center transition active:scale-98";
      regStudentTypeBtn.className =
        "account-type-btn flex flex-col items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white p-4 text-center hover:border-slate-300 transition active:scale-98";
      regCompanyTypeBtn.setAttribute("aria-checked", "true");
      regStudentTypeBtn.setAttribute("aria-checked", "false");

      companyFields.classList.remove("hidden");
      studentFields.classList.add("hidden");

      // Desactivar requeridos de estudiante
      if (studentFullName) studentFullName.required = false;
      if (studentEmail) studentEmail.required = false;
      if (studentPhone) studentPhone.required = false;

      // Campos requeridos para empresa
      if (companyName) companyName.required = true;
      if (companyNit) companyNit.required = true;
      if (companyContactEmail) companyContactEmail.required = true;
    }

    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  // Eventos de selección de tipo
  regStudentTypeBtn?.addEventListener("click", () => updateAccountTypeUI("student"));
  regCompanyTypeBtn?.addEventListener("click", () => updateAccountTypeUI("company"));

  // Inicializar estado requerido por defecto (estudiante)
  updateAccountTypeUI("student");

  // Validación y envío del formulario
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const pass = regPassword?.value || "";
    const confirmPass = regConfirmPassword?.value || "";

    if (pass.length < 6) {
      showToast("La contraseña debe tener al menos 6 caracteres.");
      regPassword?.focus();
      return;
    }

    if (pass !== confirmPass) {
      showToast("Las contraseñas no coinciden. Por favor verifíquelas.");
      regConfirmPassword?.focus();
      return;
    }

    if (!agreeTerms?.checked) {
      showToast("Debe aceptar los términos de servicio y políticas de privacidad.");
      return;
    }

    const submitBtn = document.querySelector("#registerSubmitBtn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Creando su cuenta...</span>
      `;
    }

    // Datos del usuario según el rol
    const userData =
      accountType === "student"
        ? {
            role: "student",
            name: studentFullName?.value.trim(),
            email: studentEmail?.value.trim(),
            phone: studentPhone?.value.trim(),
            university: studentUniversity?.value.trim(),
            program: studentProgram?.value.trim()
          }
        : {
            role: "company",
            name: companyName?.value.trim(),
            nit: companyNit?.value.trim(),
            sector: companySector?.value,
            email: companyContactEmail?.value.trim(),
            phone: companyContactPhone?.value.trim()
          };

    setTimeout(() => {
      // Guardar registro simulado en localStorage
      try {
        const users = JSON.parse(localStorage.getItem("unilink_registered_users") || "[]");
        users.push(userData);
        localStorage.setItem("unilink_registered_users", JSON.stringify(users));
      } catch (err) {
        console.error("Error al guardar usuario en localStorage:", err);
      }

      showToast("¡Cuenta creada exitosamente! Redirigiendo al inicio de sesión...");

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1100);
    }, 800);
  });
}

/**
 * Muestra notificación flotante
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
  }, 3200);
}
