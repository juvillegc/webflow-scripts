/**
 * profiler-b2b.js
 * -----------------------------------------------------------------------------
 * Perfilador B2B (Webflow)
 * - Muestra/oculta steps
 * - Lee respuestas del usuario
 * - Calcula resultado final
 * - Pinta Success (result / result-multi)
 * - Envía evento a CleverTap (identificación SOLO por Phone)
 */

import { sendCleverTapEventEventOnly } from './services/event.clevertap.eventOnly.js';

import {
  // phone helpers
  configurePhoneInput,
  onlyDigits,
  isValidPhone10,

  // stepper helpers
  createDisplayCache,
  showOnlyStep,
  requireRadio,
  readInputValue,
  readCheckboxChecked,
  requireAtLeastOneCheckbox,
  showStepError,
} from './shared/utils.js';

// ---------------------------------------------------------------------------
// 1) Configuración (IDs / Selectores)
// ---------------------------------------------------------------------------

const STEP_IDS = [
  'step_0',
  'step_1',

  // Cobrar
  'step_2_collect_channel',
  'step_collect_web_method',

  // Pagar
  'step_2_pay_types',
  'step_pay_mode',
  'step_integration_team',

  // Marketing
  'step_2_marketing_channel',

  // Reutilizables
  'step_volume',
  'legal',
];

// ✅ IDs reales del step_0 (confirmados por ti)
const INPUT_IDS = Object.freeze({
  firstName: 'full_name',
  lastName: 'last_name',
  email: 'email_input',
  phone: 'phone_input',
});

const PRIVACY_CHECKBOX_ID = 'privacy_policy';

const NEXT_SELECTOR = '.next-btn';
const PREV_SELECTOR = '.btn-prev';

// Pagar: checkboxes
const PAY_CHECKBOX_IDS = Object.freeze({
  socialServices: 'pay_type_social_security_services',
  suppliersEmployees: 'pay_type_suppliers_employees_beneficiaries',
});

// Resultado (Success)
const RESULT_IDS = Object.freeze({
  single: 'result',
  multi: 'result-multi',

  resTitle: 'res-title',
  resOption: 'res-option',
  resDesc: 'res-desc',
  resLegal: 'res-legal',
  resCta: 'res-cta',

  // Multi (si existen)
  res1Option: 'res1-option',
  res1Desc: 'res1-desc',
  res1Cta: 'res1-cta',
  res2Option: 'res2-option',
  res2Desc: 'res2-desc',
  res2Cta: 'res2-cta',
});

// ✅ Evento CleverTap solicitado
const CLEVERTAP_EVENT_NAME = 'b2b_perfilador_web';

// ---------------------------------------------------------------------------
// 2) Estado
// ---------------------------------------------------------------------------
const state = {
  firstName: '',
  lastName: '',
  email: '',
  phoneDigits: '',

  goal: '',

  collect_channel: '',
  website_collect_method: '',

  pay_types: [],
  pay_mode: '',
  integration_team: '',

  marketing_channel: '',

  transaction_volume: '',
  privacyAccepted: false,

  results: [],
};

window.__b2bProfilerState = state;

// ---------------------------------------------------------------------------
// 3) Validación email (simple)
// ---------------------------------------------------------------------------
const isValidEmail = (value = '') =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    String(value).toLowerCase()
  );

