import {
  Context,
  useMakeOrderFactory,
  UseMakeOrderFactoryParams
} from '@vue-storefront/core';
import type { Order } from '@vue-storefront/ecoshop-api';

const factoryParams: UseMakeOrderFactoryParams<Order> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  make: async (context: Context, { customQuery }) => {
    const app = context.$ecoshop.config.app;
    const appKey = app.$config.appKey;
    const cartId = app.$cookies.get(appKey + '_cart_id');
    const { order, error } = await context.$ecoshop.api.makeOrder({cart: cartId});
    return { id: order, error };
  }
};

export const useMakeOrder = useMakeOrderFactory<Order>(factoryParams);
