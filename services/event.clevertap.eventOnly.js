/* --------- CleverTap: Identify only (Phone) + Event properties ------------ */
export const sendCleverTapEventEventOnly = (eventName, properties = {}) => {
  if (!eventName || typeof properties !== "object" || Object.keys(properties).length === 0) {
    console.warn("Parámetros inválidos para enviar el evento a CleverTap");
    return;
  }

  const eventProps = { ...properties };

  // Normaliza Phone a +57 si viene sin +
  if (eventProps.Phone && typeof eventProps.Phone === "string" && !eventProps.Phone.startsWith("+")) {
    eventProps.Phone = "+57" + eventProps.Phone;
  }

  // ✅ Identifica usuario SOLO con Phone (sin “contaminar” perfil)
  if (eventProps.Phone) {
    clevertap.onUserLogin.push({
      Site: { Phone: eventProps.Phone },
    });
  }

  // ✅ Evento con todas las propiedades
  clevertap.event.push(eventName, eventProps);
};
