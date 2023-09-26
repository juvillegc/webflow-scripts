
import { convertToDecimal } from '../shared/utils.js';

const MONTHLY_COMMISSION = 1;
const IVA = 19;
const CODE_FOR_SILVER = 990;
const DISPERSIONS = 1000;
const PER_COMISSION_TRANSACTION = 1.5;
const CHARGE_TRANSACTION = 2900;

export function calculateType(typeCalculate = '', transaction_per_month, transaction_avarage) {
  const cal_total_sales_month = transaction_per_month * transaction_avarage
  let responseCalculate = {
    cal_total_sales_month,
  };
  switch (typeCalculate) {
    case 'super-qr':
      responseCalculate = { ...responseCalculate, ...calculateSuperQR(cal_total_sales_month) }
      break;
    case 'code-silver':
      responseCalculate = { ...responseCalculate, ...calculateCodesForSilver(cal_total_sales_month, transaction_per_month) };
      break;
    case 'dispersions':
      responseCalculate = { ...responseCalculate, ...calculateDispersions(cal_total_sales_month, transaction_per_month) };
      break;
    case 'payment':
      responseCalculate = { ...responseCalculate, ...calculateChargeNequi(cal_total_sales_month, transaction_per_month, transaction_avarage) };
      break;
    case 'api':
      responseCalculate = { ...responseCalculate, ...calculateChargeNequi(cal_total_sales_month, transaction_per_month, transaction_avarage) };
      break;
    case 'ally':
      responseCalculate = { ...responseCalculate, ...calculateChargeNequi(cal_total_sales_month, transaction_per_month, transaction_avarage) };
      break;
    default:
      break;
  }
  return responseCalculate
}

export function clearValueToZero(arrayInput = []) {
  arrayInput.forEach(element => {
    element.value = ''
  });
}

export function clearInnerHTMLToZero(arrayHTML = []) {
  arrayHTML.forEach(element => {
    element.innerHTML = '$0'
  });
}


const calculateSuperQR = (cal_total_sales_month) => {
  const cal_monthly_commission = cal_total_sales_month * convertToDecimal(MONTHLY_COMMISSION);
  const cal_total_account = cal_total_sales_month - cal_monthly_commission - (cal_monthly_commission * convertToDecimal(IVA));
  const cal_iva_calculate = cal_monthly_commission * convertToDecimal(IVA);
  return {
    cal_monthly_commission,
    cal_total_account,
    cal_iva_calculate
  }
}

const calculateCodesForSilver = (cal_total_sales_month, transaction_per_month) => {
  const cal_monthly_commission = transaction_per_month * CODE_FOR_SILVER;
  const cal_total_account = cal_total_sales_month - cal_monthly_commission - (cal_monthly_commission * convertToDecimal(IVA));
  const cal_iva_calculate = cal_monthly_commission * convertToDecimal(IVA);
  return {
    cal_monthly_commission,
    cal_total_account,
    cal_iva_calculate
  }
}

const calculateDispersions = (cal_total_sales_month, transaction_per_month) => {
  const cal_monthly_commission = transaction_per_month * DISPERSIONS;
  const cal_total_account = cal_total_sales_month - cal_monthly_commission - (cal_monthly_commission * convertToDecimal(IVA));
  const cal_iva_calculate = cal_monthly_commission * convertToDecimal(IVA);
  return {
    cal_monthly_commission,
    cal_total_account,
    cal_iva_calculate
  }
}

const calculateChargeNequi = (cal_total_sales_month, transaction_per_month, transaction_avarage) => {
  let cal_monthly_commission = 0;
  let commission_transaction = transaction_avarage * convertToDecimal(PER_COMISSION_TRANSACTION);
  if (commission_transaction < 2900) {
    cal_monthly_commission = cal_total_sales_month * convertToDecimal(PER_COMISSION_TRANSACTION);
  } else {
    cal_monthly_commission = transaction_per_month * CHARGE_TRANSACTION;
  }
  const cal_total_account = cal_total_sales_month - cal_monthly_commission - (cal_monthly_commission * convertToDecimal(IVA));
  const cal_iva_calculate = cal_monthly_commission * convertToDecimal(IVA);
  return {
    cal_monthly_commission,
    cal_total_account,
    cal_iva_calculate
  }
}


