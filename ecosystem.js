import {
  configurePhoneInput,
  configureCustomSelects,
  validateCheckboxGroup,
  validateCorporateEmail
} from './shared/utils.js';

const main = () => {

  configurePhoneInput('numero_celular');
  configureCustomSelects({
    selectSelector: '.input-b2b-select',
    activeClass: 'selected'
  });
  validateCheckboxGroup({
    formSelector: 'form',
    checkboxContainerSelector: '.check-w',
    errorMessage: 'Selecciona al menos un canal antes de enviar.',
    focusClass: 'checkbox-focus'
  });
  validateCorporateEmail({
    inputSelector: '#correo_electronico',
    customMessage: 'Por favor, usa un correo corporativo válido.'
  });
};

main();

