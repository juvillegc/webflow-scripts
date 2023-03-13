import {convertToDecimal, convertToPercentage, roundDecimals, onlyNumberKey, cleanMask, maskValue, handleKeyUpThousandSeparators} from './shared/utils.js'

const interestRateEA = 28; // Valor dado en %
const sure = 1450; // Valor dado en pesos ($) x cada millón
const initValue = 500000; // Valor prestamo inicial (Para que cargue una simulacion por defecto)

const interestRateMV = calculateInterestRateMV(interestRateEA);
let loanValue = null, 
numberInstallments = 1, 
sureCalculated = null, 
feeValue = null;

const inputValue = document.getElementById('input-value');
const btnCalculate = document.getElementById('btn-calculate');

init();

function init() {
    if(!initValue) return;
    document.getElementById('input-value').value = maskValue(initValue);
    calculate();
    printInfo();
}

function handleClickCalculate() {
    const inputValue = document.getElementById('input-value');
    inputValue.classList.remove('error-input');
    if(!inputValue.value){
        inputValue.classList.add('error-input');
        return;
    }
    calculate();
    printInfo();
}

function calculate() {
    loanValue = cleanMask(document.getElementById('input-value').value);

    if(!loanValue) return;

    sureCalculated = calculateSure();
    feeValue = calculateFeeValue();
}

function printInfo() {
    document.getElementById('loan-value').innerHTML = `$ ${maskValue(loanValue)}`;
    document.getElementById('fee-value').innerHTML = `$ ${maskValue(feeValue)}`;
    document.getElementById('interest').innerHTML = `${interestRateMV} % E.M (${interestRateEA}% E.A)`;
    document.getElementById('number-installments').innerHTML = `${numberInstallments} mes`;
    document.getElementById('sure').innerHTML = `$ ${maskValue(sureCalculated)}`;
}

/* --------- Loan Calculations ------------ */
function calculateSure() {
    let numberSures = Math.ceil( loanValue / 1000000 );
    return sure * numberSures;
}

function calculateFeeValue() {
    const interestRateMVDecimal = convertToDecimal(interestRateMV);
    const feeValueWithoutSure = (loanValue / ((1 - (1 + interestRateMVDecimal) ** (numberInstallments * -1) ) / interestRateMVDecimal));
    const feeValueWithSure = feeValueWithoutSure + sureCalculated;
    return Math.round(feeValueWithSure);
}

/* --------- Initial Calculations ------------ */
function calculateInterestRateMV (interestRateEA) {
    const interestRateEADecimal = convertToDecimal(interestRateEA);
    let interestRateMV = (1 + interestRateEADecimal) ** (1 / 12) - 1;
    interestRateMV = convertToPercentage(interestRateMV);
    return roundDecimals(interestRateMV);
}

inputValue.onkeyup = handleKeyUpThousandSeparators;
inputValue.onkeypress = onlyNumberKey;
btnCalculate.onclick = handleClickCalculate;
