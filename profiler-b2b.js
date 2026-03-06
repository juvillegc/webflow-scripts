/**
 * profiler-b2b.js
 * -----------------------------------------------------------------------------
 * Perfilador B2B (Webflow)
 * - Muestra/oculta steps
 * - Lee respuestas del usuario
 * - Calcula resultado final
 * - Pinta Success (solo #result con 1 o 2 CTAs)
 * - Envía evento a CleverTap (identificación SOLO por Phone)
 */

import {
  // utilidades existentes
  configurePhoneInput,
  validatePhone,
  validatePrivacyPolicy,

  // helpers b2b (stepper)
  createDisplayCache,
  showOnlyStep,
  requireRadio,
  readInputValue,
  requireAtLeastOneCheckbox,
  showStepError,
} from "./shared/utils.js";

import { sendCleverTapEventEventOnly } from "./services/event.clevertap.eventOnly.js";

// ---------------------------------------------------------------------------
// 1) Configuración (IDs / Selectores)
// ---------------------------------------------------------------------------

const STEP_IDS = [
  "step_0",
  "step_1",

  // Cobrar
  "step_2_collect_channel",
  "step_collect_web_method",

  // Pagar
  "step_2_pay_types",
  "step_pay_mode",
  "step_integration_team",

  // Marketing
  "step_2_marketing_channel",

  // Reutilizables
  "step_volume",
  "legal",
];

const INPUT_IDS = Object.freeze({
  firstName: "full_name",
  lastName: "last_name",
  email: "email_input",
  phone: "phone_input",
});

const PRIVACY_CHECKBOX_ID = "privacy_policy";

const NEXT_SELECTOR = ".next-btn";
const PREV_SELECTOR = ".btn-prev";

const PAY_CHECKBOX_IDS = Object.freeze({
  socialServices: "pay_type_social_security_services",
  suppliersEmployees: "pay_type_suppliers_employees_beneficiaries",
});

// Success (solo result)
const RESULT_IDS = Object.freeze({
  resTitle: "res-title",
  resOption: "res-option",
  resDesc: "res-desc",
  resLegal: "res-legal",
  cta1: "res-cta",
  cta2: "res-cta-2", // ← debes crearlo en Webflow y dejarlo display:none
});

const CLEVERTAP_EVENT_NAME = "b2b_perfilador_web";

// ---------------------------------------------------------------------------
// 2) Estado
// ---------------------------------------------------------------------------

const state = {
  // datos
  firstName: "",
  lastName: "",
  email: "",
  phone: "",

  // Q1 objetivo
  goal: "",

  // Cobrar
  collect_channel: "",
  website_collect_method: "",

  // Pagar
  pay_types: [],
  pay_mode: "",
  integration_team: "",

  // Marketing
  marketing_channel: "",

  // Reutilizables
  transaction_volume: "",
  privacyAccepted: false,

  // Resultado final (1 o 2)
  results: [],
};

window.__b2bProfilerState = state;

// ---------------------------------------------------------------------------
// 3) Validación email (ligera)
// ---------------------------------------------------------------------------
const isValidEmail = (value = "") =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    String(value).toLowerCase()
  );

