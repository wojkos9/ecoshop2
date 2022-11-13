import {
    Context,
    useSearchFactory
  } from '@vue-storefront/core';

const useSearchFactoryParams = {
    async search(context: Context, params) {
        console.log("WKD PRM", params);
        const response = await context.$ecoshop.api.searchProduct(params);
        return response;
    }
};

export const useSearch = useSearchFactory(useSearchFactoryParams);