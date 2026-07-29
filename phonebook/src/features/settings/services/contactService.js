export const pickContact = async () => {
  // Browser doesn't support Contact Picker API
  if (!("contacts" in navigator) || !("ContactsManager" in window)) {
    throw new Error(
      "Contact picker is not supported on this device or browser."
    );
  }

  try {
    const contacts = await navigator.contacts.select(
      ["name", "tel"],
      { multiple: false }
    );

    if (!contacts.length) return null;

    const contact = contacts[0];

    return {
      name: contact.name?.[0] || "",
      phone: normalizePhone(contact.tel?.[0] || ""),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const normalizePhone = (phone) => {
  return phone.replace(/\D/g, "");
};