import {
  Context,
  useUserFactory,
  UseUserFactoryParams
} from '@vue-storefront/core';
import type { User } from '@vue-storefront/ecoshop-api';
import type {
  UseUserUpdateParams as UpdateParams,
  UseUserRegisterParams as RegisterParams
} from '../types';

const params: UseUserFactoryParams<User, UpdateParams, RegisterParams> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load: async (context: Context) => {

    const app = context.$ecoshop.config.app;
    const appKey = app.$config.appKey;
    const token = app.$cookies.get(appKey + '_token');
    const result = await context.$ecoshop.api.fetchCustomer(token);
    console.log("WKD", "LOAD USER", result);
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
    const data = await context.$ecoshop.api.createUser(params);
    return data;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logIn: async (context: Context, params: { username, password }) => {
    const response = await context.$ecoshop.api.login(params);
    if (response.token !== null) {
      const app = context.$ecoshop.config.app;
      const appKey = app.$config.appKey;
      app.$cookies.set(appKey + '_token', response.token);
    }
    return {};
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changePassword: async (context: Context, { currentUser, currentPassword, newPassword }) => {
    console.log('Mocked: useUser.changePassword');
    return {};
  }
};

export const useUser = useUserFactory<User, UpdateParams, RegisterParams>(params);
