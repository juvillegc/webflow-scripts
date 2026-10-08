
import {
  configurePhoneInput,
  validDocumentNumber,
} from "./shared/utils.js";

const CONFIG = Object.freeze({
  formId: "pizza_master_form",
  maxFileSize: 10 * 1024 * 1024,
  allowedFileTypes: [
    "application/pdf",
    "image/jpeg",
    "image/png",
  ],
});

const IDS = Object.freeze({
  fullName: "full_name",
  phone: "phone_number",
  documentType: "document_type",
  documentNumber: "document_number",
  businessName: "business_name",
  purchaseDate: "purchase_date",
  purchaseAmount: "purchase_amount",
  receipt: "purchase_receipt",
  terms: "accept_terms",
});

/**
 * @param {string} id
 * @returns {HTMLElement|null}
 */
const getElement = (id) => {
  return document.getElementById(id);
};

/**
 * @param {HTMLElement|null} element
 * @returns {HTMLInputElement|null}
 */
const resolveFileInput = (element) => {
  if (!element) return null;

  if (element.matches('input[type="file"]')) {
    return element;
  }

  return (
    element.querySelector('input[type="file"]') ||
    element.closest(".w-file-upload")
      ?.querySelector('input[type="file"]') ||
    null
  );
};

/**
 * @param {HTMLInputElement|null} input
 * @returns {void}
 */
const configureTextInput = (input) => {
  if (!input) return;

  input.required = true;
  input.maxLength = 150;
};

/**
 * @param {HTMLInputElement|null} input
 * @returns {void}
 */
const configureDocumentNumber = (input) => {
  if (!input) return;

  input.required = true;
  input.onkeypress = validDocumentNumber;
};

/**
 * @param {HTMLInputElement|null} input
 * @returns {void}
 */
const configurePurchaseDate = (input) => {
  if (!input) return;

  input.type = "date";
  input.lang = "es-CO";
  input.required = true;

  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  input.max = `${year}-${month}-${day}`;

  input.addEventListener("click", () => {
    if (typeof input.showPicker !== "function") {
      return;
    }

    try {
      input.showPicker();
    } catch {
      // Mantener el selector nativo.
    }
  });
};

/**
 * @param {HTMLInputElement|null} input
 * @returns {void}
 */
const configurePurchaseAmount = (input) => {
  if (!input) return;

  input.type = "text";
  input.inputMode = "numeric";
  input.required = true;
  input.pattern = "[0-9]+";

  const normalizeAmount = () => {
    input.value = input.value.replace(/\D/g, "");
  };

  input.addEventListener(
    "input",
    normalizeAmount
  );

  input.addEventListener(
    "change",
    normalizeAmount
  );

  normalizeAmount();
};

/**
 * @param {HTMLInputElement|null} input
 * @returns {boolean}
 */
const validateReceipt = (input) => {
  if (!input) return false;

  const file = input.files?.[0];

  if (!file) {
    input.setCustomValidity(
      "Adjunta el comprobante de compra."
    );

    return false;
  }

  if (!CONFIG.allowedFileTypes.includes(file.type)) {
    input.setCustomValidity(
      "El archivo debe ser PDF, JPG o PNG."
    );

    return false;
  }

  if (file.size > CONFIG.maxFileSize) {
    input.setCustomValidity(
      "El archivo no puede superar los 10 MB."
    );

    return false;
  }

  input.setCustomValidity("");

  return true;
};

/**
 * @param {HTMLInputElement|null} input
 * @returns {void}
 */
const configureReceipt = (input) => {
  if (!input) {
    console.warn(
      "[Pizza Master] No se encontró el comprobante."
    );

    return;
  }

  input.accept = ".pdf,.jpg,.jpeg,.png";
  input.required = true;

  input.addEventListener("change", () => {
    validateReceipt(input);
  });
};

/**
 * @param {HTMLFormElement} form
 * @param {HTMLInputElement|null} receipt
 * @returns {void}
 */
const configureSubmit = (form, receipt) => {
  form.addEventListener("submit", (event) => {
    const receiptValid = receipt
      ? validateReceipt(receipt)
      : false;

    if (!receiptValid || !form.checkValidity()) {
      event.preventDefault();

      if (receipt && !receiptValid) {
        receipt.reportValidity();
      } else {
        form.reportValidity();
      }

      return;
    }

    console.log(
      "[Pizza Master] Formulario válido."
    );

    // Webflow continúa con el envío nativo.
    // No enviamos eventos a CleverTap.
  });
};

/**
 * @returns {void}
 */
const main = () => {
  const formBlock = getElement(CONFIG.formId);

  const form = formBlock?.matches("form")
    ? formBlock
    : formBlock?.querySelector("form");

  if (!form) {
    console.warn(
      "[Pizza Master] No se encontró el formulario."
    );

    return;
  }

  const inputFullName = getElement(
    IDS.fullName
  );

  const inputDocumentType = getElement(
    IDS.documentType
  );

  const inputDocumentNumber = getElement(
    IDS.documentNumber
  );

  const inputBusinessName = getElement(
    IDS.businessName
  );

  const inputPurchaseDate = getElement(
    IDS.purchaseDate
  );

  const inputPurchaseAmount = getElement(
    IDS.purchaseAmount
  );

  const inputTerms = getElement(
    IDS.terms
  );

  const inputReceipt = resolveFileInput(
    getElement(IDS.receipt)
  );

  configureTextInput(inputFullName);
  configureTextInput(inputBusinessName);

  configurePhoneInput(IDS.phone);

  configureDocumentNumber(
    inputDocumentNumber
  );

  if (inputDocumentType) {
    inputDocumentType.required = true;
  }

  configurePurchaseDate(
    inputPurchaseDate
  );

  configurePurchaseAmount(
    inputPurchaseAmount
  );

  configureReceipt(inputReceipt);

  if (inputTerms) {
    inputTerms.required = true;
  }

  configureSubmit(form, inputReceipt);

  console.log(
    "[Pizza Master] Formulario inicializado."
  );
};

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    main,
    { once: true }
  );
} else {
  main();
}
