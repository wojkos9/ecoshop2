import { apiClientFactory } from '@vue-storefront/core';
import type { Setttings, Endpoints } from './types';
import { getProduct } from './api/getProduct';
import axios from 'axios';
import { getFacet } from './api/getFacet';
import { createUser } from './api/createUser';
import { login } from './api/login';
import { fetchCustomer } from './api/fetchCustomer';
import { cartAction } from './api/cart';
import { searchProduct } from './api/searchProduct';
import { makeOrder } from './api/makeOrder';
import { userOrders } from './api/userOrders';
import { changePassword } from './api/changePassword';

const init = (settings) => {
  const client = axios.create({
    baseURL: settings.api.url
  });

  return {
    config: settings,
    client
  };
};


function onCreate(settings) {
  if (!settings?.client) {
    return init(settings);
  }

  return {
    config: settings,
    client: settings.client
  };
}

const { createApiClient } = apiClientFactory<Setttings, Endpoints>({
  onCreate,
  api: {
    getProduct,
    getFacet,
    createUser,
    login,
    fetchCustomer,
    cartAction,
    searchProduct,
    makeOrder,
    userOrders,
    changePassword
  }
});

export {
  createApiClient,
  init
};
