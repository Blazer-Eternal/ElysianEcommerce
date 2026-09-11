import type { EsewaPaymentFields } from "../types/order.types";

// eSewa expects a real browser form POST, not a JS fetch — this builds one
// dynamically and submits it, navigating the browser to eSewa's gateway.
export const redirectToEsewa = (fields: EsewaPaymentFields, gatewayUrl: string): void => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = gatewayUrl;

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};