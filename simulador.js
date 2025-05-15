import {
  convertToDecimal,
  convertToPercentage,
  round,
  roundDecimals,
  onlyNumberKey,
  cleanMask,
  maskValue,
  handleKeyUpThousandSeparators,
  validatePhoneError,
  configurePhoneInput,
  validatePhone,
  validatePrivacyPolicy
} from './shared/utils.js';

import { sendCleverTapEvent } from './services/event.clevertap.js';


const simulatorContainer = document.getElementById('simulador'); // Diferenciar el simulador
const simulatorKey = simulatorContainer?.dataset.simulator || 'lowAmount';


const simulatorConfig = {
  lowAmount: {
    interestRateEA: 56.15, // Valor dado en %
    commissionFGA: 4, // Valor dado en %
    sure: 2000, // Valor dado en pesos ($) x cada millón
    simulatorName: 'credito bajo monto' // Nombre del simulador 
  },
  freeInvestment: {
    interestRateEA: 25.52, // Valor dado en %
    commissionFGA: 10, // Valor dado en %
    sure: 1450, // Valor dado en pesos ($) x cada millón
    simulatorName: 'credito libre inversion' // Nombre del simulador 
  }
};

const iva = 19; // Valor dado en %
const initValue = 1000000; // Valor prestamo inicial (Para que cargue una simulacion por defecto)

const {
  interestRateEA,
  commissionFGA,
  sure,
  simulatorName
} = simulatorConfig[simulatorKey];

const interestRateMV = calculateInterestRateMV(interestRateEA);
const commissionFgaIva = calculateCommissionFgaIva(commissionFGA, iva);

let loanValue = 0, 
    loanValueCommission = 0, 
    numberInstallments = 0, 
    sureCalculated = 0, 
    feeValue = 0;

let vtua = {
  total: 0,
  sure: 0,
  capital: 0,
  interest: 0
};

const inputValue = document.getElementById('input-value');
const btnCalculate = document.getElementById('btn-calculate');

configurePhoneInput('phoneNumber');

init();

function init() {
  inputValue.value = maskValue(initValue);
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

const calculate = () => {
  loanValue = parseFloat(cleanMask(inputValue.value) || "0");
  numberInstallments = parseInt(document.getElementById('months').value || "0", 10);

  const phone = validatePhone();
  if (!phone) return;

  const isPrivacyAccepted = validatePrivacyPolicy();
  if (!isPrivacyAccepted) return;

  loanValueCommission = calculateLoanValueCommission();
  sureCalculated = calculateSure();
  feeValue = calculateFeeValue();
  calculateVtua();

  sendCleverTapEvent('simulador_web_exitoso', {
    Phone: phone,
    loanValue,
    months: numberInstallments,
    privacyPolicy: true,
    simulatorName
  });
};

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
  const feeValueWithoutSure = loanValueCommission / ((1 - (1 + interestRateMVDecimal) ** (numberInstallments * -1)) / interestRateMVDecimal);
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
