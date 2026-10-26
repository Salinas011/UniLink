/**
 * UniLink - Lógica de Inicio de Sesión
 */

function initializeLogin() {
  const loginForm = document.querySelector("#loginForm");
  const roleStudentBtn = document.querySelector("#roleStudentBtn");
  const roleCompanyBtn = document.querySelector("#roleCompanyBtn");
  const emailLabel = document.querySelector("#emailLabel");
  const emailInput = document.querySelector("#loginEmail");
  const passwordInput = document.querySelector("#loginPassword");
  const togglePasswordBtn = document.querySelector("#togglePasswordBtn");
  const forgotPasswordLink = document.querySelector("#forgotPasswordLink");
  const socialButtons = document.querySelectorAll(".social-login-btn");

  if (!loginForm) return;

  let currentRole = "student";

  // Toggle de Rol (Estudiante vs Empresa)
  roleStudentBtn?.addEventListener("click", () => {
    currentRole = "student";
    roleStudentBtn.className =
      "role-tab flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-blue-700 shadow-xs transition";
    roleCompanyBtn.className =
      "role-tab flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition";
    roleStudentBtn.setAttribute("aria-selected", "true");
    roleCompanyBtn.setAttribute("aria-selected", "false");

    if (emailLabel) emailLabel.textContent = "Correo Institucional *";
    if (emailInput) emailInput.placeholder = "ejemplo@universidad.edu.co";
  });

  roleCompanyBtn?.addEventListener("click", () => {
    currentRole = "company";
    roleCompanyBtn.className =
      "role-tab flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-blue-700 shadow-xs transition";
    roleStudentBtn.className =
      "role-tab flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition";
    roleCompanyBtn.setAttribute("aria-selected", "true");
    roleStudentBtn.setAttribute("aria-selected", "false");

    if (emailLabel) emailLabel.textContent = "Correo Corporativo *";
    if (emailInput) emailInput.placeholder = "contacto@empresa.com";
  });

  // Mostrar / Ocultar contraseña
  togglePasswordBtn?.addEventListener("click", () => {
    if (!passwordInput) return;
    const isPassword = passwordInput.getAttribute("type") === "password";
    passwordInput.setAttribute("type", isPassword ? "text" : "password");

    const eyeIcon = document.querySelector("#eyeIcon");
    if (eyeIcon) {
      eyeIcon.setAttribute("data-lucide", isPassword ? "eye-off" : "eye");
      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    }
  });

  // ¿Olvidó su contraseña?
  forgotPasswordLink?.addEventListener("click", (e) => {
    e.preventDefault();
    const email = emailInput?.value.trim();
    if (email) {
      showToast(`Se ha enviado un enlace de recuperación a ${email}`);
    } else {
      showToast("Por favor ingrese su correo para recuperar su contraseña.");
      emailInput?.focus();
    }
  });

  // Acceso con proveedores externos
  socialButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      showToast("Conectando con el proveedor de autenticación...");
    });
  });

  // Envío del formulario
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput?.value.trim();
    const password = passwordInput?.value.trim();

    if (!email || !password) {
      showToast("Por favor complete todos los campos obligatorios.");
      return;
    }

    const submitBtn = document.querySelector("#loginSubmitBtn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Verificando credenciales...</span>
      `;
    }

    setTimeout(() => {
      // Guardar simulación de sesión
      localStorage.setItem(
        "unilink_user",
        JSON.stringify({
          email,
          role: currentRole,
          name: email.split("@")[0]
        })
      );

      showToast("¡Inicio de sesión exitoso! Redirigiendo...");

      setTimeout(() => {
        window.location.href = "opportunities.html";
      }, 900);
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
