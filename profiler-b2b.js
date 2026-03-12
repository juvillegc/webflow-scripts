/**
 * profiler-b2b.js
 * -----------------------------------------------------------------------------
 * Perfilador B2B (Webflow)
 * - Muestra/oculta steps
 * - Lee respuestas del usuario
 * - Calcula resultado final
 * - Pinta Success (solo #result con 1 CTA)
 * - Envía evento a CleverTap (identificación SOLO por Phone)
 */

import {
  configurePhoneInput,
  validatePhone,
  validatePrivacyPolicy,

  createDisplayCache,
  showOnlyStep,
  requireRadio,
  readInputValue,
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
  "step_2_pay_types",      // ahora es RADIO pay_type
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

// Success (solo result)
const RESULT_IDS = Object.freeze({
  resTitle: "res-title",
  resOption: "res-option",
  resDesc: "res-desc",
  resLegal: "res-legal",
  cta1: "res-cta",
});

const CLEVERTAP_EVENT_NAME = "b2b_perfilador_web";

// ---------------------------------------------------------------------------
// 2) Estado
// ---------------------------------------------------------------------------

const state = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",

  goal: "",

  // Cobrar
  collect_channel: "",
  website_collect_method: "",

  // Pagar
  pay_type: "",            // ✅ NUEVO (radio)
  pay_mode: "",
  integration_team: "",

  // Marketing
  marketing_channel: "",

  // Reutilizables
  transaction_volume: "",  // menos_10000 | entre_10000_100000 | mas_100000
  privacyAccepted: false,

  results: [],             // ahora siempre 1
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
// 4) Compute results (tu lógica nueva)
// ---------------------------------------------------------------------------

function computeResults() {
  const results = [];

  // -------------------- COBRAR --------------------
  if (state.goal === "collect") {
    // Directo por canal (NO website)
    const collectChannelMap = {
      physical_store: {
        option: "App Nequi Negocios",
        desc: "Recibe pagos en tu negocio de forma simple y segura.",
        legal: "",
        href: "/negocios/app-negocios#descarga-app-negocios",
      },
      social_media: {
        option: "App Nequi Negocios",
        desc: "Recibe pagos en tu negocio de forma simple y segura.",
        legal: "",
        href: "/negocios/app-negocios#descarga-app-negocios",
      },
      app: {
        option: "API Suscripciones",
        desc: "Automatiza cobros recurrentes para tus clientes.",
        legal: "",
        href: "/negocios/pagos-recurrentes",
      },
      internal_systems: {
        option: "API Botón Nequi",
        desc: "Integra un botón de pago desde tus sistemas internos.",
        legal: "",
        href: "/negocios/pago-en-linea",
      },
    };

    if (state.collect_channel && state.collect_channel !== "website") {
      const conf = collectChannelMap[state.collect_channel];
      if (conf) results.push(conf);
      return results;
    }

    // Website → método
    if (state.collect_channel === "website") {
      const webMethodMap = {
        subscriptions: {
          option: "API Suscripciones",
          desc: "Automatiza cobros recurrentes para tus clientes.",
          legal: "",
          href: "/negocios/pagos-recurrentes",
        },
        nequi_button: {
          option: "API Botón Nequi",
          desc: "Recibe pagos con un botón de cobro.",
          legal: "",
          href: "/negocios/pago-en-linea",
        },
        bnpl_credit: {
          option: "API Botón Nequi",
          // 👇 párrafo especial SOLO para esta opción
          desc: "Con la posibilidad de cobrar a tus clientes con Crédito Nequi.",
          legal: "",
          href: "/negocios/pago-en-linea",
        },
      };

      const conf = webMethodMap[state.website_collect_method];
      if (conf) results.push(conf);
      return results;
    }
  }

  // -------------------- MARKETING --------------------
  if (state.goal === "marketing") {
    const map = {
      incentives: {
        option: "Códigos por plata",
        desc: "Activa campañas, entrega incentivos o premios entregando plata a través de Códigos QR",
        legal: "",
        href: "/negocios/codigos-por-plata",
      },
      ads: {
        option: "Nequi Ads",
        desc: "Impulsa tu alcance con pauta dentro del ecosistema Nequi.",
        legal: "",
        href: "/negocios/publicidad-en-app-nequi",
      },
      cashback: {
        option: "Tienda",
        desc: "Incentiva compras en tu negocio con beneficios tipo cashback.",
        legal: "",
        href: "/negocios/tienda-virtual",
      },
    };

    const conf = map[state.marketing_channel];
    if (conf) results.push(conf);
    return results;
  }

  // -------------------- PAGAR A TERCEROS --------------------
  if (state.goal === "pay") {
    // Caso: seguridad social/servicios → App Negocios descarga
    if (state.pay_type === "social_security_services") {
      results.push({
        option: "App Nequi Negocios",
        desc: "Gestiona pagos de seguridad social y servicios desde la app.",
        legal: "",
        href: "/negocios/app-negocios#descarga-app-negocios",
      });
      return results;
    }

    // Caso: proveedores/empleados/beneficiarios
    if (state.pay_type === "suppliers_employees_beneficiaries") {
      // Individual → App Negocios descarga
      if (state.pay_mode === "individual") {
        results.push({
          option: "App Nequi Negocios",
          desc: "Gestiona pagos individuales a terceros desde la app.",
          legal: "",
          href: "/negocios/app-negocios#descarga-app-negocios",
        });
        return results;
      }

      // Masivo → API Dispersiones
      if (state.pay_mode === "massive_automated") {
        results.push({
          option: "API Dispersiones",
          desc: "Automatiza pagos masivos a proveedores, empleados y beneficiarios.",
          legal: "",
          href: "/negocios/dispersiones-de-plata",
        });
        return results;
      }
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// 5) Pintar Success (1 CTA)
// ---------------------------------------------------------------------------

function setLink(el, { text, href }) {
  if (!el) return;
  if (typeof text === "string") el.textContent = text;
  el.setAttribute("href", href || "#");
  el.setAttribute("rel", "noopener");
}

function paintResult(results) {
  const titleEl = document.getElementById(RESULT_IDS.resTitle);
  const optionEl = document.getElementById(RESULT_IDS.resOption);
  const descEl = document.getElementById(RESULT_IDS.resDesc);
  const legalEl = document.getElementById(RESULT_IDS.resLegal);
  const cta1 = document.getElementById(RESULT_IDS.cta1);

  const primary = results?.[0] || null;

  if (titleEl) titleEl.textContent = "Tu mejor opción es:";
  if (optionEl) optionEl.textContent = primary?.option || "—";
  if (descEl) descEl.textContent = primary?.desc || "";
  if (legalEl) legalEl.textContent = primary?.legal || "";

  setLink(cta1, { text: "Conocer más", href: primary?.href });
}

// ---------------------------------------------------------------------------
// 6) Payload CleverTap (event-only)
// ---------------------------------------------------------------------------

function buildCleverTapPayload() {
  return {
    Phone: state.phone,

    full_name: state.firstName,
    last_name: state.lastName,
    email: state.email,

    goal: state.goal,

    collect_channel: state.collect_channel,
    website_collect_method: state.website_collect_method,

    pay_type: state.pay_type,
    pay_mode: state.pay_mode,
    integration_team: state.integration_team,

    marketing_channel: state.marketing_channel,
    transaction_volume: state.transaction_volume,

    privacy_accepted: Boolean(state.privacyAccepted),

    result_1: state.results[0]?.option || "",
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

    const phone = validatePhone(INPUT_IDS.phone);
    if (!phone) return;

    if (!firstName) return showStepError("Ingresa tu nombre.", stepEl);
    if (!lastName) return showStepError("Ingresa tus apellidos.", stepEl);
    if (!email || !isValidEmail(email)) return showStepError("Ingresa un correo válido.", stepEl);

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

  // ---------------- COBRAR ----------------
  if (stepId === "step_2_collect_channel") {
    const channel = requireRadio("collect_channel", stepEl, "Selecciona un medio de cobro.");
    if (!channel) return;

    state.collect_channel = channel;
    return channel === "website" ? go("step_collect_web_method") : go("step_volume");
  }

  if (stepId === "step_collect_web_method") {
    const method = requireRadio("website_collect_method", stepEl, "Selecciona cómo quieres cobrar.");
    if (!method) return;

    state.website_collect_method = method;
    return go("step_volume");
  }

  // ---------------- PAGAR A TERCEROS ----------------
  if (stepId === "step_2_pay_types") {
    const payType = requireRadio("pay_type", stepEl, "Selecciona un tipo de pago.");
    if (!payType) return;

    state.pay_type = payType;

    // seguridad/servicios → directo a volumen
    if (payType === "social_security_services") return go("step_volume");

    // proveedores/empleados/beneficiarios → decide modo
    return go("step_pay_mode");
  }

  if (stepId === "step_pay_mode") {
    const mode = requireRadio("pay_mode", stepEl, "Selecciona si los pagos son individuales o masivos.");
    if (!mode) return;

    state.pay_mode = mode;

    // individuales → volumen
    if (mode === "individual") return go("step_volume");

    // masivos → equipo integración
    return go("step_integration_team");
  }

  if (stepId === "step_integration_team") {
    const team = requireRadio("integration_team", stepEl, "Selecciona tu tipo de equipo.");
    if (!team) return;

    state.integration_team = team;
    return go("step_volume");
  }

  // ---------------- MARKETING ----------------
  if (stepId === "step_2_marketing_channel") {
    const channel = requireRadio("marketing_channel", stepEl, "Selecciona una opción.");
    if (!channel) return;

    state.marketing_channel = channel;
    return go("step_volume");
  }

  // ---------------- VOLUMEN ----------------
  if (stepId === "step_volume") {
    const volume = requireRadio("transaction_volume", stepEl, "Selecciona tu volumen transaccional.");
    if (!volume) return;

    state.transaction_volume = volume;
    return go("legal");
  }
}

function handlePrev(stepId) {
  if (stepId === "step_1") return go("step_0");

  // Cobrar back
  if (stepId === "step_2_collect_channel") return go("step_1");
  if (stepId === "step_collect_web_method") return go("step_2_collect_channel");

  // Pagar back
  if (stepId === "step_2_pay_types") return go("step_1");
  if (stepId === "step_pay_mode") return go("step_2_pay_types");
  if (stepId === "step_integration_team") return go("step_pay_mode");

  // Marketing back
  if (stepId === "step_2_marketing_channel") return go("step_1");

  // Volumen back (depende del objetivo)
  if (stepId === "step_volume") {
    if (state.goal === "collect") {
      return state.collect_channel === "website"
        ? go("step_collect_web_method")
        : go("step_2_collect_channel");
    }

    if (state.goal === "marketing") return go("step_2_marketing_channel");

    if (state.goal === "pay") {
      // si venimos de seguridad/servicios → vuelve a pay_types
      if (state.pay_type === "social_security_services") return go("step_2_pay_types");

      // si venimos de proveedores...
      if (state.pay_mode === "massive_automated") return go("step_integration_team");
      return go("step_pay_mode");
    }

    return go("step_1");
  }

  if (stepId === "legal") return go("step_volume");
}

// ---------------------------------------------------------------------------
// 8) Submit Webflow
// ---------------------------------------------------------------------------

let didSubmitLogicRun = false;

function runSubmitLogic() {
  if (didSubmitLogicRun) return;
  didSubmitLogicRun = true;

  state.privacyAccepted = true;

  state.results = computeResults();
  paintResult(state.results);

  sendCleverTapEventEventOnly(CLEVERTAP_EVENT_NAME, buildCleverTapPayload());
}

function handleSubmit(event) {
  const accepted = validatePrivacyPolicy(PRIVACY_CHECKBOX_ID);
  if (!accepted) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  runSubmitLogic();
}

// ---------------------------------------------------------------------------
// 9) Bootstrap
// ---------------------------------------------------------------------------

function boot() {
  configurePhoneInput(INPUT_IDS.phone);

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

  const formElement = document.querySelector("form");
  if (formElement) {
    formElement.addEventListener("submit", handleSubmit);

    const done = formElement.parentElement?.querySelector(".w-form-done");
    if (done) {
      const obs = new MutationObserver(() => {
        const visible =
          getComputedStyle(done).display !== "none" && done.offsetParent !== null;

        if (visible) runSubmitLogic();
      });
      obs.observe(done, { attributes: true, attributeFilter: ["style", "class"] });
    }
  }

  go("step_0");
  console.info("[b2b-profiler] booted");
}

document.addEventListener("DOMContentLoaded", boot, { once: true });
