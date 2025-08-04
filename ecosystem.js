import {
  configurePhoneInput,
  configureCustomSelects,
  validateCheckboxGroup,
  validateCorporateEmail
} from './shared/utils.js';

const main = () => {
  // 📱 Validación de número celular (ya existente en utils)
  configurePhoneInput('numero_celular');

  // 🔽 Validación visual del <select>
  configureCustomSelects({
    selectSelector: '.input-b2b-select',
    activeClass: 'selected'
  });

  // ☑️ Al menos un checkbox debe estar seleccionado
  validateCheckboxGroup({
    formSelector: 'form',
    checkboxContainerSelector: '.check-w',
    errorMessage: 'Selecciona al menos un canal antes de enviar.',
    focusClass: 'checkbox-focus'
  });

  // 📧 Solo correos corporativos (no Gmail, Hotmail, etc.)
  validateCorporateEmail({
    inputSelector: '#correo_electronico',
    customMessage: 'Por favor, usa un correo corporativo válido.'
  });
};

main();

