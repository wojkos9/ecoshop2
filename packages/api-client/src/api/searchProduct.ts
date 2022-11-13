import { Context, FacetSearchResult } from "@vue-storefront/core";

export async function searchProduct(context: Context, params: any) {
    const url = new URL('/api/searchProduct', context.config.api.url);
    params.term && url.searchParams.set('term', params.term);
    const { data } = await context.client.get(url.href);
    return data;
}
