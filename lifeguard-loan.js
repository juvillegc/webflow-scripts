import {convertToDecimal, convertToPercentage, round, roundDecimals, onlyNumberKey, cleanMask, maskValue, handleKeyUpThousandSeparators} from './shared/utils.js'

const interestRateEA = 51.10; // Valor dado en %
const sure = 1450; // Valor dado en pesos ($) x cada millón
const initValue = 500000; // Valor prestamo inicial (Para que cargue una simulacion por defecto)

const interestRateMV = calculateInterestRateMV(interestRateEA);
let loanValue = null, 
numberInstallments = 1, 
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

function calculate() {
    loanValue = cleanMask(inputValue.value);

    if(!loanValue) return;

    sureCalculated = calculateSure();
    feeValue = calculateFeeValue();
    calculateVtua();
}

function printInfo() {
    document.getElementById('loan-value').innerHTML = `$ ${maskValue(loanValue)}`;
    document.getElementById('fee-value').innerHTML = `$ ${maskValue(feeValue)}`;
    document.getElementById('interest').innerHTML = `${interestRateMV} % E.M (${interestRateEA}% E.A)`;
    document.getElementById('number-installments').innerHTML = `${numberInstallments} mes`;
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

function calculateVtua() {
    vtua.total = round(feeValue * numberInstallments);
    vtua.sure = sureCalculated * numberInstallments;
    vtua.capital = Number(loanValue);
    vtua.interest = vtua.total - (vtua.sure + vtua.capital);
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
