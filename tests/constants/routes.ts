export const ROUTES = {
  LOGIN: '/',
  INVENTORY: '/inventory.html',
  CART: '/cart.html',
  CHECKOUT_STEP_ONE: '/checkout-step-one.html',
  CHECKOUT_STEP_TW0: '/checkout-step-two.html',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

export const URL_PATTERN = {
  INVENTORY: /.*inventory\.html/,
  CART: /.*cart\.html/,
  CHECKOUT_STEP_ONE: /.*checkout-step-one\.html/,
  CHECKOUT_STEP_TW0: /.*checkout-step-two\.html/,
  INVENTORY_ITEM: /inventory-item\.html\?id=\d+/,
} as const;