// ---------------------------------------------------------------------------
// 4) Compute results (según tu seudocódigo)
// ---------------------------------------------------------------------------
function computeResults() {
  const results = [];

 // COBRAR
if (state.goal === "collect") {
  // Mapa para canales que NO son website
  const collectChannelMap = {
    physical_store: {
      option: "API Suscripciones",
      desc: "Automatiza cobros recurrentes para tus clientes.",
      legal: "",
      href: "/negocios/api-suscripciones",
    },
    internal_systems: {
      option: "API Dispersiones",
      desc: "Automatiza pagos y dispersión desde tus sistemas internos.",
      legal: "",
      href: "/negocios/api-dispersiones",
    },
    social_media: {
      option: "App Nequi Negocios",
      desc: "Recibe pagos en tu negocio de forma simple y segura.",
      legal: "",
      href: "/negocios/app-nequi-negocios",
    },
    app: {
      option: "App Nequi Negocios",
      desc: "Recibe pagos en tu negocio de forma simple y segura.",
      legal: "",
      href: "/negocios/app-nequi-negocios",
    },
  };

  // Si NO es website, resolvemos directo por mapa
  if (state.collect_channel && state.collect_channel !== "website") {
    const conf = collectChannelMap[state.collect_channel];
    if (conf) results.push(conf);
    return results;
  }

  // Si es website → depende del método
  if (state.collect_channel === "website") {
    const webMethodMap = {
      subscriptions: {
        option: "API Suscripciones",
        desc: "Automatiza cobros recurrentes para tus clientes.",
        legal: "",
        href: "/negocios/api-suscripciones",
      },
      nequi_button: {
        option: "API Botón Nequi",
        desc: "Recibe pagos con un botón de cobro.",
        legal: "",
        href: "/negocios/api-boton-nequi",
      },
      bnpl_credit: {
        option: "API Crédito BNPL",
        desc: "Ofrece pagos a crédito a tus clientes.",
        legal: "",
        href: "/negocios/api-credito-bnpl",
      },
    };

    const conf = webMethodMap[state.website_collect_method];
    if (conf) results.push(conf);
    return results;
  }
}
  // MARKETING
  if (state.goal === "marketing") {
    const map = {
      btl: {
        option: "Códigos por plata",
        desc: "Activa campañas BTL con códigos para tus usuarios.",
        legal: "",
        href: "/negocios/codigos-por-plata",
      },
      ads: {
        option: "Medios",
        desc: "Impulsa tu alcance con pauta dentro del ecosistema.",
        legal: "",
        href: "/negocios/medios",
      },
      cashback: {
        option: "Tienda",
        desc: "Incentiva compras con beneficios tipo cashback.",
        legal: "",
        href: "/negocios/tienda",
      },
    };

    const conf = map[state.marketing_channel];
    if (conf) results.push(conf);
    return results;
  }

  // PAGAR
  if (state.goal === "pay") {
    // Individual → App Negocios
    if (state.pay_mode === "individual") {
      results.push({
        option: "App Nequi Negocios",
        desc: "Gestiona pagos individuales a terceros desde la app.",
        legal: "",
        href: "/negocios/app-nequi-negocios",
      });
      return results;
    }

    // Masivo → 1 o 2 resultados según checkboxes
    if (state.pay_mode === "massive_automated") {
      const hasSocial = state.pay_types.includes("social_security_services");
      const hasSuppliers = state.pay_types.includes(
        "suppliers_employees_beneficiaries"
      );

      if (hasSocial) {
        results.push({
          option: "App Nequi",
          desc: "Para pagos de seguridad social y servicios.",
          legal: "",
          href: "/personas/descarga-app",
        });
      }

      if (hasSuppliers) {
        results.push({
          option: "API Dispersiones",
          desc: "Automatiza pagos masivos a proveedores/empleados/beneficiarios.",
          legal: "",
          href: "/negocios/api-dispersiones",
        });
      }

      return results;
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// 5) Pintar Success (1 o 2 CTAs) dentro de #result
// ---------------------------------------------------------------------------

function setLink(el, { text, href }) {
  if (!el) return;
  if (typeof text === "string") el.textContent = text;
  el.setAttribute("href", href || "#");
  el.setAttribute("rel", "noopener");
}

function toggleDisplay(el, show, display = "inline-block") {
  if (!el) return;
  el.style.display = show ? display : "none";
}

function paintResult(results) {
  const titleEl = document.getElementById(RESULT_IDS.resTitle);
  const optionEl = document.getElementById(RESULT_IDS.resOption);
  const descEl = document.getElementById(RESULT_IDS.resDesc);
  const legalEl = document.getElementById(RESULT_IDS.resLegal);

  const cta1 = document.getElementById(RESULT_IDS.cta1);
  const cta2 = document.getElementById(RESULT_IDS.cta2);

  const primary = results?.[0] || null;
  const secondary = results?.[1] || null;

  // 1 resultado
  if (!secondary) {
    if (titleEl) titleEl.textContent = "Tu mejor opción es:";
    if (optionEl) optionEl.textContent = primary?.option || "—";
    if (descEl) descEl.textContent = primary?.desc || "";
    if (legalEl) legalEl.textContent = primary?.legal || "";

    setLink(cta1, { text: "Conocer más", href: primary?.href });
    toggleDisplay(cta2, false);
    return;
  }

  // 2 resultados (sin duplicar layout)
  if (titleEl) titleEl.textContent = "Tus mejores opciones son:";
  if (optionEl) optionEl.textContent = ""; // opcional: evita “repetir”
  if (descEl) descEl.textContent = "Elige la opción que más se ajuste a tu necesidad.";
  if (legalEl) legalEl.textContent = "";

  // CTA1 = resultado 1
  setLink(cta1, {
    text: primary?.option ? `Conocer ${primary.option}` : "Conocer opción 1",
    href: primary?.href,
  });

  // CTA2 = resultado 2
  toggleDisplay(cta2, true);
  setLink(cta2, {
    text: secondary?.option ? `Conocer ${secondary.option}` : "Conocer opción 2",
    href: secondary?.href,
  });
}

// ---------------------------------------------------------------------------
// 6) Payload CleverTap (event-only)
// ---------------------------------------------------------------------------
function buildCleverTapPayload() {
  return {
    Phone: state.phone, // importante: tu service identifica SOLO con Phone

    full_name: state.firstName,
    last_name: state.lastName,
    email: state.email,

    goal: state.goal,

    collect_channel: state.collect_channel,
    website_collect_method: state.website_collect_method,

    pay_types: state.pay_types.join(","),
    pay_mode: state.pay_mode,
    integration_team: state.integration_team,

    marketing_channel: state.marketing_channel,
    transaction_volume: state.transaction_volume,

    privacy_accepted: Boolean(state.privacyAccepted),

    result_count: state.results.length,
    result_1: state.results[0]?.option || "",
    result_2: state.results[1]?.option || "",
  };
}

// ---------------------------------------------------------------------------
// 7) Stepper (Next / Prev)
// ---------------------------------------------------------------------------
const displayCache = createDisplayCache(STEP_IDS);

function go(stepId) {
  showOnlyStep(stepId, STEP_IDS, displayCache);
}

function handleNext(stepId) {
  const stepEl = document.getElementById(stepId);

  // STEP 0
  if (stepId === "step_0") {
    const firstName = readInputValue(INPUT_IDS.firstName);
    const lastName = readInputValue(INPUT_IDS.lastName);
    const email = readInputValue(INPUT_IDS.email);

    // ✅ reusa validatePhone del utils (reportValidity + return phone o null)
    const phone = validatePhone(INPUT_IDS.phone);
    if (!phone) return;

    if (!firstName) return showStepError("Ingresa tu nombre.", stepEl);
    if (!lastName) return showStepError("Ingresa tus apellidos.", stepEl);
    if (!email || !isValidEmail(email))
      return showStepError("Ingresa un correo válido.", stepEl);

    state.firstName = firstName;
    state.lastName = lastName;
    state.email = email;
    state.phone = String(phone).trim();

    return go("step_1");
  }

  // STEP 1: objetivo
  if (stepId === "step_1") {
    const goal = requireRadio("goal", stepEl, "Selecciona un objetivo.");
    if (!goal) return;

    state.goal = goal;

    if (goal === "collect") return go("step_2_collect_channel");
    if (goal === "pay") return go("step_2_pay_types");
    if (goal === "marketing") return go("step_2_marketing_channel");
    return;
  }

  // COBRAR: canal
  if (stepId === "step_2_collect_channel") {
    const channel = requireRadio("collect_channel", stepEl, "Selecciona un medio de cobro.");
    if (!channel) return;

    state.collect_channel = channel;
    return channel === "website" ? go("step_collect_web_method") : go("step_volume");
  }

  // COBRAR: método web
  if (stepId === "step_collect_web_method") {
    const method = requireRadio("website_collect_method", stepEl, "Selecciona cómo quieres cobrar.");
    if (!method) return;

    state.website_collect_method = method;
    return go("step_volume");
  }

  // PAGAR: tipos (checkbox)
  if (stepId === "step_2_pay_types") {
    const selected = requireAtLeastOneCheckbox(
      [PAY_CHECKBOX_IDS.socialServices, PAY_CHECKBOX_IDS.suppliersEmployees],
      stepEl,
      "Selecciona al menos un tipo de pago.",
      {
        [PAY_CHECKBOX_IDS.socialServices]: "social_security_services",
        [PAY_CHECKBOX_IDS.suppliersEmployees]: "suppliers_employees_beneficiaries",
      }
    );
    if (!selected) return;

    state.pay_types = selected;
    return go("step_pay_mode");
  }

  // PAGAR: modo
  if (stepId === "step_pay_mode") {
    const mode = requireRadio("pay_mode", stepEl, "Selecciona si los pagos son individuales o masivos.");
    if (!mode) return;

    state.pay_mode = mode;
    return mode === "individual" ? go("step_volume") : go("step_integration_team");
  }

  // PAGAR: equipo
  if (stepId === "step_integration_team") {
    const team = requireRadio("integration_team", stepEl, "Selecciona tu tipo de equipo.");
    if (!team) return;

    state.integration_team = team;
    return go("step_volume");
  }

  // MARKETING
  if (stepId === "step_2_marketing_channel") {
    const channel = requireRadio("marketing_channel", stepEl, "Selecciona una opción.");
    if (!channel) return;

    state.marketing_channel = channel;
    return go("step_volume");
  }

  // VOLUMEN
  if (stepId === "step_volume") {
    const volume = requireRadio("transaction_volume", stepEl, "Selecciona tu volumen transaccional.");
    if (!volume) return;

    state.transaction_volume = volume;
    return go("legal");
  }
}

function handlePrev(stepId) {
  if (stepId === "step_1") return go("step_0");

  if (stepId === "step_2_collect_channel") return go("step_1");
  if (stepId === "step_collect_web_method") return go("step_2_collect_channel");

  if (stepId === "step_2_pay_types") return go("step_1");
  if (stepId === "step_pay_mode") return go("step_2_pay_types");
  if (stepId === "step_integration_team") return go("step_pay_mode");

  if (stepId === "step_2_marketing_channel") return go("step_1");

  if (stepId === "step_volume") {
    if (state.goal === "collect") {
      return state.collect_channel === "website"
        ? go("step_collect_web_method")
        : go("step_2_collect_channel");
    }

    if (state.goal === "pay") {
      return state.pay_mode === "massive_automated"
        ? go("step_integration_team")
        : go("step_pay_mode");
    }

    if (state.goal === "marketing") return go("step_2_marketing_channel");
    return go("step_1");
  }

  if (stepId === "legal") return go("step_volume");
}

// ---------------------------------------------------------------------------
// 8) Submit Webflow
// ---------------------------------------------------------------------------
function handleSubmit(event) {
  // ✅ reusa validatePrivacyPolicy del utils
  const accepted = validatePrivacyPolicy(PRIVACY_CHECKBOX_ID);
  if (!accepted) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  state.privacyAccepted = true;

  // Calcula y pinta resultado
  state.results = computeResults();
  paintResult(state.results);

  // Evento CleverTap
  sendCleverTapEventEventOnly(CLEVERTAP_EVENT_NAME, buildCleverTapPayload());
}

// ---------------------------------------------------------------------------
// 9) Bootstrap
// ---------------------------------------------------------------------------
function boot() {
  // Phone UX (max 10, bloquear paste, error message, etc)
  configurePhoneInput(INPUT_IDS.phone);

  // Delegación Next/Prev
  document.addEventListener("click", (event) => {
    const nextBtn = event.target.closest(NEXT_SELECTOR);
    const prevBtn = event.target.closest(PREV_SELECTOR);
    if (!nextBtn && !prevBtn) return;

    const stepEl = event.target.closest(STEP_IDS.map((id) => `#${id}`).join(","));
    if (!stepEl) return;

    event.preventDefault();

    const stepId = stepEl.id;
    if (nextBtn) handleNext(stepId);
    if (prevBtn) handlePrev(stepId);
  });

  // Hook submit del form
  const formElement = document.querySelector("form");
  formElement?.addEventListener("submit", handleSubmit);

  // Init
  go("step_0");
  console.info("[b2b-profiler] booted");
}

document.addEventListener("DOMContentLoaded", boot, { once: true });
