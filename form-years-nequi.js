import {
  configurePhoneInput,
  validatePhone,
  validatePrivacyPolicy,
  validateEmail,
} from "./shared/utils.js";

import { sendCleverTapEventEventOnly } from "./services/event.clevertap.eventOnly.js";

const formElement = document.querySelector("#form_aniversario form");
if (!formElement) {
  // Si no existe en esta página, no hacemos nada
  // (evita errores si el script se carga globalmente)
} else {
  const fullNameElement = document.getElementById("full_name");
  const companyElement = document.getElementById("company"); // Entidad / Empresa
  const roleElement = document.getElementById("role");       // Rol
  const emailElement = document.getElementById("email");

  // Teléfono: misma lógica de siempre
  configurePhoneInput("cell_phone");

  // Email live validation (opcional)
  emailElement?.addEventListener("input", validateEmail);

  formElement.addEventListener("submit", (submitEvent) => {
    // 1) Validar celular
    const phone = validatePhone("cell_phone");
    if (!phone) {
      submitEvent.preventDefault();
      submitEvent.stopPropagation();
      return;
    }

    // 2) Validar políticas
    const accepted = validatePrivacyPolicy("privacyPolicy");
    if (!accepted) {
      submitEvent.preventDefault();
      submitEvent.stopPropagation();
      return;
    }

    // 3) Validar email requerido (si Webflow ya lo tiene required, esto es extra)
    const emailValue = String(emailElement?.value || "").trim();
    if (!emailValue) {
      emailElement?.setCustomValidity("Ingresa tu correo para continuar.");
      emailElement?.reportValidity();
      submitEvent.preventDefault();
      submitEvent.stopPropagation();
      return;
    }
    emailElement?.setCustomValidity("");

    // 4) Evento CleverTap (Event properties)
    sendCleverTapEventEventOnly("form_aniversario_nequi_web", {
      Phone: phone, // identificador
      full_name: String(fullNameElement?.value || "").trim(),
      company: String(companyElement?.value || "").trim(),
      role: String(roleElement?.value || "").trim(),
      email: emailValue,
      privacyPolicy: true,
    });
  });
}


