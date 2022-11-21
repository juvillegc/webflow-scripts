const interestRateEA = 26.08; // Valor dado en %
const commissionFGA = 7.5; // Valor dado en %
const sure = 1450; // Valor dado en pesos ($) x cada millón
const iva = 19; // Valor dado en %
const initValue = 1000000; // Valor prestamo inicial (Para que cargue una simulacion por defecto)
const interestRateMV = calculateInterestRateMV(interestRateEA);
const commissionFgaIva = calculateCommissionFgaIva(commissionFGA, iva);
let loanValue = null, 
loanValueCommission = null, 
numberInstallments = null, 
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

function handleKeyUpThousandSeparators(event) {
    var tempNumber = cleanMask(event.target.value);
    var commaSeparatedNumber = tempNumber.split(/(?=(?:\d{3})+$)/).join('.');
    event.target.value = commaSeparatedNumber;
}

function calculate() {
    loanValue = cleanMask(document.getElementById('input-value').value);
    numberInstallments = document.getElementById('months').value;

    if(!loanValue || !numberInstallments) return;

    loanValueCommission = calculateLoanValueCommission();
    sureCalculated = calculateSure();
    feeValue = calculateFeeValue();
}

function printInfo() {
    document.getElementById('loan-value').innerHTML = `$ ${maskValue(loanValue)}`;
    document.getElementById('loan-value-commission').innerHTML = `$ ${maskValue(loanValueCommission)}`;
    document.getElementById('fee-value').innerHTML = `$ ${maskValue(feeValue)}`;
    document.getElementById('interest').innerHTML = `${interestRateMV} % E.M (${interestRateEA}% E.A)`;
    document.getElementById('number-installments').innerHTML = `${numberInstallments} meses`;
    document.getElementById('sure').innerHTML = `$ ${maskValue(sureCalculated)}`;
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
    return Math.round(feeValueWithSure);
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


/* --------- Utils ------------ */
function convertToDecimal(value) {
    return value / 100;
}

function convertToPercentage(value) {
    return value * 100;
}

function roundDecimals(value) {
    return Math.ceil(value * 100) / 100;
}

function onlyNumberKey(event) {
    const ASCIICode = (event.which) ? event.which : event.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
}

function cleanMask(value) {
    if(!value) return '';
    return value.replace(/\./gi, '');
}

function maskValue(value) {
    if(!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

inputValue.onkeyup = handleKeyUpThousandSeparators;
inputValue.onkeypress = onlyNumberKey;
btnCalculate.onclick = handleClickCalculate;