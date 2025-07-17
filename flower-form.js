import { configurePhoneInput, validateEmail } from './shared/utils.js';
import { sendCleverTapEvent } from './services/event.clevertap.js';

// ✅ Obtenemos referencias directas por ID
const form = document.getElementById('wf-form-clevertap');
const inputName = document.getElementById('userName');
const inputPhone = document.getElementById('userPhone');
const inputEmail = document.getElementById('userEmail');

if (form && inputName && inputPhone && inputEmail) {
  
  // ✅ 1. Configuramos validaciones desde utils
  configurePhoneInput('userPhone');          // solo números, máximo 10, bloquea pegar
  inputEmail.addEventListener('input', validateEmail); // valida formato del email

  // ✅ 2. Submit → manda datos a CleverTap y luego a Webflow
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = inputPhone.value.trim();

    sendCleverTapEvent('form_contact_submitted', {
      Name: name,
      Email: email,
      Phone: phone,
      formName: 'Formulario Contacto Webflow',
      privacyPolicy: true
    });

    console.log('✅ Evento form_contact_submitted enviado a CleverTap');

    // ✅ Luego dejamos que Webflow procese el envío normal (reCAPTCHA)
    form.submit();
  });
}
