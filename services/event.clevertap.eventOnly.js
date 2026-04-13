/* --------- CleverTap: Identity = Phone + Event properties ------------ */
export const sendCleverTapEventEventOnly = (eventName, properties = {}) => {
  if (!eventName || typeof properties !== "object" || Object.keys(properties).length === 0) {
    console.warn("Parámetros inválidos para enviar el evento a CleverTap");
    return;
  }

  const eventProps = { ...properties };

  // Normaliza Phone a E.164 (+57)
  if (eventProps.Phone && typeof eventProps.Phone === "string" && !eventProps.Phone.startsWith("+")) {
    eventProps.Phone = `+57${eventProps.Phone}`;
  }

  // ✅ Identifica usuario SOLO con Identity (Phone)
  if (eventProps.Phone) {
    clevertap.onUserLogin.push({
      Site: {
        Identity: eventProps.Phone, // Identified
        Phone: eventProps.Phone,    // opcional (sirve para búsquedas/atributo)
      },
    });
  }

  // ✅ Evento con todas las propiedades (Event properties)
  clevertap.event.push(eventName, eventProps);
};
