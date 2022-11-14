import {
  Context,
  useUserOrderFactory,
  UseUserOrderFactoryParams
} from '@vue-storefront/core';
import type { Order } from '@vue-storefront/ecoshop-api';
import type {
  useUserOrderSearchParams as SearchParams
} from '../types';

const params: UseUserOrderFactoryParams<Order, SearchParams> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchOrders: async (context: Context, params) => {
    const app = context.$ecoshop.config.app;
    const appKey = app.$config.appKey;
    const token = app.$cookies.get(appKey + '_token');
    const result = await context.$ecoshop.api.userOrders(token);
    return {orders: result};
  }
};

export const useUserOrder = useUserOrderFactory<Order, SearchParams>(params);
