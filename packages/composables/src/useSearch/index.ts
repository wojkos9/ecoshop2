import {
    Context,
    useSearchFactory
  } from '@vue-storefront/core';

const useSearchFactoryParams = {
    async search(context: Context, params) {
        const response = await context.$ecoshop.api.searchProduct(params);
        return response;
    }
};

export const useSearch = useSearchFactory(useSearchFactoryParams);