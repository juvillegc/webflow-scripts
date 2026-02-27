/* --------- CleverTap: Identify only (Phone) + Event properties ------------ */
export const sendCleverTapEventEventOnly = (eventName, properties = {}) => {
  if (!eventName || typeof properties !== "object" || Object.keys(properties).length === 0) {
    console.warn("Parámetros inválidos para enviar el evento a CleverTap");
    return;
  }

  const eventProps = { ...properties };

  if (eventProps.Phone && typeof eventProps.Phone === "string" && !eventProps.Phone.startsWith("+")) {
    eventProps.Phone = "+57" + eventProps.Phone;
  }

  // ✅ Identifica SOLO con Phone
  if (eventProps.Phone) {
    clevertap.onUserLogin.push({
      Site: { Phone: eventProps.Phone },
    });
  }

  // ✅ Evento con datos (esto es lo que ves en Activity)
  clevertap.event.push(eventName, eventProps);
};
