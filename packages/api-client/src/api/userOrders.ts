import { Context } from "@vue-storefront/core";

export async function userOrders(context: Context, token) {
    const url = new URL('/api/userOrders', context.config.api.url);
    let config;
    if (token) {
        config = {headers: {
            "Authorization": `Token ${token}`
        }};
    }
    const { data } = await context.client.get(url.href, config);

    return data;
}
