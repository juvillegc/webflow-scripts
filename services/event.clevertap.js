
export function sendCleverTapEvent(phone, loanValue, months) {
  if (!phone || !loanValue || !months) {
    console.warn("Faltan parámetros para enviar el evento a CleverTap");
    return;
  }

  if (!phone.startsWith("+")) {
    phone = "+57" + phone; 
  }

  clevertap.onUserLogin.push({
    "Site": { "Phone": phone }
  });

  clevertap.event.push("SimuladorDatos", {
    "Phone": phone,
    "LoanValue": loanValue,
    "Months": months
  });

  console.log("Evento 'Simulador' enviado a CleverTap:", { phone, loanValue, months });
}


export const validatePhoneNumber = (input) => {
  let errorMsg = document.createElement("span");
  errorMsg.classList.add("error-msg");
  errorMsg.style.color = "red";
  errorMsg.style.fontSize = "12px";
  errorMsg.style.display = "none";
  errorMsg.innerText = "El número debe tener 10 dígitos.";

  input.parentNode.insertBefore(errorMsg, input.nextSibling);

  input.addEventListener("input", () => {
    if (input.value.length < 10) {
      input.style.border = "2px solid red";
      errorMsg.style.display = "block";
      input.setCustomValidity("El número debe tener 10 dígitos.");
    } else {
      input.style.border = "";
      errorMsg.style.display = "none";
      input.setCustomValidity("");
    }
  });
};
