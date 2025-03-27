import {convertToDecimal, convertToPercentage, round, roundDecimals, onlyNumberKey, cleanMask, maskValue, handleKeyUpThousandSeparators, validatePhoneError, configurePhoneInput} from './shared/utils.js';
import { sendCleverTapEvent } from './services/event.clevertap.js';

const interestRateEA = 24.82; // Valor dado en %
const commissionFGA = 10; // Valor dado en %
const sure = 1450; // Valor dado en pesos ($) x cada millón
const iva = 19; // Valor dado en %
const initValue = 1000000; // Valor prestamo inicial (Para que cargue una simulacion por defecto)

const interestRateMV = calculateInterestRateMV(interestRateEA);
const commissionFgaIva = calculateCommissionFgaIva(commissionFGA, iva);
let loanValue = null, 
loanValueCommission = null, 
numberInstallments = null, 
sureCalculated = null, 
feeValue = null,
vtua = {
    total: null,
    sure: null,
    capital: null,
    interest: null
};

const inputValue = document.getElementById('input-value');
const btnCalculate = document.getElementById('btn-calculate');


configurePhoneInput('phoneNumber'); // Configura el input de teléfono


init();

function init() {
    inputValue = 0;
    loanValue = 0; 
    numberInstallments = 0;
    loanValueCommission = 0;
    sureCalculated = 0;
    feeValue = 0;
    printInfo();
}

function handleClickCalculate() {
    inputValue.classList.remove('error-input');
    if (!inputValue.value) {
        inputValue.classList.add('error-input');
        return;
    }
    calculate();
    printInfo();
}

/* --------- Función de cálculo y envío de datos a CleverTap ------------ */

function calculate() {

  loanValue = cleanMask(inputValue.value) || "0";
  numberInstallments = document.getElementById('months').value || "0";

  // Convertir a números si es necesario
  loanValue = parseFloat(loanValue);
  numberInstallments = parseInt(numberInstallments, 10);

  const phoneInput = document.getElementById('phoneNumber');
  const phone = phoneInput.value.trim();
  
  if (!phone || !phoneInput.checkValidity()) {
    phoneInput.setCustomValidity("El número es obligatorio y debe tener 10 dígitos.");
    phoneInput.reportValidity();  // Muestra el mensaje nativo
    return;
  } else {
    phoneInput.setCustomValidity(""); 
  }
  

  const privacyPolicyCheckbox = document.getElementById('privacyPolicy');
  if (!privacyPolicyCheckbox.checked) {
    privacyPolicyCheckbox.setCustomValidity("Debes aceptar las políticas de tratamiento de datos.");
    privacyPolicyCheckbox.reportValidity();
    return;
  } else {
    privacyPolicyCheckbox.setCustomValidity("");
  }
  

  loanValueCommission = calculateLoanValueCommission();
  sureCalculated = calculateSure();
  feeValue = calculateFeeValue();
  calculateVtua();


  sendCleverTapEvent('SimuladorDatos', {
    Phone: phone,
    loanValue: loanValue,
    months: numberInstallments,
    privacyPolicy: privacyPolicyCheckbox.checked
  });
}

function printInfo() {
    document.getElementById('loan-value').innerHTML = `$ ${maskValue(loanValue)}`;
    document.getElementById('loan-value-commission').innerHTML = `$ ${maskValue(loanValueCommission)}`;
    document.getElementById('fee-value').innerHTML = `$ ${maskValue(round(feeValue))}`;
    document.getElementById('interest').innerHTML = `${interestRateMV} % E.M (${interestRateEA}% E.A)`;
    document.getElementById('number-installments').innerHTML = `${numberInstallments} meses`;
    document.getElementById('sure').innerHTML = `$ ${maskValue(sureCalculated)}`;
    printInfoVtua();
}

function printInfoVtua() {
    if(!document.getElementById('vtua')) return;
    document.getElementById('vtua').innerHTML = `$ ${maskValue(vtua.total)}`;
    document.getElementById('vtua-sure').innerHTML = `$ ${maskValue(vtua.sure)}`;
    document.getElementById('vtua-capital').innerHTML = `$ ${maskValue(vtua.capital)}`;
    document.getElementById('vtua-interest').innerHTML = `$ ${maskValue(vtua.interest)}`;
}

/* --------- Loan Calculations ------------ */
function calculateLoanValueCommission() {
    const loanValueCommission = loanValue * (1 + convertToDecimal(commissionFgaIva));
    return Math.round(loanValueCommission);
}

function calculateSure() {
    let numberSures = Math.ceil(loanValueCommission / 1000000);
    return sure * numberSures;
}

function calculateFeeValue() {
    const interestRateMVDecimal = convertToDecimal(interestRateMV);
    const feeValueWithoutSure = (loanValueCommission / ((1 - (1 + interestRateMVDecimal) ** (numberInstallments * -1)) / interestRateMVDecimal));
    const feeValueWithSure = feeValueWithoutSure + sureCalculated;
    return roundDecimals(feeValueWithSure);
}

function calculateVtua() {
    vtua.total = round(feeValue * numberInstallments);
    vtua.sure = sureCalculated * numberInstallments;
    vtua.capital = loanValueCommission;
    vtua.interest = vtua.total - (vtua.sure + vtua.capital);
}

/* --------- Initial Calculations ------------ */
function calculateInterestRateMV(interestRateEA) {
    const interestRateEADecimal = convertToDecimal(interestRateEA);
    let interestRateMV = (1 + interestRateEADecimal) ** (1 / 12) - 1;
    interestRateMV = convertToPercentage(interestRateMV);
    return roundDecimals(interestRateMV);
}

function calculateCommissionFgaIva(commissionFGA, iva) {
    const commissionFGADecimal = convertToDecimal(commissionFGA);
    const ivaDecimal = convertToDecimal(iva);
    let commissionFgaIva = commissionFGADecimal * (1 + ivaDecimal);
    commissionFgaIva = convertToPercentage(commissionFgaIva);
    return roundDecimals(commissionFgaIva);
} 

inputValue.onkeyup = handleKeyUpThousandSeparators;
inputValue.onkeypress = onlyNumberKey;
btnCalculate.onclick = handleClickCalculate;
