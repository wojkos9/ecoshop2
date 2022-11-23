import {
  Context,
  useUserFactory,
  UseUserFactoryParams
} from '@vue-storefront/core';
import { useCart } from '../useCart';
import type { User } from '@vue-storefront/ecoshop-api';
import type {
  UseUserUpdateParams as UpdateParams,
  UseUserRegisterParams as RegisterParams
} from '../types';

const params: UseUserFactoryParams<User, UpdateParams, RegisterParams> = {
  provide() {
    return {cart: useCart()};
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load: async (context: Context) => {

    const app = context.$ecoshop.config.app;
    const appKey = app.$config.appKey;
    const token = app.$cookies.get(appKey + '_token');
    let result;
    try {
      result = await context.$ecoshop.api.fetchCustomer(token);
    } catch (e) {
      return null;
    }
    let customer = null;
    if (result) {
        customer = result.customer;
        if (customer) {
            customer.token = token;
            customer.isAuthenticated = true;
        }
        return customer;
    }
    return customer;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logOut: async (context: Context) => {
    const app = context.$ecoshop.config.app;
    const appKey = app.$config.appKey;
    const token = app.$cookies.get(appKey + '_token');
    app.$cookies.remove(appKey + '_token');
    if (token) {
      context.cart.setCart(undefined);
      app.$cookies.remove(appKey + '_cart_id');
    }
    // await context.$ecoshop.api.signOut(token).then(() => {
    //     app.$cookies.remove(appKey + '_token');
    // });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateUser: async (context: Context, { currentUser, updatedUserData }) => {
    console.log('Mocked: useUser.updateUser');
    return {};
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  register: async (context: Context, params: { email, password, firstName, lastName }) => {
    const app = context.$ecoshop.config.app;
    const appKey = app.$config.appKey;
    const currentCart = app.$cookies.get(appKey + "_cart_id") || undefined;
    const data = await context.$ecoshop.api.createUser({...params, currentCart});
    if (data.error) {
      throw {message: data.error};
    } else {

      app.$cookies.set(appKey + '_token', data.token);
      return data;
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logIn: async (context: Context, { username, password }) => {
    const app = context.$ecoshop.config.app;
    const appKey = app.$config.appKey;
    const currentCart = app.$cookies.get(appKey + "_cart_id") || undefined;
    const response = await context.$ecoshop.api.login({
      username,
      password,
      currentCart
    });
    if (response.error) {
      throw {message: "Invalid credentials"};
    }
    if (response.token !== null) {
      app.$cookies.set(appKey + '_token', response.token);
      if (response.cart) {
        app.$cookies.set(appKey + "_cart_id", response.cart.id);
        context.cart.setCart(response.cart);
      }
    }
    return {};
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changePassword: async (context: Context, { currentUser, currentPassword, newPassword }) => {
    const app = context.$ecoshop.config.app;
    const appKey = app.$config.appKey;
    const token = app.$cookies.get(appKey + '_token');
    const data = await context.$ecoshop.api.changePassword(token, {currentPassword, newPassword});
    const {error} = data;
    console.log(data)
    if (error) {
      console.log("ERROR", error);
      throw error;
    }
    return {};
  }
};

export const useUser = useUserFactory<User, UpdateParams, RegisterParams>(params);
