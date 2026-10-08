
import {
  configurePhoneInput,
  validDocumentNumber,
} from "./shared/utils.js";

const CONFIG = Object.freeze({
  formId: "pizza_master_form",
  phoneId: "phone_number",
  documentId: "document_number",
  receiptId: "purchase_receipt",
  maxFileSize: 10 * 1024 * 1024,
  allowedTypes: [
    "application/pdf",
    "image/jpeg",
    "image/png",
  ],
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
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
const validateReceipt = (input) => {
  const file = input.files?.[0];

  if (!file) {
    input.setCustomValidity(
      "Adjunta el comprobante de compra."
    );
    return false;
  }

  if (!CONFIG.allowedTypes.includes(file.type)) {
    input.setCustomValidity(
      "Adjunta un archivo PDF, JPG o PNG."
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
      "[Pizza Master] No se encontró el input del comprobante."
    );
    return;
  }

  input.accept = ".pdf,.jpg,.jpeg,.png";

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
      "[Pizza Master] Formulario válido. Envío a Webflow."
    );

    // No usamos preventDefault cuando es válido.
    // Webflow continúa con su envío nativo.
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

  const documentNumber = getElement(
    CONFIG.documentId
  );

  const receipt = resolveFileInput(
    getElement(CONFIG.receiptId)
  );

  configurePhoneInput(CONFIG.phoneId);

  if (documentNumber) {
    documentNumber.onkeypress =
      validDocumentNumber;
  }

  configureReceipt(receipt);
  configureSubmit(form, receipt);

  console.log(
    "[Pizza Master] Formulario inicializado."
  );
};

main();
