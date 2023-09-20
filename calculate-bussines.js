import { maskValue, round } from "./shared/utils.js";
import { calculateType, clearInnerHTMLToZero, clearValueToZero } from "./calculate/calculator-bussines.js";

let typeAction = ''
let clear = ''

document.addEventListener('click', function(e) {

  // buttons
  const button = document.querySelectorAll('input.calculator-button--calculate');
  const clearBtn = document.querySelectorAll('input.calculator-button--clear');

  // Inputs
  const transactions_per_month = document.querySelectorAll('input.transactions_per_month');
  const average_transaction = document.querySelectorAll('input.average_transaction');

  // HTML
  const total_sales_month = document.querySelectorAll('div.total_sales_month');
  const monthly_commission = document.querySelectorAll('div.monthly_commission');
  const data_iva_calculate = document.querySelectorAll('div.data-iva-calculate');
  const calculator_total_account = document.querySelectorAll('div.calculator_total_account');

  const elemento = e.target;
  typeAction = elemento.getAttribute('data-action');
  clear = elemento.getAttribute('data-clear');
  if (clear && clear !== '') {
    const divTotalSalesMonth = getOutPuts(clear, total_sales_month);
    const divMonthlyCommission = getOutPuts(clear, monthly_commission);
    const divCalculatorTotalAccount = getOutPuts(clear, calculator_total_account);
    const dataTransactionMonth = getOutPuts(clear, transactions_per_month)
    const dataAverageTransaction = getOutPuts(clear, average_transaction)
    clearInnerHTMLToZero([divTotalSalesMonth, divMonthlyCommission, divCalculatorTotalAccount]);
    clearValueToZero([dataTransactionMonth, dataAverageTransaction]);
  }
  if (typeAction) {
    const dataTransactionMonth = getInputs(transactions_per_month, typeAction);
    const dataAverageTransaction = getInputs(average_transaction, typeAction);
    if (dataTransactionMonth && dataAverageTransaction) {
      const response = calculateType(typeAction, dataTransactionMonth, dataAverageTransaction);
      if (response) {
        const divTotalSalesMonth = getOutPuts(typeAction, total_sales_month);
        const divMonthlyCommission = getOutPuts(typeAction, monthly_commission);
        const divCalculatorTotalAccount = getOutPuts(typeAction, calculator_total_account);
        divTotalSalesMonth.innerHTML = `$ ${maskValue(response.cal_total_sales_month)}`
        divMonthlyCommission.innerHTML = `$ ${maskValue(response.cal_monthly_commission)}`
        divCalculatorTotalAccount.innerHTML = `$ ${maskValue(round(response.cal_total_account))}`
      }
    }
  }
});

const getInputs = (array, typeAction) => {

  if (array.length === 0) return 0;
  if (array.length === 1) return array[0].valueAsNumber;

  let value = 0

  array.forEach(element => {
    if (element && element.dataset && element.dataset.type === typeAction) {
      value = element.valueAsNumber
    }
  });
  return value
}

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
