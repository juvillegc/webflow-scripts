export function convertToDecimal(value) {
    return value / 100;
}

export function convertToPercentage(value) {
    return value * 100;
}

export function roundDecimals(value) {
    return Math.round(value * 100) / 100;
}

export function round(value) {
    return Math.round(value);
}

export function onlyNumberKey(event) {
    const ASCIICode = (event.which) ? event.which : event.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
}

export function limitCharacters(event, limit) {
    if (event.target.value.length < limit)
        return true;
    return false;
}

export function validPhoneNumber(event) {
    if (!onlyNumberKey(event)) return false;
    if (!limitCharacters(event, 10)) return false;
      
   event.target.value = event.target.value.replace(/\s/g, "");
    
    return true;
}

export function cleanMask(value) {
    if(!value) return '';
    return value.replace(/\./gi, '');
}

export function maskValue(value) {
    if(!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function handleKeyUpThousandSeparators(event) {
    var tempNumber = cleanMask(event.target.value);
    var commaSeparatedNumber = tempNumber.split(/(?=(?:\d{3})+$)/).join('.');
    event.target.value = commaSeparatedNumber;
}

export function validateEmail(event) {
    const target = event.target;
    const validateEmail = String(target.value)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );

    const idElementError = `error-message-${target.id}`;
    const elementError = document.getElementById(idElementError);

    if (validateEmail) {
        target.classList.remove('input-class__error');
        if(elementError) {
            elementError.remove();
        }
    } else if (!elementError) {
        target.classList.add('input-class__error');
        const paragraphHtml = `<p id="${idElementError}" class="input-message__error">Ingrese un correo válido</p>`;
        target.insertAdjacentHTML('afterend', paragraphHtml);
    }
}

export function validDocumentNumber(event) {
    if (!onlyNumberKey(event)) return false;
    if (!limitCharacters(event, 15)) return false;
    return true;
}

export const removeAllOptions = (select) => {
    while (select.options.length > 0) {
        select.remove(0);
    }
}

export const addFirstOption = (label, select) => {
    const option = document.createElement('option');
    option.value = "";
    option.disabled = true;
    option.selected = true;
    option.innerHTML = label;
    select.appendChild(option);
}

export const normalizeTex = (str) => {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Elimina tildes
        .replace(/ñ/g, 'n') // Reemplaza ñ por n
        .replace(/Ñ/g, 'N') // Reemplaza Ñ por N
        .replace(/,/g, ''); // Elimina comas
};


/* --------- Special Character Remover ------------ */

export const removeAccents = (str) => {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Elimina tildes
        .replace(/ñ/g, 'n') // Reemplaza ñ por n
        .replace(/Ñ/g, 'N') // Reemplaza Ñ por N
        .replace(/,/g, ''); // Elimina comas
};

export const validatePhoneError = (input) => {
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

export const configurePhoneInput  =  ( inputID = 'phoneNumber') => {
    const phoneInput = document.getElementById(inputID);
    phoneInput.addEventListener("keypress", function(e) {
        if (!/^[0-9]$/.test(e.key)) {
            e.preventDefault();
          }   
      if (phoneInput.value.length >= 10) {
        e.preventDefault();
      }
    });

    phoneInput.addEventListener("paste", function(e) {
      e.preventDefault();
    });

    validatePhoneError(phoneInput);

}

/* --------- Automate default date ------------ */

export const setTodayAsDefaultDate = (inputElement) => {
  if (!inputElement) return;

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const currentDate = `${year}-${month}-${day}`;

  inputElement.value = currentDate;
  inputElement.readOnly = true;

  inputElement.addEventListener('keydown', e => e.preventDefault());
  inputElement.addEventListener('mousedown', e => e.preventDefault());

  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'hidden';
  hiddenInput.name = inputElement.name;
  hiddenInput.value = currentDate;
  inputElement.form?.appendChild(hiddenInput);
};


/* --------- Limit text field characters ------------ */

export const setMaxFileSizeListeners = (fileInputs) => {
  fileInputs.forEach((input) => {
    const maxSize = parseInt(input.getAttribute("data-max-size")) || 5242880;

    input.addEventListener("change", () => {
      const file = input.files[0];

      if (file && file.size > maxSize) {
        input.setCustomValidity(
          `El archivo excede el tamaño máximo permitido de ${maxSize / 1048576} MB.`
        );
        input.reportValidity();
        input.value = "";
      } else {
        input.setCustomValidity("");
      }
    });
  });
};

/* ---------Validate phone field and simulator policies------------ */

export const validatePhone = (inputId = 'phoneNumber') => {
  const phoneInput = document.getElementById(inputId);
  const phone = phoneInput.value.trim();

  if (!phone || !phoneInput.checkValidity()) {
    phoneInput.setCustomValidity("Para continuar con tu simulación, ingresa tu número.");
    phoneInput.reportValidity();
    return null;
  }

  phoneInput.setCustomValidity("");
  return phone;
};

export const validatePrivacyPolicy = (checkboxId = 'privacyPolicy') => {
  const checkbox = document.getElementById(checkboxId);

  if (!checkbox.checked) {
    checkbox.setCustomValidity("Debes aceptar las políticas de tratamiento de datos para seguir.");
    checkbox.reportValidity();
    return false;
  }

  checkbox.setCustomValidity("");
  return true;
};




