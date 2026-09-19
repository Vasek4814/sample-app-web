import type { CheckoutFormData } from "../pageObject/pages/CheckoutPage";

const DEFAULT_CHECKOUT_DATA: CheckoutFormData = {
  firstName: "Vasiliy",
  lastName: "Naberezhniy",
  zip: "142190",
};

export const checkoutData = {
  output: (overrides?: Partial<CheckoutFormData>): CheckoutFormData => ({
    ...DEFAULT_CHECKOUT_DATA,
    ...overrides,
  }),
};
