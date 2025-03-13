
document.addEventListener("DOMContentLoaded", function() {
    const formClevertap = document.querySelector('#wf-form-clevertap');
    if (formClevertap) {
        formClevertap.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita el envío inmediato del formulario
            
            const name = formClevertap.querySelector("input[name='userName']").value;
            const email = formClevertap.querySelector("input[name='userEmail']").value;
            let phone = formClevertap.querySelector("input[name='userPhone']").value;
            
            // Asegúrate de que el número de teléfono tenga el formato internacional
            if (!phone.startsWith("+")) {
                phone = "+57" + phone; // Reemplaza "+57" con tu código de país
            }
            
            // Identificamos o actualizamos el usuario
            clevertap.onUserLogin.push({
                "Site": {
                    "Name": name,
                    "Email": email,
                    "Phone": phone
                }
            });
            
            // Disparamos el evento personalizado
            clevertap.event.push("Webflow-subscribe-click", {
                "Name": name,
                "Email": email,
                "Phone": phone
            });
            
            console.log("Usuario logueado y evento 'Webflow-subscribe-click' enviado a CleverTap.");
        });
    }
});


