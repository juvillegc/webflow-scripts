import {convertToDecimal, convertToPercentage, round, roundDecimals, onlyNumberKey, cleanMask, maskValue, handleKeyUpThousandSeparators} from './shared/utils.js';
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

init();

function init() {
    if(!initValue) return;
    inputValue.value = maskValue(initValue);
    calculate();
    printInfo();
}

function handleClickCalculate() {
    inputValue.classList.remove('error-input');
    if(!inputValue.value){
        inputValue.classList.add('error-input');
        return;
    }
    calculate();
    printInfo();
}

/* --------- function de calcular y enviar datos clevertap ------------ */
function calculate() {
  // 1. Obtener valores de la UI
  loanValue = cleanMask(inputValue.value);
  numberInstallments = document.getElementById('months').value;
  
  // Si no hay monto o cuotas, salimos (como en tu lógica original)
  if (!loanValue || !numberInstallments) return;

  // 2. Realizar los cálculos de siempre (para mostrar simulación por defecto)
  loanValueCommission = calculateLoanValueCommission();
  sureCalculated = calculateSure();
  feeValue = calculateFeeValue();
  calculateVtua();

  // (Si tienes alguna función para pintar en la interfaz, llámala aquí)
  // printInfo();

  // 3. Verificar si el usuario ha ingresado un teléfono
  const phoneInput = document.getElementById('phoneNumber');
  const phoneError = document.getElementById('phoneError');
  const phone = phoneInput.value.trim();

  // Si el usuario no ha digitado nada, no enviamos nada a CleverTap,
  // pero tampoco detenemos el cálculo ya hecho.
  if (!phone) {
    // Puedes dejar un mensaje opcional o simplemente no hacer nada.
    // phoneError.innerText = "Teléfono vacío (opcional)";
    return;
  }

  // 4. Validar el teléfono (solo dígitos, máximo 10)
  if (!/^\d{1,10}$/.test(phone)) {
    // Mostrar error y no enviar a CleverTap
    phoneError.innerText = "Ingresa un número de teléfono válido (hasta 10 dígitos).";
    return;
  } else {
    // Borrar el mensaje de error si estaba
    phoneError.innerText = "";
  }

  // 5. Si llegamos aquí, el teléfono es válido => enviamos datos a CleverTap
  sendCleverTapEvent(phone, loanValue, numberInstallments);
}


/* --------- Validar input phoneNumber ------------ */

const phoneInput = document.getElementById('phoneNumber');
phoneInput.addEventListener("keypress", function(e) {

  if (e.charCode < 48 || e.charCode > 57) {
    e.preventDefault();
  }
  if (phoneInput.value.length >= 10) {
    e.preventDefault();
  }
});

phoneInput.addEventListener("paste", function(e){
  e.preventDefault();
});


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
    const loanValueCommission = loanValue * ( 1 + convertToDecimal(commissionFgaIva) );;
    return Math.round(loanValueCommission);
}

function calculateSure() {
    let numberSures = Math.ceil( loanValueCommission / 1000000 );
    return sure * numberSures;
}

function calculateFeeValue() {
    const interestRateMVDecimal = convertToDecimal(interestRateMV);
    const feeValueWithoutSure = (loanValueCommission / ((1 - (1 + interestRateMVDecimal) ** (numberInstallments * -1) ) / interestRateMVDecimal));
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
function calculateInterestRateMV (interestRateEA) {
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