// ---------------------------------------------------------------------------
// 4) Resultado (según seudocódigo)
// ---------------------------------------------------------------------------
function computeResults() {
  const results = [];

  // COBRAR
  if (state.goal === 'collect') {
    if (state.collect_channel && state.collect_channel !== 'website') {
      results.push({
        option: 'App Nequi Negocios',
        desc: 'Recibe pagos en tu negocio de forma simple y segura.',
        legal: '',
        href: '/negocios/app-nequi-negocios',
      });
      return results;
    }

    if (state.collect_channel === 'website') {
      const map = {
        subscriptions: {
          option: 'API Suscripciones',
          desc: 'Automatiza cobros recurrentes para tus clientes.',
          legal: '',
          href: '/negocios/api-suscripciones',
        },
        nequi_button: {
          option: 'API Botón Nequi',
          desc: 'Recibe pagos con un botón de cobro.',
          legal: '',
          href: '/negocios/api-boton-nequi',
        },
        bnpl_credit: {
          option: 'API Crédito BNPL',
          desc: 'Ofrece pagos a crédito a tus clientes.',
          legal: '',
          href: '/negocios/api-credito-bnpl',
        },
      };

      const conf = map[state.website_collect_method];
      if (conf) results.push(conf);
      return results;
    }
  }

  // MARKETING
  if (state.goal === 'marketing') {
    const map = {
      btl: {
        option: 'Códigos por plata',
        desc: 'Activa campañas BTL con códigos para tus usuarios.',
        legal: '',
        href: '/negocios/codigos-por-plata',
      },
      ads: {
        option: 'Medios',
        desc: 'Impulsa tu alcance con pauta dentro del ecosistema.',
        legal: '',
        href: '/negocios/medios',
      },
      cashback: {
        option: 'Tienda',
        desc: 'Incentiva compras con beneficios tipo cashback.',
        legal: '',
        href: '/negocios/tienda',
      },
    };

    const conf = map[state.marketing_channel];
    if (conf) results.push(conf);
    return results;
  }

  // PAGAR
  if (state.goal === 'pay') {
    if (state.pay_mode === 'individual') {
      results.push({
        option: 'App Nequi Negocios',
        desc: 'Gestiona pagos individuales a terceros desde la app.',
        legal: '',
        href: '/negocios/app-nequi-negocios',
      });
      return results;
    }

    if (state.pay_mode === 'massive_automated') {
      const hasSocial = state.pay_types.includes('social_security_services');
      const hasSuppliers = state.pay_types.includes('suppliers_employees_beneficiaries');

      if (hasSocial) {
        results.push({
          option: 'App Nequi',
          desc: 'Para pagos de seguridad social y servicios.',
          legal: '',
          href: '/personas/descarga-app',
        });
      }
      if (hasSuppliers) {
        results.push({
          option: 'API Dispersiones',
          desc: 'Automatiza pagos masivos a proveedores/empleados/beneficiarios.',
          legal: '',
          href: '/negocios/api-dispersiones',
        });
      }

      return results;
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// 5) Pintar resultado
// ---------------------------------------------------------------------------
function paintSingleResult(result) {
  const titleEl = document.getElementById(RESULT_IDS.resTitle);
  const optionEl = document.getElementById(RESULT_IDS.resOption);
  const descEl = document.getElementById(RESULT_IDS.resDesc);
  const legalEl = document.getElementById(RESULT_IDS.resLegal);
  const ctaEl = document.getElementById(RESULT_IDS.resCta);

  if (titleEl) titleEl.textContent = 'Tu mejor opción es:';
  if (optionEl) optionEl.textContent = result?.option || '—';
  if (descEl) descEl.textContent = result?.desc || '';
  if (legalEl) legalEl.textContent = result?.legal || '';

  if (ctaEl) {
    ctaEl.setAttribute('href', result?.href || '#');
    ctaEl.setAttribute('rel', 'noopener');
  }
}

function paintMultiResults(results) {
  const opt1 = document.getElementById(RESULT_IDS.res1Option);
  const desc1 = document.getElementById(RESULT_IDS.res1Desc);
  const cta1 = document.getElementById(RESULT_IDS.res1Cta);

  const opt2 = document.getElementById(RESULT_IDS.res2Option);
  const desc2 = document.getElementById(RESULT_IDS.res2Desc);
  const cta2 = document.getElementById(RESULT_IDS.res2Cta);

  const [r1, r2] = results;

  if (opt1) opt1.textContent = r1?.option || '—';
  if (desc1) desc1.textContent = r1?.desc || '';
  if (cta1) cta1.setAttribute('href', r1?.href || '#');

  if (opt2) opt2.textContent = r2?.option || '—';
  if (desc2) desc2.textContent = r2?.desc || '';
  if (cta2) cta2.setAttribute('href', r2?.href || '#');
}

function toggleResultView(isMulti) {
  const single = document.getElementById(RESULT_IDS.single);
  const multi = document.getElementById(RESULT_IDS.multi);

  if (single) single.style.display = isMulti ? 'none' : 'block';
  if (multi) multi.style.display = isMulti ? 'block' : 'none';
}

// ---------------------------------------------------------------------------
// 6) Payload CleverTap
// ---------------------------------------------------------------------------
function buildCleverTapPayload() {
  return {
    Phone: state.phoneDigits,

    goal: state.goal,
    collect_channel: state.collect_channel,
    website_collect_method: state.website_collect_method,

    pay_types: state.pay_types.join(','),
    pay_mode: state.pay_mode,
    integration_team: state.integration_team,

    marketing_channel: state.marketing_channel,
    transaction_volume: state.transaction_volume,
    privacy_accepted: Boolean(state.privacyAccepted),

    result_count: state.results.length,
    result_1: state.results[0]?.option || '',
    result_2: state.results[1]?.option || '',
  };
}

// ---------------------------------------------------------------------------
// 7) Navegación
// ---------------------------------------------------------------------------
const displayCache = createDisplayCache(STEP_IDS);

function go(stepId) {
  showOnlyStep(stepId, STEP_IDS, displayCache);
}

function handleNext(stepId) {
  const stepEl = document.getElementById(stepId);

  if (stepId === 'step_0') {
    const firstName = readInputValue(INPUT_IDS.firstName);
    const lastName = readInputValue(INPUT_IDS.lastName);
    const email = readInputValue(INPUT_IDS.email);
    const phoneDigits = onlyDigits(readInputValue(INPUT_IDS.phone));

    if (!firstName) return showStepError('Ingresa tu nombre.', stepEl);
    if (!lastName) return showStepError('Ingresa tus apellidos.', stepEl);
    if (!email || !isValidEmail(email)) return showStepError('Ingresa un correo válido.', stepEl);
    if (!isValidPhone10(phoneDigits)) return showStepError('El número debe tener 10 dígitos.', stepEl);

    state.firstName = firstName;
    state.lastName = lastName;
    state.email = email;
    state.phoneDigits = phoneDigits;

    return go('step_1');
  }

  if (stepId === 'step_1') {
    const goal = requireRadio('goal', stepEl, 'Selecciona un objetivo.');
    if (!goal) return;

    state.goal = goal;

    if (goal === 'collect') return go('step_2_collect_channel');
    if (goal === 'pay') return go('step_2_pay_types');
    if (goal === 'marketing') return go('step_2_marketing_channel');
    return;
  }

  if (stepId === 'step_2_collect_channel') {
    const channel = requireRadio('collect_channel', stepEl, 'Selecciona un medio de cobro.');
    if (!channel) return;

    state.collect_channel = channel;
    return channel === 'website' ? go('step_collect_web_method') : go('step_volume');
  }

  if (stepId === 'step_collect_web_method') {
    const method = requireRadio('website_collect_method', stepEl, 'Selecciona cómo quieres cobrar.');
    if (!method) return;

    state.website_collect_method = method;
    return go('step_volume');
  }

  if (stepId === 'step_2_pay_types') {
    const selected = requireAtLeastOneCheckbox(
      [PAY_CHECKBOX_IDS.socialServices, PAY_CHECKBOX_IDS.suppliersEmployees],
      stepEl,
      'Selecciona al menos un tipo de pago.',
      {
        [PAY_CHECKBOX_IDS.socialServices]: 'social_security_services',
        [PAY_CHECKBOX_IDS.suppliersEmployees]: 'suppliers_employees_beneficiaries',
      }
    );
    if (!selected) return;

    state.pay_types = selected;
    return go('step_pay_mode');
  }

  if (stepId === 'step_pay_mode') {
    const mode = requireRadio('pay_mode', stepEl, 'Selecciona si los pagos son individuales o masivos.');
    if (!mode) return;

    state.pay_mode = mode;
    return mode === 'individual' ? go('step_volume') : go('step_integration_team');
  }

  if (stepId === 'step_integration_team') {
    const team = requireRadio('integration_team', stepEl, 'Selecciona tu tipo de equipo.');
    if (!team) return;

    state.integration_team = team;
    return go('step_volume');
  }

  if (stepId === 'step_2_marketing_channel') {
    const channel = requireRadio('marketing_channel', stepEl, 'Selecciona una opción.');
    if (!channel) return;

    state.marketing_channel = channel;
    return go('step_volume');
  }

  if (stepId === 'step_volume') {
    const volume = requireRadio('transaction_volume', stepEl, 'Selecciona tu volumen transaccional.');
    if (!volume) return;

    state.transaction_volume = volume;
    return go('legal');
  }
}

function handlePrev(stepId) {
  if (stepId === 'step_1') return go('step_0');

  if (stepId === 'step_2_collect_channel') return go('step_1');
  if (stepId === 'step_collect_web_method') return go('step_2_collect_channel');

  if (stepId === 'step_2_pay_types') return go('step_1');
  if (stepId === 'step_pay_mode') return go('step_2_pay_types');
  if (stepId === 'step_integration_team') return go('step_pay_mode');

  if (stepId === 'step_2_marketing_channel') return go('step_1');

  if (stepId === 'step_volume') {
    if (state.goal === 'collect') {
      return state.collect_channel === 'website'
        ? go('step_collect_web_method')
        : go('step_2_collect_channel');
    }
    if (state.goal === 'pay') {
      return state.pay_mode === 'massive_automated'
        ? go('step_integration_team')
        : go('step_pay_mode');
    }
    if (state.goal === 'marketing') return go('step_2_marketing_channel');
    return go('step_1');
  }

  if (stepId === 'legal') return go('step_volume');
}

// ---------------------------------------------------------------------------
// 8) Submit Webflow
// ---------------------------------------------------------------------------
function handleSubmit(event) {
  const privacyAccepted = readCheckboxChecked(PRIVACY_CHECKBOX_ID);

  if (!privacyAccepted) {
    event.preventDefault();
    alert('Debes aceptar las políticas de tratamiento de datos.');
    return;
  }

  state.privacyAccepted = true;
  state.results = computeResults();

  const isMulti = state.results.length > 1;
  toggleResultView(isMulti);

  if (isMulti) paintMultiResults(state.results);
  else paintSingleResult(state.results[0]);

  sendCleverTapEventEventOnly(CLEVERTAP_EVENT_NAME, buildCleverTapPayload());
}

// ---------------------------------------------------------------------------
// 9) Boot
// ---------------------------------------------------------------------------
function boot() {
  configurePhoneInput(INPUT_IDS.phone);

  document.addEventListener('click', (event) => {
    const nextBtn = event.target.closest(NEXT_SELECTOR);
    const prevBtn = event.target.closest(PREV_SELECTOR);
    if (!nextBtn && !prevBtn) return;

    const stepEl = event.target.closest(STEP_IDS.map((id) => `#${id}`).join(','));
    if (!stepEl) return;

    event.preventDefault();

    const stepId = stepEl.id;
    if (nextBtn) handleNext(stepId);
    if (prevBtn) handlePrev(stepId);
  });

  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', handleSubmit);

    const done = form.parentElement?.querySelector('.w-form-done');
    if (done) {
      const obs = new MutationObserver(() => {
        const visible = getComputedStyle(done).display !== 'none' && done.offsetParent !== null;
        if (visible) {
          const isMulti = state.results.length > 1;
          toggleResultView(isMulti);
          if (isMulti) paintMultiResults(state.results);
          else paintSingleResult(state.results[0]);
        }
      });
      obs.observe(done, { attributes: true, attributeFilter: ['style', 'class'] });
    }
  }

  go('step_0');
  console.info('[b2b-profiler] booted');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
