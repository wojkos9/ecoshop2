export async function getProduct(context, params) {
    // Create URL object containing full endpoint URL
    const url = new URL('/products', context.config.api.url);

    // Add parameters passed from composable as query strings to the URL
    params.id && url.searchParams.set('id', params.id);
    params.catId && url.searchParams.set('catId', params.catId);
    params.limit && url.searchParams.set('limit', params.limit);

    // Use axios to send a GET request
    const { data } = await context.client.get(url.href);

    // Return data from the API
    return data;
}
  