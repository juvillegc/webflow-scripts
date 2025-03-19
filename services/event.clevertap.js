
export const sendCleverTapEvent = (eventName, properties = {}) => {

    if(!eventName || typeof properties !== 'object' || Object.keys(properties).length === 0){
        console.warn("Parámetros inválidos para enviar el evento a CleverTap");
        return;
    }

    if (properties.Phone && typeof properties.Phone === 'string' && !properties.Phone.startsWith("+")){
        properties.Phone = "+57" + properties.Phone;
    
    }

    clevertap.onUserLogin.push({
        Site: properties
      });
      
     
      clevertap.event.push(eventName, properties);
    
}


// export function sendCleverTapEvent(phone, loanValue, months) {
//     if (!phone || !loanValue || !months) {
//       console.warn("Faltan parámetros para enviar el evento a CleverTap");
//       return;
//     }
  
//     if (!phone.startsWith("+")) {
//       phone = "+57" + phone; 
//     }
  
//     clevertap.onUserLogin.push({
//       'Site': {
//         'Phone': phone,
//         'LoanValue': loanValue,
//         'Months': months
//       }
//     });
  
//     clevertap.event.push("SimuladorDatos", {
//       'Phone': phone,
//       'LoanValue': loanValue,
//       'Months': months
//     });
//   }
  
  
