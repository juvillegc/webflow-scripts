
export function sendCleverTapEvent(phone, loanValue, months) {
  if (!phone || !loanValue || !months) {
    console.warn("Faltan parámetros para enviar el evento a CleverTap");
    return;
  }

  if (!phone.startsWith("+")) {
    phone = "+57" + phone; 
  }

  clevertap.onUserLogin.push({
    "Site": {
      "Phone": phone,
      "LoanValue": loanValue,
      "Months": months
    }
  });

  clevertap.event.push("SimuladorDatos", {
    "Phone": phone,
    "LoanValue": loanValue,
    "Months": months
  });
}



