export const sendCleverTapEventEventOnly = (eventName, properties = {}) => {
  if (!eventName || typeof properties !== "object" || Object.keys(properties).length === 0) {
    console.warn("Parámetros inválidos para enviar el evento a CleverTap");
    return;
  }

  if (typeof window === "undefined" || !window.clevertap) {
    console.warn("CleverTap no está disponible en window");
    return;
  }

  const eventProps = { ...properties };

  if (eventProps.Phone && typeof eventProps.Phone === "string" && !eventProps.Phone.startsWith("+")) {
    eventProps.Phone = "+57" + eventProps.Phone;
  }

  if (eventProps.Phone) {
    window.clevertap.onUserLogin.push({
      Site: { Phone: eventProps.Phone },
    });
  }

  window.clevertap.event.push(eventName, eventProps);
};
