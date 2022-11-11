import { Context, FacetSearchResult } from "@vue-storefront/core";

export async function getFacet(context: Context, params: FacetSearchResult<any>) {
    // Create URL object containing full endpoint URL
    const url = new URL('/api/getFacet', context.config.api.url);

    // Add parameters passed from composable as query strings to the URL
    params.input.categorySlug && url.searchParams.set('cat', params.input.categorySlug);
    // Use axios to send a GET request
    const { data } = await context.client.get(url.href);

    // Return data from the API
    return data;
}
  