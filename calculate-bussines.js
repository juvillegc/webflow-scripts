import { cleanMask, handleKeyUpThousandSeparators, maskValue, round } from "./shared/utils.js";
import { calculateType, clearInnerHTMLToZero, clearValueToZero } from "./calculate/calculator-bussines.js";

let typeAction = ''
let clear = ''

document.addEventListener('click', function(e) {

  // Inputs
  const transactions_per_month = document.querySelectorAll('input.transactions_per_month');
  const average_transaction = document.querySelectorAll('input.average_transaction');

  // HTML
  const total_sales_month = document.querySelectorAll('div.total_sales_month');
  const monthly_commission = document.querySelectorAll('div.monthly_commission');
  const data_iva_calculate = document.querySelectorAll('div.data-iva-calculate');
  const calculator_total_account = document.querySelectorAll('div.calculator_total_account');

  validateOnKeyUp(transactions_per_month, average_transaction);
  
  const elemento = e.target;
  typeAction = elemento.getAttribute('data-action');
  clear = elemento.getAttribute('data-clear');
  if (clear && clear !== '') {
    e.preventDefault();
    const divTotalSalesMonth = getOutPuts(clear, total_sales_month);
    const divMonthlyCommission = getOutPuts(clear, monthly_commission);
    const divCalculatorTotalAccount = getOutPuts(clear, calculator_total_account);
    const dataTransactionMonth = getOutPuts(clear, transactions_per_month);
    const dataAverageTransaction = getOutPuts(clear, average_transaction);
    const divIvaCalculate = getOutPuts(clear, data_iva_calculate);
    clearInnerHTMLToZero([divTotalSalesMonth, divMonthlyCommission, divCalculatorTotalAccount, divIvaCalculate]);
    clearValueToZero([dataTransactionMonth, dataAverageTransaction]);
  }
  if (typeAction) {
    e.preventDefault();
    const dataTransactionMonth = cleanMask(getInputs(transactions_per_month, typeAction));
    const dataAverageTransaction = cleanMask(getInputs(average_transaction, typeAction));
    if (dataTransactionMonth && dataAverageTransaction) {
      const response = calculateType(typeAction, Number(dataTransactionMonth), Number(dataAverageTransaction));
      if (response) {
        const divTotalSalesMonth = getOutPuts(typeAction, total_sales_month);
        const divMonthlyCommission = getOutPuts(typeAction, monthly_commission);
        const divCalculatorTotalAccount = getOutPuts(typeAction, calculator_total_account);
        const dataIvaCalculate = getOutPuts(typeAction, data_iva_calculate);
        divTotalSalesMonth.innerHTML = `$${maskValue(response.cal_total_sales_month)}`
        divMonthlyCommission.innerHTML = `$${maskValue(response.cal_monthly_commission)}`
        divCalculatorTotalAccount.innerHTML = `$${maskValue(round(response.cal_total_account))}`
        dataIvaCalculate.innerHTML = `$${maskValue(round(response.cal_iva_calculate))}`
      }
    }
  }
});

const validateOnKeyUp = (transactions_per_month, average_transaction) => {
  if (transactions_per_month && transactions_per_month.length > 0) {
    transactions_per_month.forEach(ele => {
      ele.onkeyup = handleKeyUpThousandSeparators
    })
  }
  if (average_transaction && average_transaction.length > 0) {
    average_transaction.forEach(ele => {
      ele.onkeyup = handleKeyUpThousandSeparators
    })
  }
}

/**
 * 
 * @param {*} array from <input />
 * @param {*} typeAction
 * @returns values from <input />
 */

const getInputs = (array, typeAction) => {

  if (array.length === 0) return 0;
  if (array.length === 1) return array[0].value;

  let value = 0

  array.forEach(element => {
    if (element && element.dataset && element.dataset.type === typeAction) {
      value = element.value
    }
  });
  return value
}

/**
 * 
 * @param {*} typeAction 
 * @param {*} array from HTMLDivElement[]
 * @returns HTMLDivElement()
 */

const getOutPuts = (typeAction = '', array = []) => {
  if (array.length === 0) return new HTMLDivElement();

  if (array.length === 1) return array[0];

  let value = null;

  array.forEach(element => {
    if (element && element.dataset && element.dataset.type === typeAction) {
      value = element
    }
  });

  return value;
}