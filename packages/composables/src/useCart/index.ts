import {
  Context,
  useCartFactory,
  UseCartFactoryParams
} from '@vue-storefront/core';
import type {
  Cart,
  CartItem,
  Product
} from '@vue-storefront/ecoshop-api';

const params: UseCartFactoryParams<Cart, CartItem, Product> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load: async (context: Context, { customQuery }) => {
      // check if cart is already initiated
      console.log("WKD CART LOAD")
      const app = context.$ecoshop.config.app;
      const appKey = app.$config.appKey;
      let existngCartId = app.$cookies.get(appKey + '_cart_id');
      if ((existngCartId === undefined || existngCartId === '')) {
          // Initiate new cart
          existngCartId = await context.$ecoshop.api.cartAction("create").then((checkout) => {
              app.$cookies.set(appKey + '_cart_id', checkout.id, { maxAge: 60 * 60 * 24 * 365, path: '/' });
              return checkout.id;
          });
      }
      const checkoutId = existngCartId;
      // Keep existing cart
      const plainResp = await context.$ecoshop.api.cartAction("get", {currentCart: existngCartId}).then((checkout) => {
          // Do something with the checkout
          return checkout;
      });
      return JSON.parse(JSON.stringify(plainResp));
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addItem: async (context: Context, param: { currentCart, product, quantity, customQuery }) => {
    console.log('Mocked: useCart.addItem', param);
    const data = await context.$ecoshop.api.cartAction("update", {...param, is_add: true});
    return JSON.parse(JSON.stringify(data));
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeItem: async (context: Context, param: { currentCart, product, customQuery }) => {
    const data = await context.$ecoshop.api.cartAction("update", {...param, quantity: 0});
    return JSON.parse(JSON.stringify(data));
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateItemQty: async (context: Context, param: { currentCart, product, quantity, customQuery }) => {
    console.log('Mocked: useCart.updateItemQty', param);
    const data = await context.$ecoshop.api.cartAction("update", param);
    return JSON.parse(JSON.stringify(data));
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clear: async (context: Context, { currentCart }) => {
    console.log('Mocked: useCart.clear');
    return {};
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyCoupon: async (context: Context, { currentCart, couponCode, customQuery }) => {
    console.log('Mocked: useCart.applyCoupon');
    return {
      updatedCart: {},
      updatedCoupon: {}
    };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeCoupon: async (context: Context, { currentCart, couponCode, customQuery }) => {
    console.log('Mocked: useCart.removeCoupon');
    return {
      updatedCart: {}
    };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isInCart: (context: Context, { currentCart, product }) => {
    console.log('Mocked: useCart.isInCart');
    return false;
  }
};

export const useCart = useCartFactory<Cart, CartItem, Product>(params);
